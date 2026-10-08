from contextlib import contextmanager
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Literal
from uuid import uuid4
import hmac
import json
import logging
import os
import re
import secrets
import shutil
import tempfile

from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from filelock import FileLock, Timeout
from pydantic import BaseModel, Field, field_validator, model_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = Path(__file__).resolve().parent / "data"
STORE_FILE = DATA_DIR / "store.json"
STORE_LOCK = FileLock(str(DATA_DIR / "store.json.lock"), timeout=10)
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN") or secrets.token_urlsafe(48)
ORDER_STATUSES = ["결제완료", "배송준비", "배송중", "배송완료"]
CATEGORIES = Literal["OUTER", "TOP", "PANTS", "SHOES", "BAG", "ACC"]
SEED_PRODUCTS = json.loads((ROOT_DIR / "catalog.json").read_text(encoding="utf-8"))
StockCount = Annotated[int, Field(ge=0, le=100000)]


def image_url(value: str | None) -> str | None:
    if not value:
        return None
    value = value.strip()
    if value.startswith("images/") and not any(part == ".." for part in value.split("/")) and not re.search(r"[\\\x00-\x1f]", value):
        return value
    from urllib.parse import urlsplit
    parsed = urlsplit(value)
    if parsed.scheme == "https" and parsed.hostname and not parsed.username and not parsed.password:
        return value
    raise ValueError("이미지는 images/ 경로 또는 HTTPS 주소를 사용해주세요.")


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=128)


class ProductPayload(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    brand: str = Field(min_length=1, max_length=80)
    category: CATEGORIES
    price: int = Field(ge=0, le=100000000)
    discount: int = Field(ge=0, le=80)
    image: str = Field(min_length=1, max_length=2000)
    hoverImage: str | None = Field(default=None, max_length=2000)
    sizes: list[str] = Field(min_length=1, max_length=20)
    stock: dict[str, StockCount] = Field(default_factory=dict)
    rating: float = Field(default=0, ge=0, le=5)
    isBest: bool = False
    isNew: bool = True
    colors: list[str] = Field(default_factory=list, max_length=20)
    collections: list[str] = Field(default_factory=list, max_length=10)

    @field_validator("name", "brand")
    @classmethod
    def text_required(cls, value):
        value = value.strip()
        if not value or re.search(r"[\x00-\x1f]", value):
            raise ValueError("올바른 상품명과 브랜드를 입력해주세요.")
        return value

    @field_validator("image", "hoverImage")
    @classmethod
    def valid_image(cls, value):
        return image_url(value)

    @field_validator("sizes")
    @classmethod
    def valid_sizes(cls, value):
        cleaned = [size.strip() for size in value]
        if len(set(cleaned)) != len(cleaned) or any(not size or len(size) > 24 or re.search(r"[\x00-\x1f]", size) for size in cleaned):
            raise ValueError("중복 없이 올바른 옵션을 입력해주세요.")
        return cleaned

    @field_validator("colors")
    @classmethod
    def valid_colors(cls, value):
        if any(not re.fullmatch(r"#[0-9a-fA-F]{6}", color) for color in value):
            raise ValueError("색상은 6자리 HEX 코드로 입력해주세요.")
        return value

    @field_validator("collections")
    @classmethod
    def valid_collections(cls, value):
        if any(not item.strip() or len(item) > 100 for item in value):
            raise ValueError("기획전 이름을 확인해주세요.")
        return value

    @model_validator(mode="after")
    def align_stock(self):
        if set(self.stock) - set(self.sizes):
            raise ValueError("등록된 옵션의 재고만 입력해주세요.")
        self.stock = {size: self.stock.get(size, 0) for size in self.sizes}
        return self


class Customer(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    phone: str = Field(min_length=7, max_length=24)
    address: str = Field(min_length=1, max_length=300)

    @field_validator("name", "address")
    @classmethod
    def required(cls, value):
        value = value.strip()
        if not value or re.search(r"[\x00-\x1f]", value):
            raise ValueError("수령인과 주소를 확인해주세요.")
        return value

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        value = value.strip()
        if not re.fullmatch(r"\+?[0-9 ()-]+", value) or not 7 <= len(re.sub(r"\D", "", value)) <= 15:
            raise ValueError("연락처를 확인해주세요.")
        return value


class OrderItem(BaseModel):
    id: int = Field(gt=0)
    size: str = Field(min_length=1, max_length=24)
    quantity: int = Field(gt=0, le=100000)


class OrderPayload(BaseModel):
    customer: Customer
    items: list[OrderItem] = Field(min_length=1, max_length=100)
    coupon: Literal["BLACK10", "WELCOME15", "FREESHIP"] | None = None
    memo: str | None = Field(default=None, max_length=500)


class OrderStatusPayload(BaseModel):
    status: Literal["결제완료", "배송준비", "배송중", "배송완료"]


class NewsletterPayload(BaseModel):
    email: str = Field(min_length=3, max_length=254)

    @field_validator("email")
    @classmethod
    def valid_email(cls, value):
        value = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("이메일 주소를 확인해주세요.")
        return value


class ContactPayload(NewsletterPayload):
    name: str = Field(min_length=1, max_length=60)
    message: str = Field(min_length=1, max_length=2000)

    @field_validator("name", "message")
    @classmethod
    def nonempty(cls, value):
        if not value.strip():
            raise ValueError("문의 내용을 입력해주세요.")
        return value.strip()


def now_text():
    return datetime.now(timezone.utc).isoformat()


def default_store():
    return {"schemaVersion": 2, "nextProductId": max(item["id"] for item in SEED_PRODUCTS) + 1,
            "products": deepcopy(SEED_PRODUCTS), "orders": [], "contacts": [], "newsletter": []}


def write_store(data):
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=DATA_DIR, prefix="store-", suffix=".tmp", delete=False) as file:
            temporary = Path(file.name)
            json.dump(data, file, ensure_ascii=False, indent=2)
            file.flush()
            os.fsync(file.fileno())
        os.replace(temporary, STORE_FILE)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()


def read_store():
    if not STORE_FILE.exists():
        data = default_store()
        write_store(data)
        return data
    data = json.loads(STORE_FILE.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or any(not isinstance(data.get(key), list) for key in ("products", "orders", "contacts", "newsletter")):
        raise ValueError("Invalid store")
    if any(not isinstance(item, dict) for key in ("products", "orders", "contacts", "newsletter") for item in data[key]):
        raise ValueError("Invalid records")
    # Legacy backend IDs were different from the storefront; preserve records and remap by asset.
    if data.get("schemaVersion") != 2:
        backup = DATA_DIR / "store.before-upgrade.json"
        if not backup.exists():
            shutil.copy2(STORE_FILE, backup)
        by_image = {product["image"]: product["id"] for product in SEED_PRODUCTS}
        next_id = max([product["id"] for product in SEED_PRODUCTS] + [int(item.get("id", 0)) for item in data["products"]]) + 1
        mapping, used = {}, set()
        for product in data["products"]:
            old_id = product["id"]
            new_id = by_image.get(product.get("image"))
            if new_id is None or new_id in used:
                new_id = next_id
                next_id += 1
            mapping[old_id] = new_id
            used.add(new_id)
            product["id"] = new_id
        for order in data["orders"]:
            for item in order.get("items", []):
                item["id"] = by_image.get(item.get("image"), mapping.get(item.get("id"), item.get("id")))
        data.update(schemaVersion=2, nextProductId=next_id)
        write_store(data)
    return data


@contextmanager
def store_transaction(write=False):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with STORE_LOCK:
        data = read_store()
        yield data
        if write:
            write_store(data)


def require_admin(token):
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail="서버 관리자 기능이 설정되어 있지 않습니다.")
    if not token or not hmac.compare_digest(token.encode(), ADMIN_TOKEN.encode()):
        raise HTTPException(status_code=401, detail="관리자 권한이 필요합니다.")


class RequestSizeLimit:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope.get("method") not in {"POST", "PUT", "PATCH"}:
            return await self.app(scope, receive, send)
        headers = dict(scope.get("headers", []))
        length = headers.get(b"content-length", b"")
        if length and (not length.isdigit() or int(length) > 65536):
            return await JSONResponse({"detail": "요청 크기가 너무 큽니다."}, status_code=413)(scope, receive, send)
        body = bytearray()
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            body.extend(message.get("body", b""))
            if len(body) > 65536:
                return await JSONResponse({"detail": "요청 크기가 너무 큽니다."}, status_code=413)(scope, receive, send)
            if not message.get("more_body", False):
                break
        delivered = False

        async def replay():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {"type": "http.request", "body": bytes(body), "more_body": False}
            return await receive()

        await self.app(scope, replay, send)


app = FastAPI(title="BLACK FIT API", description="포트폴리오용 모의 주문 API. 실제 결제·배송은 진행되지 않습니다.", version="1.1.0")
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"], storage_uri=os.environ.get("RATELIMIT_STORAGE_URI", "memory://"))
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestSizeLimit)
origins = [origin.strip() for origin in os.environ.get("ALLOWED_ORIGINS", "").split(",") if origin.strip()]
if origins:
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"], allow_headers=["Content-Type", "X-Admin-Token"])


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
    if request.url.path.startswith("/docs") or request.url.path == "/redoc":
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


async def storage_error(request, error):
    logging.getLogger("blackfit").error("Store unavailable: %s", type(error).__name__)
    return JSONResponse({"detail": "데이터를 안전하게 저장하지 못했습니다. 잠시 후 다시 시도해주세요."}, status_code=503)


for error_type in (OSError, json.JSONDecodeError, ValueError, Timeout):
    app.add_exception_handler(error_type, storage_error)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "BLACK FIT API", "mode": "demo"}


@app.post("/api/auth/login")
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest):
    if payload.username.strip() == ADMIN_USER:
        if not ADMIN_PASSWORD or not hmac.compare_digest(payload.password.encode(), ADMIN_PASSWORD.encode()):
            raise HTTPException(status_code=401, detail="관리자 로그인 정보를 확인해주세요.")
        return {"id": ADMIN_USER, "role": "admin", "token": ADMIN_TOKEN}
    return {"id": payload.username.strip(), "role": "member", "token": None, "demo": True}


@app.get("/api/products")
def list_products(category: str | None = Query(default=None, max_length=24), keyword: str | None = Query(default=None, max_length=200),
                  best: bool | None = None, new: bool | None = Query(default=None, alias="is_new")):
    with store_transaction() as store:
        products = store["products"]
        if category and category.upper() != "ALL":
            products = [item for item in products if item.get("category") == category.upper()]
        if best is not None:
            products = [item for item in products if bool(item.get("isBest")) == best]
        if new is not None:
            products = [item for item in products if bool(item.get("isNew")) == new]
        if keyword:
            value = keyword.lower()
            products = [item for item in products if any(value in str(item.get(field, "")).lower() for field in ("name", "brand", "category"))]
        return {"items": products, "count": len(products)}


@app.post("/api/products", status_code=201)
@limiter.limit("30/minute")
def create_product(request: Request, payload: ProductPayload, x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction(write=True) as store:
        next_id = max(store.get("nextProductId", 1), max([item["id"] for item in store["products"]] or [0]) + 1)
        product = payload.model_dump()
        product.update(id=next_id, createdAt=int(datetime.now().strftime("%Y%m%d")))
        store["nextProductId"] = next_id + 1
        store["products"].insert(0, product)
        return product


@app.put("/api/products/{product_id}")
@limiter.limit("30/minute")
def update_product(request: Request, product_id: int, payload: ProductPayload, x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction(write=True) as store:
        for index, product in enumerate(store["products"]):
            if product["id"] == product_id:
                updated = payload.model_dump()
                updated.update(id=product_id, createdAt=product.get("createdAt", 0))
                store["products"][index] = updated
                return updated
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")


@app.delete("/api/products/{product_id}")
@limiter.limit("30/minute")
def delete_product(request: Request, product_id: int, x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction(write=True) as store:
        before = len(store["products"])
        store["products"] = [item for item in store["products"] if item["id"] != product_id]
        if before == len(store["products"]):
            raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
        return {"ok": True}


@app.get("/api/orders")
def list_orders(x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction() as store:
        return {"items": store["orders"], "count": len(store["orders"])}


@app.post("/api/orders", status_code=201)
@limiter.limit("10/minute")
def create_order(request: Request, payload: OrderPayload):
    with store_transaction(write=True) as store:
        catalog = {product["id"]: product for product in store["products"]}
        grouped = {}
        for item in payload.items:
            key = (item.id, item.size)
            grouped[key] = grouped.get(key, 0) + item.quantity
        items = []
        for (product_id, size), quantity in grouped.items():
            product = catalog.get(product_id)
            if not product or size not in product.get("sizes", []):
                raise HTTPException(status_code=400, detail="상품 또는 옵션을 확인해주세요.")
            if quantity > product.get("stock", {}).get(size, 0):
                raise HTTPException(status_code=409, detail="선택한 옵션의 재고가 부족합니다.")
            price = (product["price"] * (100 - product["discount"]) + 50) // 100
            items.append({"id": product_id, "name": product["name"], "size": size, "quantity": quantity, "price": price, "image": product["image"]})
        subtotal = sum(item["price"] * item["quantity"] for item in items)
        discount = (subtotal * 10 + 50) // 100 if payload.coupon == "BLACK10" else min((subtotal * 15 + 50) // 100, 20000) if payload.coupon == "WELCOME15" else 0
        shipping = 3000 if 0 < subtotal < 50000 and payload.coupon != "FREESHIP" else 0
        for item in items:
            catalog[item["id"]]["stock"][item["size"]] -= item["quantity"]
        order = {"orderNumber": f"BF-{uuid4().hex.upper()}", "customer": payload.customer.model_dump(), "items": items,
                 "subtotal": subtotal, "shipping": shipping, "discount": discount, "total": subtotal - discount + shipping,
                 "coupon": payload.coupon, "memo": payload.memo, "status": "결제완료", "demo": True, "createdAt": now_text()}
        store["orders"].insert(0, order)
        return order


@app.patch("/api/orders/{order_number}")
@limiter.limit("30/minute")
def update_order_status(request: Request, order_number: str, payload: OrderStatusPayload, x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction(write=True) as store:
        for order in store["orders"]:
            if order["orderNumber"] == order_number:
                order["status"] = payload.status
                return order
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")


@app.delete("/api/orders/{order_number}")
@limiter.limit("30/minute")
def delete_order(request: Request, order_number: str, x_admin_token: str | None = Header(default=None)):
    require_admin(x_admin_token)
    with store_transaction(write=True) as store:
        before = len(store["orders"])
        store["orders"] = [order for order in store["orders"] if order["orderNumber"] != order_number]
        if before == len(store["orders"]):
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")
        return {"ok": True}


@app.post("/api/contact", status_code=201)
@limiter.limit("5/minute")
def create_contact(request: Request, payload: ContactPayload):
    with store_transaction(write=True) as store:
        contact = {**payload.model_dump(), "id": uuid4().hex, "createdAt": now_text()}
        store["contacts"].insert(0, contact)
        return {"id": contact["id"], "createdAt": contact["createdAt"]}


@app.post("/api/newsletter", status_code=201)
@limiter.limit("5/minute")
def subscribe_newsletter(request: Request, payload: NewsletterPayload):
    with store_transaction(write=True) as store:
        if not any(item["email"] == payload.email for item in store["newsletter"]):
            store["newsletter"].insert(0, {"email": payload.email, "createdAt": now_text()})
        return {"ok": True}


PUBLIC_FILES = {"index.html", "product.html", "search.html", "brand.html", "lookbook.html", "event.html", "mypage.html", "support.html",
                "style.css", "script.js", "pages.js", "store.js", "commerce.js", "catalog.json", "favicon.ico", "site.webmanifest", "browserconfig.xml"}


class PublicFiles(StaticFiles):
    async def get_response(self, path, scope):
        if path not in {"", ".", "/"} and path not in PUBLIC_FILES and not path.startswith("images/"):
            raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
        return await super().get_response(path, scope)


app.mount("/", PublicFiles(directory=ROOT_DIR, html=True), name="frontend")


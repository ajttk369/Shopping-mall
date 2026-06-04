from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = Path(__file__).resolve().parent / "data"
STORE_FILE = DATA_DIR / "store.json"
ADMIN_TOKEN = "blackfit-admin-demo-token"
ORDER_STATUSES = ["결제완료", "배송준비", "배송중", "배송완료"]


SEED_PRODUCTS: list[dict[str, Any]] = [
    {
        "id": 1,
        "name": "에센셜 와플 크롭 반팔티_5color",
        "brand": "BLACK FIT",
        "category": "TOP",
        "price": 39000,
        "discount": 12,
        "image": "images/products/essential-waffle-crop-tee-product.png",
        "hoverImage": "images/products/essential-waffle-crop-tee-model.png",
        "sizes": ["S", "M", "L", "XL"],
        "stock": {"S": 8, "M": 12, "L": 9, "XL": 4},
        "rating": 4.9,
        "isBest": True,
        "isNew": True,
    },
    {
        "id": 2,
        "name": "워셔블 데일리 반팔 니트_8color",
        "brand": "MONO LANE",
        "category": "TOP",
        "price": 49000,
        "discount": 15,
        "image": "images/products/워셔블 데일리 반팔 니트_8color.png",
        "hoverImage": "images/products/워셔블 데일리 반팔 니트_8color-model.png",
        "sizes": ["S", "M", "L"],
        "stock": {"S": 7, "M": 12, "L": 6},
        "rating": 4.6,
        "isBest": True,
        "isNew": False,
    },
    {
        "id": 3,
        "name": "트윌 재킷-네이비",
        "brand": "VOID ARCHIVE",
        "category": "OUTER",
        "price": 128000,
        "discount": 12,
        "image": "images/products/트윌 재킷-네이비.png",
        "hoverImage": "images/products/트윌 재킷-네이비-model.png",
        "sizes": ["M", "L", "XL"],
        "stock": {"M": 5, "L": 6, "XL": 2},
        "rating": 4.8,
        "isBest": True,
        "isNew": False,
    },
    {
        "id": 4,
        "name": "BDU 드로우스트링 릴렉스드 팬츠",
        "brand": "NEAT FIELD",
        "category": "PANTS",
        "price": 76000,
        "discount": 18,
        "image": "images/products/BDU 드로우스트링 릴렉스드 팬츠.png",
        "hoverImage": "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png",
        "sizes": ["28", "30", "32", "34"],
        "stock": {"28": 4, "30": 8, "32": 6, "34": 2},
        "rating": 4.8,
        "isBest": True,
        "isNew": True,
    },
    {
        "id": 5,
        "name": "뉴발란스 U740",
        "brand": "URBAN EDGE",
        "category": "SHOES",
        "price": 129000,
        "discount": 7,
        "image": "images/products/뉴발란스 U740.png",
        "hoverImage": "images/products/뉴발란스 U740-model.png",
        "sizes": ["240", "250", "260", "270", "280"],
        "stock": {"240": 3, "250": 6, "260": 7, "270": 4, "280": 2},
        "rating": 4.9,
        "isBest": True,
        "isNew": True,
    },
]


class LoginRequest(BaseModel):
    username: str
    password: str


class ProductPayload(BaseModel):
    name: str
    brand: str
    category: str
    price: int = Field(ge=0)
    discount: int = Field(ge=0, le=90)
    image: str
    hoverImage: str | None = None
    sizes: list[str] = Field(default_factory=list)
    stock: dict[str, int] = Field(default_factory=dict)
    rating: float = Field(default=4.7, ge=0, le=5)
    isBest: bool = False
    isNew: bool = True


class OrderItem(BaseModel):
    id: int
    name: str
    size: str
    quantity: int = Field(gt=0)
    price: int = Field(ge=0)
    image: str | None = None


class OrderPayload(BaseModel):
    customer: dict[str, str] = Field(default_factory=dict)
    items: list[OrderItem]
    subtotal: int = Field(ge=0)
    shipping: int = Field(default=3000, ge=0)
    discount: int = Field(default=0, ge=0)
    total: int = Field(ge=0)
    memo: str | None = None


class OrderStatusPayload(BaseModel):
    status: str


class ContactPayload(BaseModel):
    name: str
    email: str
    message: str


class NewsletterPayload(BaseModel):
    email: str


def now_text() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def default_store() -> dict[str, Any]:
    return {
        "products": deepcopy(SEED_PRODUCTS),
        "orders": [],
        "contacts": [],
        "newsletter": [],
    }


def read_store() -> dict[str, Any]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not STORE_FILE.exists():
        write_store(default_store())
    try:
        import json

        return json.loads(STORE_FILE.read_text(encoding="utf-8"))
    except Exception:
        return default_store()


def write_store(data: dict[str, Any]) -> None:
    import json

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    STORE_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def require_admin(x_admin_token: str | None) -> None:
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="관리자 권한이 필요합니다.")


app = FastAPI(
    title="BLACK FIT API",
    description="BLACK FIT 포트폴리오 쇼핑몰용 Python FastAPI 백엔드",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "BLACK FIT API"}


@app.post("/api/auth/login")
def login(payload: LoginRequest) -> dict[str, Any]:
    is_admin = payload.username == "admin" and payload.password == "admin"
    if not payload.username or not payload.password:
        raise HTTPException(status_code=400, detail="아이디와 비밀번호를 입력해주세요.")
    return {
        "id": payload.username,
        "role": "admin" if is_admin else "member",
        "token": ADMIN_TOKEN if is_admin else f"member-{uuid4().hex}",
    }


@app.get("/api/products")
def list_products(
    category: str | None = None,
    keyword: str | None = None,
    best: bool | None = None,
    new: bool | None = Query(default=None, alias="is_new"),
) -> dict[str, Any]:
    products = read_store()["products"]
    if category and category.upper() != "ALL":
        products = [item for item in products if item.get("category") == category.upper()]
    if best is not None:
        products = [item for item in products if bool(item.get("isBest")) is best]
    if new is not None:
        products = [item for item in products if bool(item.get("isNew")) is new]
    if keyword:
        value = keyword.lower()
        products = [
            item
            for item in products
            if value in item.get("name", "").lower()
            or value in item.get("brand", "").lower()
            or value in item.get("category", "").lower()
        ]
    return {"items": products, "count": len(products)}


@app.post("/api/products", status_code=201)
def create_product(payload: ProductPayload, x_admin_token: str | None = Header(default=None)) -> dict[str, Any]:
    require_admin(x_admin_token)
    store = read_store()
    next_id = max([item.get("id", 0) for item in store["products"]] or [0]) + 1
    product = payload.model_dump()
    product["id"] = next_id
    product["createdAt"] = int(datetime.now().strftime("%Y%m%d"))
    store["products"].insert(0, product)
    write_store(store)
    return product


@app.put("/api/products/{product_id}")
def update_product(product_id: int, payload: ProductPayload, x_admin_token: str | None = Header(default=None)) -> dict[str, Any]:
    require_admin(x_admin_token)
    store = read_store()
    for index, product in enumerate(store["products"]):
        if product.get("id") == product_id:
            updated = payload.model_dump()
            updated["id"] = product_id
            updated["createdAt"] = product.get("createdAt", int(datetime.now().strftime("%Y%m%d")))
            store["products"][index] = updated
            write_store(store)
            return updated
    raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")


@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, x_admin_token: str | None = Header(default=None)) -> dict[str, bool]:
    require_admin(x_admin_token)
    store = read_store()
    store["products"] = [item for item in store["products"] if item.get("id") != product_id]
    write_store(store)
    return {"ok": True}


@app.get("/api/orders")
def list_orders(x_admin_token: str | None = Header(default=None)) -> dict[str, Any]:
    require_admin(x_admin_token)
    orders = read_store()["orders"]
    return {"items": orders, "count": len(orders)}


@app.post("/api/orders", status_code=201)
def create_order(payload: OrderPayload) -> dict[str, Any]:
    if not payload.items:
        raise HTTPException(status_code=400, detail="주문 상품이 없습니다.")
    store = read_store()
    order = payload.model_dump()
    order["orderNumber"] = f"BF-{datetime.now().strftime('%H%M%S')}-{uuid4().hex[:4].upper()}"
    order["status"] = "결제완료"
    order["createdAt"] = now_text()
    store["orders"].insert(0, order)
    write_store(store)
    return order


@app.patch("/api/orders/{order_number}")
def update_order_status(order_number: str, payload: OrderStatusPayload, x_admin_token: str | None = Header(default=None)) -> dict[str, Any]:
    require_admin(x_admin_token)
    if payload.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="지원하지 않는 주문 상태입니다.")
    store = read_store()
    for order in store["orders"]:
        if order.get("orderNumber") == order_number:
            order["status"] = payload.status
            write_store(store)
            return order
    raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")


@app.delete("/api/orders/{order_number}")
def delete_order(order_number: str, x_admin_token: str | None = Header(default=None)) -> dict[str, bool]:
    require_admin(x_admin_token)
    store = read_store()
    store["orders"] = [item for item in store["orders"] if item.get("orderNumber") != order_number]
    write_store(store)
    return {"ok": True}


@app.post("/api/contact", status_code=201)
def create_contact(payload: ContactPayload) -> dict[str, Any]:
    store = read_store()
    contact = payload.model_dump()
    contact["id"] = uuid4().hex
    contact["createdAt"] = now_text()
    store["contacts"].insert(0, contact)
    write_store(store)
    return contact


@app.post("/api/newsletter", status_code=201)
def subscribe_newsletter(payload: NewsletterPayload) -> dict[str, Any]:
    store = read_store()
    item = {"email": payload.email, "createdAt": now_text()}
    store["newsletter"].insert(0, item)
    write_store(store)
    return item


app.mount("/", StaticFiles(directory=ROOT_DIR, html=True), name="frontend")

Shop.ready.then(() => {
"use strict";
const e = Shop.escape;
const pageProducts = Shop.products();
const pageBrands = [
  { name: "MONO LANE", copy: "기본에 집중한 미니멀 데일리웨어를 제안합니다.", image: "images/products/워셔블 데일리 반팔 니트_8color-model.png" },
  { name: "STUDIO LOW", copy: "편안한 소재와 실용적인 실루엣을 중심으로 전개합니다.", image: "images/products/와플 클래식 트랙탑 - 원더화이트-model.png" },
  { name: "VOID ARCHIVE", copy: "도시적인 아우터와 테크 무드를 큐레이션합니다.", image: "images/products/트윌 재킷-네이비-model.png" },
  { name: "NEAT FIELD", copy: "팬츠와 셋업 중심의 단정한 캐주얼을 보여줍니다.", image: "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png" }
];


const pageFormatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
function pageCard(product) {
  return `<article class="sub-product-card"><a href="product.html?id=${product.id}">
    <img src="${e(product.image)}" alt="${e(product.name)}" loading="lazy">
    <span>${e(product.category)}</span><strong>${e(product.brand)}</strong>
    <h3>${e(product.name)}</h3><p><b>${product.discount}%</b> ${pageFormatPrice(Shop.salePrice(product))}</p>
  </a></article>`;
}
function renderBrandPage() {
  const list = document.querySelector("#brandPageGrid");
  if (!list) return;
  list.innerHTML = pageBrands.map((brand) => `<article class="sub-brand-tile">
    <img src="${e(brand.image)}" alt="${e(brand.name)}" loading="lazy"><div>
    <span>${pageProducts.filter((product) => product.brand === brand.name).length} items</span>
    <h3>${e(brand.name)}</h3><p>${e(brand.copy)}</p>
    <a href="search.html?q=${encodeURIComponent(brand.name)}">상품 보기</a></div></article>`).join("");
}
function renderProductPage() {
  const wrap = document.querySelector("#productPageDetail");
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = params.has("id") ? Number(params.get("id")) : pageProducts[0]?.id;
  const product = pageProducts.find((item) => item.id === id);
  if (!product) {
    wrap.innerHTML = '<div class="empty-state"><h1>상품을 찾을 수 없습니다.</h1><a class="primary-btn" href="index.html#products">상품 목록으로</a></div>';
    return;
  }
  document.title = `${product.name} | BLACK FIT`;
  const recent = [id, ...Shop.ids("blackFitRecent").filter((item) => item !== id)].slice(0, 8);
  Shop.save("blackFitRecent", recent);
  const images = [...new Set([product.image, product.hoverImage].filter(Boolean))];
  const unavailable = !Object.values(product.stock).some((stock) => stock > 0);
  wrap.innerHTML = `<div class="product-page-gallery"><img id="detailMainImage" src="${e(images[0])}" alt="${e(product.name)}">
    <div class="modal-thumbs">${images.map((image, index) => `<button type="button" data-image="${e(image)}" class="${index === 0 ? "active" : ""}" aria-label="${index + 1}번 상품 사진"><img src="${e(image)}" alt=""></button>`).join("")}</div></div>
    <div class="product-page-info"><p class="eyebrow">${e(product.brand)}</p><h1>${e(product.name)}</h1>
    <div class="rating">${product.rating ? `★ ${product.rating.toFixed(1)} · ` : ""}${e(product.category)}</div>
    <div class="modal-price"><span class="discount">${product.discount}%</span> <strong>${pageFormatPrice(Shop.salePrice(product))}</strong></div>
    <form class="purchase-box static" id="detailPurchase">
      <fieldset class="option-fieldset"><legend>사이즈</legend><div class="size-options">${product.sizes.map((size) => `<label class="size-choice"><input type="radio" name="size" value="${e(size)}" required ${product.stock[size] <= 0 ? "disabled" : ""}><span>${e(size)}<small>${product.stock[size] ? `${product.stock[size]}개` : "품절"}</small></span></label>`).join("")}</div></fieldset>
      <label class="detail-quantity">수량<input id="detailQty" type="number" min="1" max="100000" step="1" value="1" required></label>
      <p class="notice-text" id="detailNotice" role="status"></p>
      <div class="modal-actions"><button class="ghost-btn full" type="submit" value="cart" ${unavailable ? "disabled" : ""}>장바구니 담기</button><button class="primary-btn full" type="submit" value="buy" ${unavailable ? "disabled" : ""}>${unavailable ? "품절" : "바로 구매"}</button></div>
      <a class="text-link" href="index.html?cart=1">장바구니 보기</a>
    </form>
    <div class="sub-detail-copy"><h2>배송 / 교환</h2><p>상품 금액 5만원 이상 무료배송, 미만은 3,000원입니다. 수령 후 7일 이내 교환·반품 신청이 가능합니다.</p><p class="guide">모의 주문입니다. 실제 결제 및 배송은 진행되지 않습니다.</p></div></div>`;
  wrap.querySelectorAll("[data-image]").forEach((button) => button.addEventListener("click", () => {
    document.querySelector("#detailMainImage").src = button.dataset.image;
    wrap.querySelectorAll("[data-image]").forEach((item) => item.classList.toggle("active", item === button));
  }));
  const form = document.querySelector("#detailPurchase");
  const quantity = document.querySelector("#detailQty");
  form.addEventListener("change", () => {
    const size = new FormData(form).get("size");
    if (size) { quantity.max = product.stock[size]; quantity.value = Math.min(Number(quantity.value) || 1, product.stock[size]); }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.pending) return;
    const size = new FormData(form).get("size");
    const error = Shop.add(product.id, size, Number(quantity.value));
    document.querySelector("#detailNotice").textContent = error || "장바구니에 상품을 담았습니다.";
    if (error) return;
    updateCartLink();
    if (event.submitter?.value === "buy") { form.dataset.pending = "true"; location.href = "index.html?checkout=1"; }
  });
}
function renderSearchPage() {
  const input = document.querySelector("#searchPageInput");
  const grid = document.querySelector("#searchPageGrid");
  if (!input || !grid) return;
  const category = document.querySelector("#searchPageCategory");
  const sort = document.querySelector("#searchPageSort");
  const query = new URLSearchParams(location.search);
  input.value = query.get("q") || "";
  if ([...category.options].some((item) => item.value === query.get("category"))) category.value = query.get("category");
  if ([...sort.options].some((item) => item.value === query.get("sort"))) sort.value = query.get("sort");
  const draw = () => {
    const keyword = input.value.trim().toLowerCase();
    const result = pageProducts.filter((product) => (category.value === "ALL" || product.category === category.value) && (!keyword || [product.name, product.brand, product.category].some((value) => value.toLowerCase().includes(keyword))));
    if (sort.value === "low") result.sort((a, b) => Shop.salePrice(a) - Shop.salePrice(b));
    if (sort.value === "high") result.sort((a, b) => Shop.salePrice(b) - Shop.salePrice(a));
    if (sort.value === "new") result.sort((a, b) => b.createdAt - a.createdAt);
    grid.innerHTML = result.length ? result.map(pageCard).join("") : '<div class="empty-state">검색 결과가 없습니다.</div>';
    document.querySelector("#searchPageCount").textContent = `${result.length}개 상품`;
    const params = new URLSearchParams();
    if (input.value.trim()) params.set("q", input.value.trim());
    if (category.value !== "ALL") params.set("category", category.value);
    if (sort.value !== "popular") params.set("sort", sort.value);
    history.replaceState(null, "", `search.html${params.size ? "?" + params : ""}`);
  };
  input.addEventListener("input", draw);
  category.addEventListener("change", draw);
  sort.addEventListener("change", draw);
  document.querySelector("#searchPageReset").addEventListener("click", () => { input.value = ""; category.value = "ALL"; sort.value = "popular"; draw(); input.focus(); });
  draw();
}
function renderMypagePage() {
  const wrap = document.querySelector("#mypageDashboard");
  if (!wrap) return;
  const orders = Shop.orders();
  const wishes = Shop.ids("blackFitWishes").map((id) => pageProducts.find((item) => item.id === id)).filter(Boolean);
  wrap.innerHTML = `<div class="member-metrics page-metrics"><div><strong>${orders.length}</strong><span>Orders</span></div><div><strong>${wishes.length}</strong><span>Wishlist</span></div><div><strong>3</strong><span>Coupons</span></div></div>
    <section class="sub-panel"><h2>주문 내역</h2><p class="guide">이 브라우저에 저장된 모의 주문입니다. 실제 결제 및 배송은 진행되지 않습니다.</p>
    ${orders.length ? orders.map((order) => `<article class="order-card"><div class="order-top"><strong>${e(order.orderNumber)}</strong><span>${e(order.status || "결제완료")}</span></div><p>${e(order.createdAt || "-")} · ${order.items.length}개 상품</p><b>${pageFormatPrice(order.total)}</b>
      <details class="order-info"><summary>주문 상세</summary><ul>${order.items.map((item) => `<li>${e(item.name)} / ${e(item.size)} / ${e(item.quantity)}개</li>`).join("")}</ul>
      ${order.customer ? `<p>${e(order.customer.name)} · ${e(order.customer.phone)}</p><p>${e(order.customer.address)}</p><p>${e(order.memo || "")}</p>` : ""}</details></article>`).join("") : '<p class="guide">아직 주문 내역이 없습니다.</p>'}</section>
    ${wishes.length ? `<section class="sub-section saved-products"><h2>찜한 상품</h2><div class="sub-product-grid">${wishes.map(pageCard).join("")}</div></section>` : ""}`;
}
function updateCartLink() {
  const link = document.querySelector("#pageCartLink");
  if (link) link.textContent = `장바구니 (${Shop.cart().reduce((sum, item) => sum + item.quantity, 0)})`;
}
renderBrandPage();
renderProductPage();
renderSearchPage();
renderMypagePage();
updateCartLink();
Shop.icons();
}).catch(() => Shop.notify("화면을 준비하지 못했습니다. 서버 연결과 저장 공간을 확인해주세요."));


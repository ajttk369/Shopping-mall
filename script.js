Shop.ready.then(() => {
"use strict";
const baseProducts = Shop.clone(Shop.seed);
const e = Shop.escape;
const brandStories = [
  { name: "MONO LANE", title: "Quiet Essential", image: "images/products/워셔블 데일리 반팔 니트_8color-model.png", copy: "일상에서 가장 자주 입는 기본 아이템을 간결한 실루엣으로 제안합니다." },
  { name: "STUDIO LOW", title: "Soft Utility", image: "images/products/와플 클래식 트랙탑 - 원더화이트-model.png", copy: "편안한 소재와 낮은 채도의 컬러로 오래 입는 데일리웨어를 만듭니다." },
  { name: "VOID ARCHIVE", title: "Urban Outerwear", image: "images/products/트윌 재킷-네이비-model.png", copy: "도시적인 레이어링에 어울리는 아우터와 테크 소재를 중심으로 전개합니다." },
  { name: "NEAT FIELD", title: "Tailored Casual", image: "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png", copy: "팬츠와 셋업 중심의 단정한 캐주얼을 큐레이션합니다." }
];

const defaultReviews = {};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const deliveryFee = 3000;
const orderStatuses = ["결제완료", "배송준비", "배송중", "배송완료"];
const categories = ["ALL", "OUTER", "TOP", "PANTS", "SHOES", "BAG", "ACC"];
let toastTimer;

const readStorage = Shop.read;
function save(key, value) {
  if (!Shop.save(key, value)) throw new Error("Storage unavailable");
}

const withStock = Shop.normalizeProduct;
let products = Shop.products();

const state = {
  category: "ALL",
  bestOnly: false,
  newOnly: false,
  search: "",
  sort: "popular",
  price: "all",
  brand: "",
  collection: "",
  coupon: readStorage("blackFitCoupon", null),
  recentSearches: (() => { const items = readStorage("blackFitRecentSearches", []); return Array.isArray(items) ? items.filter((item) => typeof item === "string").slice(0, 8) : []; })(),
  wishes: new Set(Shop.ids("blackFitWishes")),
  cart: Shop.cart(products),
  recent: Shop.ids("blackFitRecent"),
  orders: Shop.orders(),
  reviews: (() => { const reviews = readStorage("blackFitReviews", defaultReviews); return reviews && typeof reviews === "object" && !Array.isArray(reviews) ? reviews : {}; })(),
  user: (() => { const user = readStorage("blackFitUser", null); return user && typeof user.id === "string" ? { id: user.id.slice(0, 80), role: user.role === "admin" ? "admin" : "member" } : null; })(),
  activeProduct: null,
  selectedSize: "",
  selectedQty: 1
};
state.orders = state.orders.map((order) => ({ ...order, status: orderStatuses.includes(order.status) ? order.status : "결제완료" }));

const els = {
  siteHeader: $("#siteHeader"),
  nav: $("#mainNav"),
  menuToggle: $("#menuToggle"),
  moreToggle: $("#moreToggle"),
  moreDropdown: $("#moreDropdown"),
  rankingGrid: $("#rankingGrid"),
  newProducts: $("#newProducts"),
  productGrid: $("#productGrid"),
  brandCards: $("#brandCards"),
  categoryFilters: $("#categoryFilters"),
  bestFilter: $("#bestFilter"),
  newFilter: $("#newFilter"),
  sortSelect: $("#sortSelect"),
  priceSelect: $("#priceSelect"),
  searchInput: $("#searchInput"),
  searchAssist: $("#searchAssist"),
  searchFocus: $("#searchFocus"),
  emptyState: $("#emptyState"),
  recentSection: $("#recentSection"),
  recentProducts: $("#recentProducts"),
  recentClear: $("#recentClear"),
  modal: $("#productModal"),
  modalBody: $("#modalBody"),
  modalClose: $("#modalClose"),
  cartPanel: $("#cartPanel"),
  cartOpen: $("#cartOpen"),
  cartClose: $("#cartClose"),
  cartList: $("#cartList"),
  cartRecommend: $("#cartRecommend"),
  cartCount: $("#cartCount"),
  wishlistPanel: $("#wishlistPanel"),
  wishlistOpen: $("#wishlistOpen"),
  wishlistClose: $("#wishlistClose"),
  wishlistList: $("#wishlistList"),
  wishCount: $("#wishCount"),
  mypagePanel: $("#mypagePanel"),
  mypageOpen: $("#mypageOpen"),
  mypageClose: $("#mypageClose"),
  mypageList: $("#mypageList"),
  orderPanel: $("#orderPanel"),
  orderClose: $("#orderClose"),
  orderDetail: $("#orderDetail"),
  subtotalPrice: $("#subtotalPrice"),
  discountPrice: $("#discountPrice"),
  shippingPrice: $("#shippingPrice"),
  totalPrice: $("#totalPrice"),
  couponInput: $("#couponInput"),
  couponApply: $("#couponApply"),
  couponMessage: $("#couponMessage"),
  checkoutOpen: $("#checkoutOpen"),
  checkoutModal: $("#checkoutModal"),
  checkoutClose: $("#checkoutClose"),
  checkoutForm: $("#checkoutForm"),
  checkoutTotal: $("#checkoutTotal"),
  orderComplete: $("#orderComplete"),
  orderNumberText: $("#orderNumberText"),
  orderDone: $("#orderDone"),
  authModal: $("#authModal"),
  authClose: $("#authClose"),
  loginOpen: $("#loginOpen"),
  loginForm: $("#loginForm"),
  loginEmail: $("#loginEmail"),
  loginPassword: $("#loginPassword"),
  adminOpen: $("#adminOpen"),
  adminPanel: $("#adminPanel"),
  adminClose: $("#adminClose"),
  adminForm: $("#adminForm"),
  adminList: $("#adminList"),
  adminOrderList: $("#adminOrderList"),
  adminCount: $("#adminCount"),
  adminResetForm: $("#adminResetForm"),
  adminResetProducts: $("#adminResetProducts"),
  bottomNav: $(".mobile-bottom-nav"),
  overlay: $("#overlay"),
  backTop: $("#backTop"),
  toast: $("#toast")
};

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const getSalePrice = (product) => Math.round(product.price * (100 - product.discount) / 100);
const totalStock = (product) => Object.values(product.stock || {}).reduce((sum, value) => sum + Number(value || 0), 0);
const stockText = (product) => totalStock(product) <= 3 ? "Low Stock" : `${totalStock(product)} in stock`;

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function productReviews(productId) {
  const reviews = state.reviews[productId];
  return Array.isArray(reviews) ? reviews.filter((review) => review && typeof review.text === "string" && typeof review.user === "string" && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5).slice(0, 100) : [];
}

function averageRating(product) {
  const reviews = productReviews(product.id);
  if (!reviews.length) return product.rating;
  const sum = reviews.reduce((total, review) => total + Number(review.rating || 0), product.rating);
  return sum / (reviews.length + 1);
}

function productColors(product) {
  return product.colors || [];
}

function productCardOptions(product) {
  const colors = productColors(product).map((color) => `<i style="--swatch:${color}" aria-hidden="true"></i>`).join("");
  const sizes = product.sizes.slice(0, 4).map((size) => `<span>${e(size)}</span>`).join("");
  return `<div class="card-options"><div class="color-swatches">${colors}</div><div class="size-preview">${sizes}</div></div>`;
}

function productSpecGrid(product) {
  return '<div class="spec-grid"><div><span>OPTIONS</span><strong>' + e(product.sizes.join(" / ")) + '</strong></div><div><span>DELIVERY</span><strong>5만원 이상 무료배송</strong></div></div>';
}

function productCard(product, rank = "") {
  const wished = state.wishes.has(product.id);
  return `
    <article class="product-card ${product.hoverImage ? "has-hover" : ""}" data-id="${product.id}">
      <button class="product-image" type="button" data-open-product="${product.id}">
        ${rank ? `<span class="rank-badge">${rank}</span>` : ""}
        ${product.isNew ? `<span class="label-badge">NEW</span>` : ""}
        <img class="product-main-img" src="${e(Shop.imageUrl(product.image))}" alt="${e(product.brand)} ${e(product.name)}" loading="lazy">
        ${product.hoverImage ? `<img class="product-hover-img" src="${e(Shop.imageUrl(product.hoverImage))}" alt="${e(product.name)} 모델 착용 이미지" loading="lazy">` : ""}
        <span class="quick-view">Quick View</span>
      </button>
      <button class="wish-button ${wished ? "active" : ""}" type="button" data-wish="${product.id}" aria-label="${wished ? "찜 해제" : "찜하기"}" title="${wished ? "찜 해제" : "찜하기"}" aria-pressed="${wished}"><i data-lucide="heart" aria-hidden="true">${wished ? "♥" : "♡"}</i></button>
      <button class="product-info" type="button" data-open-product="${product.id}">
        <span class="category-name">${e(product.category)}</span>
        <p class="brand-name">${e(product.brand)}</p>
        <h3 class="product-name">${e(product.name)}</h3>
        <div class="price-row"><span class="discount">${product.discount}%</span><span>${formatPrice(getSalePrice(product))}</span></div>
        <div class="card-meta"><span>★ ${averageRating(product).toFixed(1)}</span><span>${stockText(product)}</span></div>
        ${productCardOptions(product)}
      </button>
    </article>
  `;
}

function renderHome() {
  els.rankingGrid.innerHTML = [...products].sort((a, b) => averageRating(b) - averageRating(a)).slice(0, 8).map((p, i) => productCard(p, String(i + 1).padStart(2, "0"))).join("");
  els.newProducts.innerHTML = products.filter((p) => p.isNew).sort((a, b) => b.createdAt - a.createdAt).slice(0, 4).map((p) => productCard(p)).join("");
  renderBrands();
  $("#heroItemCount").textContent = products.length;
  $("#heroNewCount").textContent = products.filter((item) => item.isNew).length;
}

function renderBrands() {
  els.brandCards.innerHTML = brandStories.map((brand) => {
    const count = products.filter((product) => product.brand === brand.name).length;
    return `
      <article class="brand-card" data-brand-filter="${e(brand.name)}">
        <img src="${e(Shop.imageUrl(brand.image))}" alt="${e(brand.name)}">
        <div><span>${count} items</span><h3>${e(brand.name)}</h3><strong>${e(brand.title)}</strong><p>${e(brand.copy)}</p></div>
      </article>
    `;
  }).join("");
}

function renderFilters() {
  els.categoryFilters.innerHTML = categories.map((category) => `<button class="chip" type="button" data-shop-category="${category}" data-active="${state.category === category}">${category}</button>`).join("");
}

function resetCollectionFilters() {
  state.brand = "";
  state.collection = "";
}

function passesPrice(product) {
  const price = getSalePrice(product);
  if (state.price === "under50000") return price <= 50000;
  if (state.price === "50000-100000") return price > 50000 && price <= 100000;
  if (state.price === "over100000") return price > 100000;
  return true;
}

function filteredProducts() {
  const keyword = state.search.trim().toLowerCase();
  const list = products.filter((product) => {
    return (state.category === "ALL" || product.category === state.category)
      && (!state.bestOnly || product.isBest)
      && (!state.newOnly || product.isNew)
      && (!state.brand || product.brand === state.brand)
      && (!state.collection || product.collections?.includes(state.collection))
      && passesPrice(product)
      && (!keyword || product.name.toLowerCase().includes(keyword) || product.brand.toLowerCase().includes(keyword));
  });
  const sorters = {
    popular: (a, b) => averageRating(b) - averageRating(a),
    low: (a, b) => getSalePrice(a) - getSalePrice(b),
    high: (a, b) => getSalePrice(b) - getSalePrice(a),
    new: (a, b) => b.createdAt - a.createdAt
  };
  return list.sort(sorters[state.sort]);
}

function renderProducts() {
  const list = filteredProducts();
  els.productGrid.innerHTML = list.map((p) => productCard(p)).join("");
  els.emptyState.hidden = list.length > 0;
  renderFilters();
  els.bestFilter.dataset.active = String(state.bestOnly);
  els.newFilter.dataset.active = String(state.newOnly);
  const active = [state.category !== "ALL" ? state.category : "", state.brand, state.collection,
    state.bestOnly ? "BEST" : "", state.newOnly ? "NEW" : "", state.price !== "all" ? els.priceSelect.selectedOptions[0].textContent : "",
    state.search ? `검색: ${state.search}` : ""].filter(Boolean);
  $("#resultCount").textContent = `${list.length}개 상품`;
  $("#activeFilters").textContent = active.join(" · ");
  $("#filterReset").hidden = !active.length;
  Shop.icons();

}

function renderSearchAssist() {
  const keyword = state.search.trim().toLowerCase();
  const productMatches = products
    .filter((product) => keyword && (product.name.toLowerCase().includes(keyword) || product.brand.toLowerCase().includes(keyword)))
    .slice(0, 5);
  const recent = state.recentSearches.filter((item) => !keyword || item.toLowerCase().includes(keyword)).slice(0, 5);
  const brands = [...new Set(products.map((product) => product.brand))]
    .filter((brand) => keyword && brand.toLowerCase().includes(keyword))
    .slice(0, 4);

  if (!keyword && !recent.length) {
    els.searchAssist.hidden = true;
    els.searchAssist.innerHTML = "";
    return;
  }

  els.searchAssist.hidden = false;
  els.searchAssist.innerHTML = `
    ${recent.length ? `<div class="assist-block"><div class="assist-title"><span>최근 검색어</span><button type="button" data-search-clear>전체 삭제</button></div>${recent.map((item) => `<div class="assist-row"><button type="button" data-search-pick="${e(item)}">${e(item)}</button><button class="assist-remove" type="button" data-search-remove="${e(item)}" aria-label="${e(item)} 삭제">×</button></div>`).join("")}</div>` : ""}
    ${brands.length ? `<div class="assist-block"><span>브랜드 추천</span>${brands.map((brand) => `<button type="button" data-search-pick="${e(brand)}">${e(brand)}</button>`).join("")}</div>` : ""}
    ${productMatches.length ? `<div class="assist-block"><span>상품 추천</span>${productMatches.map((product) => `<button type="button" data-search-pick="${e(product.name)}"><strong>${e(product.brand)}</strong>${e(product.name)}</button>`).join("")}</div>` : ""}
  `;
}

function commitSearch(value = state.search) {
  const keyword = value.trim();
  state.search = keyword;
  els.searchInput.value = keyword;
  if (keyword) {
    state.recentSearches = [keyword, ...state.recentSearches.filter((item) => item !== keyword)].slice(0, 8);
    save("blackFitRecentSearches", state.recentSearches);
  }
  renderProducts();
  renderSearchAssist();
}

function renderRecent() {
  const list = state.recent.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  els.recentSection.hidden = list.length === 0;
  els.recentProducts.innerHTML = list.map((p) => productCard(p)).join("");
}

function renderWishlist() {
  const list = [...state.wishes].map((id) => products.find((p) => p.id === id)).filter(Boolean);
  els.wishCount.textContent = list.length;
  if (!list.length) {
    els.wishlistList.innerHTML = `<div class="cart-empty"><div><strong>찜한 상품이 없습니다.</strong><p>상품 카드의 하트를 눌러 관심 상품을 저장하세요.</p></div></div>`;
    return;
  }
  els.wishlistList.innerHTML = list.map((p) => `
    <article class="wishlist-item">
      <img src="${e(Shop.imageUrl(p.image))}" alt="${e(p.name)}">
      <div><strong>${e(p.name)}</strong><p>${e(p.brand)} · ${formatPrice(getSalePrice(p))}</p><button data-open-product="${p.id}" type="button">보기</button></div>
      <button data-remove-wish="${p.id}" type="button">삭제</button>
    </article>
  `).join("");
}

function couponDiscount(subtotal) {
  if (!state.coupon || !subtotal) return { discount: 0, shippingFree: false, label: "" };
  if (state.coupon === "BLACK10") return { discount: Math.round(subtotal * 0.1), shippingFree: false, label: "BLACK10 10% 할인" };
  if (state.coupon === "WELCOME15") return { discount: Math.min(Math.round(subtotal * 0.15), 20000), shippingFree: false, label: "WELCOME15 최대 2만원 할인" };
  if (state.coupon === "FREESHIP") return { discount: 0, shippingFree: true, label: "FREESHIP 무료배송" };
  return { discount: 0, shippingFree: false, label: "" };
}

function cartTotal() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = couponDiscount(subtotal);
  const shipping = subtotal && subtotal < 50000 && !coupon.shippingFree ? deliveryFee : 0;
  return { subtotal, discount: coupon.discount, shipping, total: Math.max(0, subtotal - coupon.discount + shipping), coupon };
}

function getCartStock(item) {
  const product = products.find((p) => p.id === item.id);
  return product?.stock?.[item.size] ?? 0;
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const { subtotal, discount, shipping, total, coupon } = cartTotal();
  els.cartCount.textContent = count;
  els.checkoutOpen.disabled = !state.cart.length;
  $("#shippingHint").textContent = !subtotal ? "" : shipping ? `${formatPrice(50000 - subtotal)} 더 담으면 무료배송` : "무료배송이 적용되었습니다.";
  els.subtotalPrice.textContent = formatPrice(subtotal);
  els.discountPrice.textContent = discount ? `-${formatPrice(discount)}` : "0원";
  els.shippingPrice.textContent = formatPrice(shipping);
  els.totalPrice.textContent = formatPrice(total);
  els.couponInput.value = state.coupon || "";
  els.couponMessage.textContent = coupon.label || "사용 가능 쿠폰: BLACK10, WELCOME15, FREESHIP";
  if (!state.cart.length) {
    els.cartList.innerHTML = `<div class="cart-empty"><div><strong>장바구니가 비어 있습니다.</strong><p>마음에 드는 상품을 담아보세요.</p></div></div>`;
    renderCartRecommendations();
    return;
  }
  els.cartList.innerHTML = state.cart.map((item) => `
    <article class="cart-item">
      <img src="${e(Shop.imageUrl(item.image))}" alt="${e(item.name)}">
      <div><strong>${e(item.name)}</strong><label class="cart-option">옵션<select data-cart-size="${e(item.key)}" aria-label="${e(item.name)} 옵션">${(products.find((product) => product.id === item.id)?.sizes || []).map((size) => `<option value="${e(size)}" ${size === item.size ? "selected" : ""} ${(products.find((product) => product.id === item.id)?.stock[size] || 0) < item.quantity && size !== item.size ? "disabled" : ""}>${e(size)}</option>`).join("")}</select></label><p>재고 ${getCartStock(item)}개</p><b>${formatPrice(item.price * item.quantity)}</b>
        <div class="cart-controls"><button class="qty-button" data-cart-qty="minus" data-key="${e(item.key)}">-</button><span>${item.quantity}</span><button class="qty-button" data-cart-qty="plus" data-key="${e(item.key)}">+</button></div>
      </div>
      <button class="remove-button" data-remove="${e(item.key)}">삭제</button>
    </article>
  `).join("");
  renderCartRecommendations();
}

function renderCartRecommendations() {
  const cartIds = new Set(state.cart.map((item) => item.id));
  const cartCategories = new Set(state.cart.map((item) => products.find((product) => product.id === item.id)?.category).filter(Boolean));
  const list = products
    .filter((product) => !cartIds.has(product.id))
    .filter((product) => !cartCategories.size || cartCategories.has(product.category) || product.isBest)
    .sort((a, b) => averageRating(b) - averageRating(a))
    .slice(0, state.cart.length ? 2 : 3);
  if (!list.length) {
    els.cartRecommend.innerHTML = "";
    return;
  }
  els.cartRecommend.innerHTML = `
    <div class="panel-subtitle">Recommended</div>
    <div class="recommend-list">
      ${list.map((product) => `
        <button class="recommend-item" type="button" data-open-product="${product.id}">
          <img src="${e(Shop.imageUrl(product.image))}" alt="${e(product.name)}">
          <span><strong>${e(product.name)}</strong><em>${e(product.brand)} · ${formatPrice(getSalePrice(product))}</em></span>
        </button>
      `).join("")}
    </div>
  `;
}

function timelineMarkup(status) {
  const activeIndex = orderStatuses.indexOf(status || "결제완료");
  return `<div class="order-timeline">${orderStatuses.map((item, index) => `<span class="${index <= activeIndex ? "active" : ""}">${item}</span>`).join("")}</div>`;
}

function renderMyPage() {
  if (!state.user) {
    els.mypageList.innerHTML = `<div class="cart-empty"><div><strong>로그인이 필요합니다.</strong><p>주문 내역과 회원 정보를 확인하려면 로그인해주세요.</p><button class="primary-btn" data-open-auth type="button">Login</button></div></div>`;
    return;
  }
  const wishCount = state.wishes.size;
  const recentCount = state.recent.length;
  const orderMarkup = state.orders.length ? state.orders.map((order) => `
    <article class="order-card">
      <div class="order-top"><strong>${e(order.orderNumber)}</strong><span>${e(order.status || "결제완료")}</span></div>
      ${timelineMarkup(order.status)}
      <p>${e(order.createdAt || "-")} · ${order.items.length}개 상품</p>
      <ul>${order.items.slice(0, 3).map((item) => `<li>${e(item.name)} / ${e(item.size)} / ${e(item.quantity)}개</li>`).join("")}</ul>
      <b>${formatPrice(order.total)}</b>
      <button class="ghost-btn full" type="button" data-order-detail="${e(order.orderNumber)}">주문 상세 보기</button>
    </article>
  `).join("") : `<div class="cart-empty"><div><strong>아직 주문 내역이 없습니다.</strong><p>체크아웃을 완료하면 이곳에 주문이 쌓입니다.</p></div></div>`;

  els.mypageList.innerHTML = `
    <section class="member-card">
      <span>Signed in as</span>
      <strong>${e(state.user.id)}</strong>
      <p>${state.user.role === "admin" ? "관리자 계정" : "일반 회원"} · 누적 주문 ${state.orders.length}건</p>
      <div class="member-actions"><button class="ghost-btn" type="button" data-member-logout>로그아웃</button>${state.user.role === "admin" ? '<button class="primary-btn" type="button" data-member-admin>상품 관리</button>' : ""}</div>
    </section>
    <div class="member-metrics"><div><strong>${wishCount}</strong><span>Wishlist</span></div><div><strong>${recentCount}</strong><span>Viewed</span></div><div><strong>3</strong><span>Coupons</span></div></div>
    <p class="guide">이 브라우저에 저장된 모의 주문입니다. 실제 결제·배송은 진행되지 않습니다.</p>
    <div class="panel-subtitle">Order History</div>
    ${orderMarkup}
  `;
}

function renderOrderDetail(orderNumber) {
  const order = state.orders.find((item) => item.orderNumber === orderNumber);
  if (!order) return;
  els.orderDetail.innerHTML = `
    <article class="order-detail-card">
      <span>${e(order.createdAt || "-")}</span>
      <h3>${e(order.orderNumber)}</h3>
      ${timelineMarkup(order.status)}
      <div class="panel-subtitle">Items</div>
      ${order.items.map((item) => `<div class="order-line"><img src="${e(Shop.imageUrl(item.image))}" alt="${e(item.name)}"><div><strong>${e(item.name)}</strong><p>Size ${e(item.size)} · ${e(item.quantity)}개</p></div><b>${formatPrice(item.price * item.quantity)}</b></div>`).join("")}
      <div class="summary-lite"><span>결제 예정 금액</span><strong>${formatPrice(order.total)}</strong></div>
      ${order.customer ? `<div class="delivery-detail"><strong>배송 정보</strong><p>${e(order.customer.name)} · ${e(order.customer.phone)}</p><p>${e(order.customer.address)}</p><p>${e(order.memo || "")}</p></div>` : ""}
      <p class="guide">모의 주문입니다. 실제 결제 및 배송은 진행되지 않습니다.</p>
    </article>
  `;
  openLayer("order");
}

function renderAdminOrders() {
  if (!state.orders.length) {
    els.adminOrderList.innerHTML = `<div class="cart-empty compact"><div><strong>관리할 주문이 없습니다.</strong><p>주문 완료 후 상태를 변경할 수 있습니다.</p></div></div>`;
    return;
  }
  els.adminOrderList.innerHTML = state.orders.map((order) => `
    <article class="admin-order-item">
      <div>
        <strong>${e(order.orderNumber)}</strong>
        <p>${e(order.createdAt || "-")} · ${order.items.length}개 · ${formatPrice(order.total)}</p>
      </div>
      <select data-order-status="${e(order.orderNumber)}">
        ${orderStatuses.map((status) => `<option value="${status}" ${status === (order.status || "결제완료") ? "selected" : ""}>${status}</option>`).join("")}
      </select>
      <button class="order-delete-btn" type="button" data-order-delete="${e(order.orderNumber)}">삭제</button>
    </article>
  `).join("");
}

let activeLayer = null;
let layerTrigger = null;
function openLayer(type) {
  els.overlay.hidden = false;
  document.body.classList.add("lock");
  const previous = activeLayer;
  document.querySelectorAll(".dialog, .side-panel").forEach((layer) => { layer.classList.remove("open"); layer.inert = true; });
  if (!previous) layerTrigger = document.activeElement;
  if (type === "modal") els.modal.classList.add("open");
  if (type === "cart") els.cartPanel.classList.add("open");
  if (type === "wish") els.wishlistPanel.classList.add("open");
  if (type === "my") {
    renderMyPage();
    els.mypagePanel.classList.add("open");
  }
  if (type === "order") els.orderPanel.classList.add("open");
  if (type === "auth") els.authModal.classList.add("open");
  if (type === "admin") {
    renderAdmin();
    els.adminPanel.classList.add("open");
  }
  if (type === "checkout") els.checkoutModal.classList.add("open");
  activeLayer = document.querySelector(".dialog.open, .side-panel.open");
  activeLayer.inert = false;
  document.querySelector("main").inert = true;
  document.querySelector("header").inert = true;
  document.querySelector("footer").inert = true;
  els.backTop.inert = true;
  els.bottomNav.inert = true;
  requestAnimationFrame(() => activeLayer?.querySelector("button, input, select, a[href]")?.focus());
  Shop.icons();
}

function closeLayers() {
  [els.modal, els.cartPanel, els.wishlistPanel, els.mypagePanel, els.orderPanel, els.authModal, els.adminPanel, els.checkoutModal].forEach((el) => { el.classList.remove("open"); el.inert = true; });
  resetLoginForm();
  els.overlay.hidden = true;
  document.body.classList.remove("lock");
  document.querySelector("main").inert = false;
  document.querySelector("header").inert = false;
  document.querySelector("footer").inert = false;
  els.backTop.inert = false;
  els.bottomNav.inert = false;
  activeLayer = null;
  layerTrigger?.focus();
}

function gallery(product) {
  return [...new Set([product.image, product.hoverImage].filter(Boolean))];
}

function reviewListMarkup(product) {
  const reviews = productReviews(product.id);
  if (!reviews.length) return `<div class="empty-mini">아직 작성된 리뷰가 없습니다.</div>`;
  return reviews.map((review) => `
    <article class="review-item">
      <div><strong>${e(review.user)}</strong><span>${"★".repeat(Number(review.rating))}${"☆".repeat(5 - Number(review.rating))}</span></div>
      <p>${e(review.text)}</p>
    </article>
  `).join("");
}

function productTabMarkup(product, tab = "detail") {
  const contents = {
    detail: `<div class="tab-panel"><strong>상품 설명</strong><p>도시적인 무드에 맞춘 BLACK FIT 큐레이션 아이템입니다. 군더더기 없는 실루엣과 실용적인 소재로 데일리 스타일에 자연스럽게 어울립니다.</p></div>`,
    size: `<div class="tab-panel"><strong>사이즈 가이드</strong><p>선택 가능한 옵션입니다. 이 데모에는 상품별 실측 데이터가 등록되어 있지 않습니다.</p><div class="size-table">${product.sizes.map((size) => `<span>${e(size)}</span>`).join("")}</div></div>`,
    review: `<div class="tab-panel"><strong>리뷰 ${productReviews(product.id).length}개</strong>${reviewListMarkup(product)}<form class="review-form" data-review-form="${product.id}"><select name="rating"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option></select><input name="text" placeholder="리뷰를 입력하세요" maxlength="1000" required><button class="primary-btn" type="submit">작성</button></form></div>`,
    delivery: `<div class="tab-panel"><strong>배송/교환 안내</strong><p>기본 배송비는 3,000원이며 5만원 이상 무료 배송입니다. 수령 후 7일 이내 교환 및 반품 신청이 가능합니다.</p></div>`
  };
  return `
    <div class="detail-tabs">
      ${["detail", "size", "review", "delivery"].map((item) => `<button class="${tab === item ? "active" : ""}" type="button" data-tab="${item}">${({ detail: "상세정보", size: "사이즈", review: "리뷰", delivery: "배송/교환" })[item]}</button>`).join("")}
    </div>
    <div id="tabContent">${contents[tab]}</div>
  `;
}

function renderProductTabs(tab = "detail") {
  $("#productTabs").innerHTML = productTabMarkup(state.activeProduct, tab);
}

function openProduct(id) {
  const product = products.find((p) => p.id === Number(id));
  if (!product) return;
  state.activeProduct = product;
  state.selectedSize = "";
  state.selectedQty = 1;
  state.recent = [product.id, ...state.recent.filter((item) => item !== product.id)].slice(0, 8);
  save("blackFitRecent", state.recent);
  renderRecent();
  const images = gallery(product);
  els.modalBody.innerHTML = `
    <div>
      <div class="modal-image"><img id="modalMainImage" src="${e(Shop.imageUrl(images[0]))}" alt="${e(product.name)}"></div>
      <div class="modal-thumbs">${images.map((image, i) => `<button class="${i === 0 ? "active" : ""}" data-gallery-image="${e(Shop.imageUrl(image))}"><img src="${e(Shop.imageUrl(image))}" alt=""></button>`).join("")}</div>
    </div>
    <div class="modal-detail">
      <p class="brand-name">${e(product.brand)}</p>
      <h2>${e(product.name)}</h2>
      <div class="rating">★ ${averageRating(product).toFixed(1)} · 리뷰 ${productReviews(product.id).length}개 · ${stockText(product)}</div>
      <div class="modal-price"><span class="discount">${product.discount}%</span> <strong>${formatPrice(getSalePrice(product))}</strong></div>
      ${productSpecGrid(product)}
      <div class="purchase-box">
        <p><strong>Size</strong></p>
        <div class="size-options">
          ${product.sizes.map((size) => {
            const left = Number(product.stock?.[size] || 0);
            return `<button class="size-button" data-size="${e(size)}" data-left="${left}" ${left <= 0 ? "disabled" : ""}>${e(size)}<small>${left <= 0 ? "품절" : `${left}개`}</small></button>`;
          }).join("")}
        </div>
        <p><strong>Quantity</strong></p>
        <div class="quantity-control"><button data-modal-qty="minus">-</button><span id="modalQty">1</span><button data-modal-qty="plus">+</button></div>
        <p class="notice-text" id="modalNotice"></p>
        <div class="modal-actions"><button class="ghost-btn full" id="addCartButton">장바구니 담기</button><button class="primary-btn full" id="buyButton">바로 구매</button></div>
      </div>
      <div id="productTabs">${productTabMarkup(product)}</div>
    </div>
  `;
  openLayer("modal");
}

function addToCart(product, size, quantity) {
  const error = Shop.add(product.id, size, quantity);
  state.cart = Shop.cart();
  renderCart();
  showToast(error || "장바구니에 상품을 담았습니다.");
  return !error;
}

function renderLogin() {
  if (!state.user) {
    els.loginOpen.textContent = "Login";
    els.adminOpen.hidden = true;
  } else {
    els.loginOpen.textContent = state.user.role === "admin" ? "Admin Logout" : "Logout";
    els.adminOpen.hidden = state.user.role !== "admin";
  }
}

function renderAdmin() {
  els.adminCount.textContent = `${products.length}개 상품`;
  els.adminList.innerHTML = products.map((p) => `
    <article class="admin-item">
      <img src="${e(Shop.imageUrl(p.image))}" alt="${e(p.name)}">
      <div><strong>${e(p.name)}</strong><p>${e(p.brand)} · ${e(p.category)} · ${formatPrice(getSalePrice(p))} · 재고 ${totalStock(p)}개</p></div>
      <button data-admin-edit="${p.id}">수정</button>
      <button data-admin-delete="${p.id}">삭제</button>
    </article>
  `).join("");
  renderAdminOrders();
}

function stockToInput(stock = {}) {
  return Object.entries(stock).map(([size, count]) => `${e(size)}:${count}`).join(",");
}

function parseStock(value, sizes) {
  const entries = value.split(",").map((item) => item.trim()).filter(Boolean);
  const stock = Object.create(null);
  entries.forEach((entry) => {
    const [size, count] = entry.split(":").map((part) => part.trim());
    if (size) stock[size] = Number(count || 0);
  });
  sizes.forEach((size) => {
    if (stock[size] === undefined) stock[size] = 5;
  });
  return stock;
}

function resetAdminForm() {
  els.adminForm.reset();
  $("#adminProductId").value = "";
}

function resetLoginForm() {
  els.loginForm.reset();
  els.loginEmail.value = "";
  els.loginPassword.value = "";
}

function fillAdmin(product) {
  $("#adminProductId").value = product.id;
  $("#adminName").value = product.name;
  $("#adminBrand").value = product.brand;
  $("#adminCategory").value = product.category;
  $("#adminPrice").value = product.price;
  $("#adminDiscount").value = product.discount;
  $("#adminImage").value = product.image;
  $("#adminHoverImage").value = product.hoverImage || "";
  $("#adminSizes").value = product.sizes.join(",");
  $("#adminStock").value = stockToInput(product.stock);
  $("#adminBest").checked = product.isBest;
  $("#adminNew").checked = product.isNew;
}

function refresh() {
  products = products.map(withStock).filter(Boolean);
  state.cart = Shop.cart(products);
  renderHome();
  renderProducts();
  renderCart();
  renderWishlist();
  renderRecent();
  renderMyPage();
  renderAdmin();
}

function applyCollectionFilter(type, value) {
  state.category = "ALL";
  state.bestOnly = false;
  state.newOnly = false;
  state.brand = type === "brand" ? value : "";
  state.collection = type === "collection" ? value : "";
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
  showToast(type === "brand" ? `${value} 상품만 모았습니다.` : `${value} 기획전을 필터링했습니다.`);
}

function bind() {
  const syncScrollUi = () => {
    els.siteHeader.classList.toggle("scrolled", window.scrollY > 8);
    els.backTop.classList.toggle("show", window.scrollY > 720);
  };
  syncScrollUi();
  window.addEventListener("scroll", syncScrollUi, { passive: true });
  els.menuToggle.addEventListener("click", () => {
    const isOpen = els.nav.classList.toggle("open");
    els.menuToggle.classList.toggle("active", isOpen);
    if (!isOpen) els.moreDropdown?.classList.remove("open");
  });
  els.moreToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    els.moreDropdown.classList.toggle("open");
  });
  els.searchFocus.addEventListener("click", () => { $("#products").scrollIntoView({ behavior: "smooth" }); els.searchInput.focus(); });
  $$(".nav-link").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.scrollTarget) {
      $(`#${button.dataset.scrollTarget}`).scrollIntoView({ behavior: "smooth" });
      els.nav.classList.remove("open");
      els.menuToggle.classList.remove("active");
      els.moreDropdown?.classList.remove("open");
      return;
    }
    const category = button.dataset.category;
    if (!category) return;
    resetCollectionFilters();
    state.category = category === "NEW" || category === "BEST" ? "ALL" : category;
    state.newOnly = category === "NEW";
    state.bestOnly = category === "BEST";
    $$(".nav-link").forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
    $("#products").scrollIntoView({ behavior: "smooth" });
    els.nav.classList.remove("open");
    els.menuToggle.classList.remove("active");
    els.moreDropdown?.classList.remove("open");
  }));
  els.categoryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-shop-category]");
    if (!button) return;
    resetCollectionFilters();
    state.category = button.dataset.shopCategory;
    renderProducts();
  });
  els.bestFilter.addEventListener("click", () => { resetCollectionFilters(); state.bestOnly = !state.bestOnly; renderProducts(); });
  els.newFilter.addEventListener("click", () => { resetCollectionFilters(); state.newOnly = !state.newOnly; renderProducts(); });
  $("#filterReset").addEventListener("click", () => {
    Object.assign(state, { category: "ALL", bestOnly: false, newOnly: false, search: "", price: "all", brand: "", collection: "" });
    els.searchInput.value = "";
    els.priceSelect.value = "all";
    els.searchAssist.hidden = true;
    renderProducts();
  });
  els.sortSelect.addEventListener("change", (event) => { state.sort = event.target.value; renderProducts(); });
  els.priceSelect.addEventListener("change", (event) => { state.price = event.target.value; renderProducts(); });
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
    renderSearchAssist();
  });
  els.searchInput.addEventListener("focus", renderSearchAssist);
  els.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitSearch();
      els.searchAssist.hidden = true;
    }
    if (event.key === "Escape") els.searchAssist.hidden = true;
  });
  els.searchAssist.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-search-remove]");
    const clear = event.target.closest("[data-search-clear]");
    if (remove) {
      event.stopPropagation();
      state.recentSearches = state.recentSearches.filter((item) => item !== remove.dataset.searchRemove);
      save("blackFitRecentSearches", state.recentSearches);
      renderSearchAssist();
      return;
    }
    if (clear) {
      event.stopPropagation();
      state.recentSearches = [];
      save("blackFitRecentSearches", state.recentSearches);
      renderSearchAssist();
      return;
    }
    const pick = event.target.closest("[data-search-pick]");
    if (!pick) return;
    commitSearch(pick.dataset.searchPick);
    els.searchAssist.hidden = true;
  });
  document.body.addEventListener("click", (event) => {
    if (event.target.closest("[data-member-logout]")) { els.loginOpen.click(); closeLayers(); return; }
    if (event.target.closest("[data-member-admin]")) { openLayer("admin"); return; }
    const open = event.target.closest("[data-open-product]");
    const wish = event.target.closest("[data-wish]");
    const auth = event.target.closest("[data-open-auth]");
    const brand = event.target.closest("[data-brand-filter]");
    const collection = event.target.closest("[data-collection]");
    const orderDetail = event.target.closest("[data-order-detail]");
    if (!event.target.closest(".search-wrap")) els.searchAssist.hidden = true;
    if (!event.target.closest(".more-menu")) els.moreDropdown?.classList.remove("open");
    if (wish) {
      const id = Number(wish.dataset.wish);
      state.wishes.has(id) ? state.wishes.delete(id) : state.wishes.add(id);
      save("blackFitWishes", [...state.wishes]);
      refresh();
      return;
    }
    if (auth) {
      closeLayers();
      openLayer("auth");
      return;
    }
    if (brand) {
      applyCollectionFilter("brand", brand.dataset.brandFilter);
      return;
    }
    if (collection) {
      applyCollectionFilter("collection", collection.dataset.collection);
      return;
    }
    if (orderDetail) {
      renderOrderDetail(orderDetail.dataset.orderDetail);
      return;
    }
    if (open) openProduct(open.dataset.openProduct);
  });
  els.modalBody.addEventListener("click", (event) => {
    const galleryButton = event.target.closest("[data-gallery-image]");
    const sizeButton = event.target.closest("[data-size]");
    const qtyButton = event.target.closest("[data-modal-qty]");
    const tabButton = event.target.closest("[data-tab]");
    if (galleryButton) {
      $("#modalMainImage").src = galleryButton.dataset.galleryImage;
      $$("[data-gallery-image]").forEach((button) => button.classList.remove("active"));
      galleryButton.classList.add("active");
    }
    if (sizeButton && !sizeButton.disabled) {
      state.selectedSize = sizeButton.dataset.size;
      state.selectedQty = 1;
      $$(".size-button").forEach((button) => button.classList.remove("active"));
      sizeButton.classList.add("active");
      $("#modalQty").textContent = state.selectedQty;
      $("#modalNotice").textContent = "";
    }
    if (qtyButton) {
      const stock = state.selectedSize ? Number(state.activeProduct.stock?.[state.selectedSize] || 1) : 99;
      state.selectedQty = Math.max(1, Math.min(stock, state.selectedQty + (qtyButton.dataset.modalQty === "plus" ? 1 : -1)));
      $("#modalQty").textContent = state.selectedQty;
    }
    if (tabButton) renderProductTabs(tabButton.dataset.tab);
    if (event.target.closest("#addCartButton") || event.target.closest("#buyButton")) {
      if (!state.selectedSize) {
        $("#modalNotice").textContent = "사이즈를 선택해주세요.";
        return;
      }
      if (!addToCart(state.activeProduct, state.selectedSize, state.selectedQty)) return;
      if (event.target.closest("#buyButton")) {
        closeLayers();
        els.checkoutOpen.click();
      }
    }
  });
  els.modalBody.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-review-form]");
    if (!form) return;
    event.preventDefault();
    if (!state.user) return showToast("리뷰 작성은 로그인 후 가능합니다.");
    const productId = Number(form.dataset.reviewForm);
    const data = new FormData(form);
    const review = { user: state.user.id, rating: Number(data.get("rating")), text: data.get("text").trim() };
    if (!review.text || review.text.length > 1000 || !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) return showToast("리뷰 내용과 별점을 확인해주세요.");
    state.reviews[productId] = [review, ...productReviews(productId)].slice(0, 100);
    save("blackFitReviews", state.reviews);
    renderProductTabs("review");
    renderProducts();
    renderHome();
    Shop.icons();
    showToast("리뷰가 등록되었습니다.");
  });
  els.cartList.addEventListener("change", (event) => {
    const select = event.target.closest("[data-cart-size]");
    if (!select) return;
    products = Shop.products();
    state.cart = Shop.cart(products);
    const item = state.cart.find((entry) => entry.key === select.dataset.cartSize);
    if (!item) return renderCart();
    const product = products.find((entry) => entry.id === item.id);
    const existing = state.cart.find((entry) => entry.id === item.id && entry.size === select.value && entry.key !== item.key);
    if (!product.sizes.includes(select.value) || item.quantity + (existing?.quantity || 0) > product.stock[select.value]) {
      showToast("선택한 옵션의 재고가 부족합니다.");
      return renderCart();
    }
    if (existing) { existing.quantity += item.quantity; state.cart = state.cart.filter((entry) => entry !== item); }
    else { item.size = select.value; item.key = `${item.id}-${select.value}`; }
    save("blackFitCart", state.cart);
    renderCart();
  });
  els.cartList.addEventListener("click", (event) => {
    const qty = event.target.closest("[data-cart-qty]");
    const remove = event.target.closest("[data-remove]");
    if (qty) {
      const item = state.cart.find((cartItem) => cartItem.key === qty.dataset.key);
      if (!item) return;
      const nextQty = item.quantity + (qty.dataset.cartQty === "plus" ? 1 : -1);
      if (nextQty > getCartStock(item)) return showToast("선택한 사이즈의 재고를 초과했습니다.");
      item.quantity = nextQty;
      if (item.quantity <= 0) state.cart = state.cart.filter((cartItem) => cartItem.key !== item.key);
      save("blackFitCart", state.cart);
      renderCart();
    }
    if (remove) {
      state.cart = state.cart.filter((item) => item.key !== remove.dataset.remove);
      save("blackFitCart", state.cart);
      renderCart();
    }
  });
  els.wishlistList.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-wish]");
    if (!remove) return;
    state.wishes.delete(Number(remove.dataset.removeWish));
    save("blackFitWishes", [...state.wishes]);
    refresh();
  });
  els.couponApply.addEventListener("click", () => {
    const code = els.couponInput.value.trim().toUpperCase();
    if (!code) {
      state.coupon = null;
      save("blackFitCoupon", null);
      renderCart();
      return showToast("쿠폰 적용을 해제했습니다.");
    }
    if (!["BLACK10", "WELCOME15", "FREESHIP"].includes(code)) return showToast("사용할 수 없는 쿠폰입니다.");
    state.coupon = code;
    save("blackFitCoupon", state.coupon);
    renderCart();
    showToast(`${code} 쿠폰을 적용했습니다.`);
  });
  els.cartOpen.addEventListener("click", () => openLayer("cart"));
  els.wishlistOpen.addEventListener("click", () => openLayer("wish"));
  els.mypageOpen.addEventListener("click", () => openLayer("my"));
  els.checkoutOpen.addEventListener("click", () => {
    if (!state.cart.length) return showToast("장바구니에 상품을 먼저 담아주세요.");
    state.cart = Shop.cart();
    if (!state.cart.length) return showToast("장바구니가 변경되었습니다. 상품을 다시 확인해주세요.");
    closeLayers();
    els.checkoutTotal.textContent = formatPrice(cartTotal().total);
    els.checkoutForm.hidden = false;
    els.orderComplete.hidden = true;
    openLayer("checkout");
  });
  els.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (els.checkoutForm.dataset.pending) return;
    const customer = { name: $("#orderName").value.trim(), phone: $("#orderPhone").value.trim(), address: $("#orderAddress").value.trim() };
    if (!customer.name || !customer.address || !/^\+?[0-9 ()-]{7,24}$/.test(customer.phone) || !/^[0-9]{7,15}$/.test(customer.phone.replace(/\D/g, ""))) return showToast("수령인, 연락처와 배송지를 확인해주세요.");
    products = Shop.products();
    const latestCart = Shop.cart(products);
    if (JSON.stringify(latestCart) !== JSON.stringify(state.cart)) {
      state.cart = latestCart;
      renderCart();
      els.checkoutTotal.textContent = formatPrice(cartTotal().total);
      return showToast("상품이나 장바구니가 변경되었습니다. 금액과 옵션을 확인한 뒤 다시 주문해주세요.");
    }
    if (!state.cart.length || state.cart.some((item) => item.quantity > getCartStock(item))) return showToast("품절 또는 재고가 부족한 옵션이 있습니다. 장바구니를 수정해주세요.");
    els.checkoutForm.dataset.pending = "true";
    try {
      const orderNumber = `BF-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const orderedItems = Shop.clone(state.cart);
      const updatedProducts = Shop.clone(products);
      orderedItems.forEach((item) => { updatedProducts.find((product) => product.id === item.id).stock[item.size] -= item.quantity; });
      const total = cartTotal();
      const orders = [{ orderNumber, items: orderedItems, ...total, coupon: state.coupon, customer,
        memo: $("#orderMemo").value.trim(), userId: state.user?.id || null,
        status: "결제완료", demo: true, createdAt: new Date().toLocaleString("ko-KR") }, ...Shop.orders()];
      if (!Shop.transaction({ blackFitOrders: orders, blackFitProducts: updatedProducts, blackFitCart: [], blackFitCoupon: null })) return;
      products = updatedProducts;
      state.orders = orders;
      state.cart = [];
      state.coupon = null;
      refresh();
      els.checkoutForm.reset();
      els.checkoutForm.hidden = true;
      els.orderComplete.hidden = false;
      els.orderNumberText.textContent = `주문번호 ${orderNumber}`;
    } finally { delete els.checkoutForm.dataset.pending; }
  });
  els.loginOpen.addEventListener("click", () => {
    if (state.user) {
      state.user = null;
      save("blackFitUser", null);
      resetLoginForm();
      renderLogin();
      renderMyPage();
      return showToast("로그아웃되었습니다.");
    }
    resetLoginForm();
    openLayer("auth");
  });
  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = els.loginEmail.value.trim();
    const password = els.loginPassword.value.trim();
    if (!id || id.length > 80 || !password) return showToast("아이디와 비밀번호를 확인해주세요.");
    const isAdmin = id === "admin" && password === "admin";
    state.user = { role: isAdmin ? "admin" : "member", id };
    save("blackFitUser", state.user);
    renderLogin();
    renderMyPage();
    closeLayers();
    showToast(isAdmin ? "관리자 계정으로 로그인했습니다." : "로그인되었습니다.");
  });
  els.adminOpen.addEventListener("click", () => openLayer("admin"));
  els.adminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const sizes = [...new Set($("#adminSizes").value.split(",").map((size) => size.trim()).filter(Boolean))];
    const previous = products.find((item) => item.id === Number($("#adminProductId").value));
    const product = {
      ...previous,
      id: Number($("#adminProductId").value) || Date.now(),
      name: $("#adminName").value.trim(),
      brand: $("#adminBrand").value.trim(),
      category: $("#adminCategory").value,
      price: Number($("#adminPrice").value),
      discount: Number($("#adminDiscount").value),
      image: $("#adminImage").value.trim(),
      hoverImage: $("#adminHoverImage").value.trim(),
      sizes,
      stock: parseStock($("#adminStock").value, sizes),
      collections: previous?.collections || [],
      rating: previous?.rating || 0,
      isBest: $("#adminBest").checked,
      isNew: $("#adminNew").checked,
      createdAt: Number(new Date().toISOString().slice(0, 10).replaceAll("-", ""))
    };
    const normalized = Shop.normalizeProduct(product);
    if (!normalized || sizes.length !== normalized.sizes.length || Object.values(product.stock).some((count) => !Number.isInteger(count) || count < 0 || count > 100000)) return showToast("상품명, 가격, 이미지 경로와 옵션별 재고를 확인해주세요.");
    Object.assign(product, normalized);
    const index = products.findIndex((item) => item.id === product.id);
    index >= 0 ? products[index] = product : products.unshift(product);
    save("blackFitProducts", products);
    resetAdminForm();
    refresh();
    showToast("상품 정보가 저장되었습니다.");
  });
  els.adminList.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-admin-edit]");
    const remove = event.target.closest("[data-admin-delete]");
    if (edit) fillAdmin(products.find((item) => item.id === Number(edit.dataset.adminEdit)));
    if (remove) {
      if (!confirm("상품을 삭제할까요? 장바구니에서도 제외됩니다.")) return;
      products = products.filter((item) => item.id !== Number(remove.dataset.adminDelete));
      save("blackFitProducts", products);
      refresh();
    }
  });
  els.adminOrderList.addEventListener("change", (event) => {
    const select = event.target.closest("[data-order-status]");
    if (!select) return;
    const order = state.orders.find((item) => item.orderNumber === select.dataset.orderStatus);
    if (!order) return;
    order.status = select.value;
    save("blackFitOrders", state.orders);
    renderMyPage();
    showToast("주문 상태가 변경되었습니다.");
  });
  els.adminOrderList.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-order-delete]");
    if (!remove) return;
    if (!confirm("이 주문 내역을 삭제할까요?")) return;
    state.orders = state.orders.filter((order) => order.orderNumber !== remove.dataset.orderDelete);
    save("blackFitOrders", state.orders);
    renderAdminOrders();
    renderMyPage();
    showToast("주문이 삭제되었습니다.");
  });
  els.adminResetForm.addEventListener("click", resetAdminForm);
  els.adminResetProducts.addEventListener("click", () => {
    if (!confirm("기본 상품과 재고를 복원할까요? 추가·수정한 상품 정보는 대체됩니다.")) return;
    products = Shop.clone(baseProducts);
    save("blackFitProducts", products);
    refresh();
    resetAdminForm();
  });
  els.recentClear.addEventListener("click", () => { state.recent = []; save("blackFitRecent", state.recent); renderRecent(); });
  els.backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $(".newsletter")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#newsletterEmail").value.trim().toLowerCase();
    const stored = readStorage("blackFitNewsletter", []);
    const subscribers = Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
    if (subscribers.includes(email)) return showToast("이미 이 브라우저에 저장된 이메일입니다.");
    save("blackFitNewsletter", [...subscribers, email]);
    event.currentTarget.reset();
    showToast("데모 구독 정보를 이 브라우저에 저장했습니다. 메일은 발송되지 않습니다.");
  });
  els.bottomNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bottom-action]");
    if (!button) return;
    if (button.dataset.bottomAction === "home") $("#home").scrollIntoView({ behavior: "smooth" });
    if (button.dataset.bottomAction === "search") els.searchFocus.click();
    if (button.dataset.bottomAction === "wish") els.wishlistOpen.click();
    if (button.dataset.bottomAction === "cart") els.cartOpen.click();
    if (button.dataset.bottomAction === "my") els.mypageOpen.click();
  });
  [els.cartClose, els.wishlistClose, els.mypageClose, els.orderClose, els.authClose, els.adminClose, els.checkoutClose, els.modalClose, els.orderDone, els.overlay].forEach((button) => button.addEventListener("click", closeLayers));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeLayers(); els.nav.classList.remove("open"); els.moreDropdown?.classList.remove("open"); }
    if (event.key !== "Tab" || !activeLayer) return;
    const focusable = [...activeLayer.querySelectorAll('button, input, select, textarea, a[href], [tabindex="0"]')].filter((element) => !element.disabled && element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

function init() {
  document.querySelectorAll(".dialog, .side-panel").forEach((layer) => {
    layer.inert = true;
    const heading = layer.querySelector("h2");
    if (heading) { heading.id = `${layer.id}Title`; layer.setAttribute("aria-labelledby", heading.id); }
    else layer.setAttribute("aria-label", "상품 상세");
  });
  renderHome();
  renderFilters();
  renderProducts();
  renderCart();
  renderWishlist();
  renderRecent();
  renderLogin();
  renderMyPage();
  renderAdmin();
  window.addEventListener("storage", (event) => {
    if (!event.key?.startsWith("blackFit")) return;
    products = Shop.products(); state.cart = Shop.cart(products); state.orders = Shop.orders(); state.wishes = new Set(Shop.ids("blackFitWishes")); state.coupon = readStorage("blackFitCoupon", null);
    refresh();
    if (activeLayer === els.modal || activeLayer === els.checkoutModal) { closeLayers(); showToast("다른 탭에서 상품 또는 장바구니가 변경되었습니다. 다시 확인해주세요."); }
  });
  bind();
  Shop.icons();
  const query = new URLSearchParams(location.search);
  if (query.get("cart") === "1") openLayer("cart");
  if (query.get("checkout") === "1") els.checkoutOpen.click();
  if (query.has("product")) openProduct(Number(query.get("product")));
}

init();
}).catch(() => Shop.notify("화면을 준비하지 못했습니다. 저장 공간과 서버 연결을 확인한 뒤 새로고침해주세요."));

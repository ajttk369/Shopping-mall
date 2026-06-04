const pageProducts = [
  { id: 1, name: "에센셜 와플 크롭 반팔티_5color", brand: "BLACK FIT", category: "TOP", price: 39000, discount: 12, image: "images/products/essential-waffle-crop-tee-product.png", rating: 4.9, sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "SY PUNCHING CAP SLEEVE TEE", brand: "STUDIO LOW", category: "TOP", price: 42000, discount: 10, image: "images/products/SY PUNCHING CAP SLEEVE TEE.png", rating: 4.7, sizes: ["S", "M", "L"] },
  { id: 3, name: "VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR", brand: "VOID ARCHIVE", category: "TOP", price: 36000, discount: 8, image: "images/products/VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR.png", rating: 4.8, sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "워셔블 데일리 반팔 니트_8color", brand: "MONO LANE", category: "TOP", price: 49000, discount: 15, image: "images/products/워셔블 데일리 반팔 니트_8color.png", rating: 4.6, sizes: ["S", "M", "L"] },
  { id: 5, name: "트윌 재킷-네이비", brand: "VOID ARCHIVE", category: "OUTER", price: 128000, discount: 12, image: "images/products/트윌 재킷-네이비.png", rating: 4.8, sizes: ["M", "L", "XL"] },
  { id: 6, name: "와플 클래식 트랙탑 - 원더화이트", brand: "STUDIO LOW", category: "OUTER", price: 89000, discount: 14, image: "images/products/와플 클래식 트랙탑 - 원더화이트.png", rating: 4.9, sizes: ["S", "M", "L", "XL"] },
  { id: 7, name: "BDU 드로우스트링 릴렉스드 팬츠", brand: "NEAT FIELD", category: "PANTS", price: 76000, discount: 18, image: "images/products/BDU 드로우스트링 릴렉스드 팬츠.png", rating: 4.8, sizes: ["28", "30", "32", "34"] },
  { id: 8, name: "DGMA PATCHED SEMI BAGGY DENIM PANTS", brand: "BLACK STUDIO", category: "PANTS", price: 96000, discount: 14, image: "images/products/DGMA PATCHED SEMI BAGGY DENIM PANTS.png", rating: 4.8, sizes: ["28", "30", "32", "34"] },
  { id: 9, name: "뉴발란스 U740", brand: "URBAN EDGE", category: "SHOES", price: 129000, discount: 7, image: "images/products/뉴발란스 U740.png", rating: 4.9, sizes: ["240", "250", "260", "270", "280"] },
  { id: 10, name: "우먼즈 나일론 슬라우치 숄더백", brand: "LOW CLASSIC", category: "BAG", price: 78000, discount: 12, image: "images/products/우먼즈 나일론 슬라우치 숄더백.png", rating: 4.7, sizes: ["FREE"] },
  { id: 11, name: "WAYFARER 선글라스 - 매트 블랙", brand: "NOIR MUSE", category: "ACC", price: 59000, discount: 9, image: "images/products/WAYFARER 선글라스 - 매트 블랙.png", rating: 4.7, sizes: ["FREE"] },
  { id: 12, name: "트로이 웨스턴 레더 벨트", brand: "MONO LANE", category: "ACC", price: 54000, discount: 9, image: "images/products/트로이 웨스턴 레더 벨트.png", rating: 4.6, sizes: ["FREE"] }
];

const pageBrands = [
  { name: "MONO LANE", copy: "기본에 집중한 미니멀 데일리웨어를 제안합니다.", image: "images/products/워셔블 데일리 반팔 니트_8color-model.png" },
  { name: "STUDIO LOW", copy: "편안한 소재와 실용적인 실루엣을 중심으로 전개합니다.", image: "images/products/와플 클래식 트랙탑 - 원더화이트-model.png" },
  { name: "VOID ARCHIVE", copy: "도시적인 아우터와 테크 무드를 큐레이션합니다.", image: "images/products/트윌 재킷-네이비-model.png" },
  { name: "NEAT FIELD", copy: "팬츠와 셋업 중심의 단정한 캐주얼을 보여줍니다.", image: "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png" }
];

const pageFormatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const pageSalePrice = (product) => Math.round(product.price * (100 - product.discount) / 100);

function pageCard(product) {
  return `
    <article class="sub-product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <span>${product.category}</span>
        <strong>${product.brand}</strong>
        <h3>${product.name}</h3>
        <p><b>${product.discount}%</b> ${pageFormatPrice(pageSalePrice(product))}</p>
      </a>
    </article>
  `;
}

function renderBrandPage() {
  const list = document.querySelector("#brandPageGrid");
  if (!list) return;

  list.innerHTML = pageBrands.map((brand) => {
    const count = pageProducts.filter((product) => product.brand === brand.name).length;
    return `
      <article class="sub-brand-tile">
        <img src="${brand.image}" alt="${brand.name}">
        <div>
          <span>${count} items</span>
          <h3>${brand.name}</h3>
          <p>${brand.copy}</p>
          <a href="search.html?q=${encodeURIComponent(brand.name)}">상품 보기</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderProductPage() {
  const wrap = document.querySelector("#productPageDetail");
  if (!wrap) return;

  const id = Number(new URLSearchParams(location.search).get("id")) || 1;
  const product = pageProducts.find((item) => item.id === id) || pageProducts[0];

  wrap.innerHTML = `
    <div class="product-page-gallery">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-page-info">
      <p class="eyebrow">${product.brand}</p>
      <h1>${product.name}</h1>
      <div class="rating">★ ${product.rating.toFixed(1)} · ${product.category}</div>
      <div class="modal-price"><span class="discount">${product.discount}%</span> <strong>${pageFormatPrice(pageSalePrice(product))}</strong></div>
      <div class="spec-grid">
        <div><span>FIT</span><strong>Regular</strong></div>
        <div><span>FABRIC</span><strong>Cotton Blend</strong></div>
        <div><span>CARE</span><strong>Dry Clean</strong></div>
        <div><span>MODEL</span><strong>178cm / M</strong></div>
      </div>
      <div class="purchase-box static">
        <p><strong>Size</strong></p>
        <div class="size-options">${product.sizes.map((size) => `<button class="size-button">${size}</button>`).join("")}</div>
        <a class="primary-btn full" href="index.html#products">메인에서 장바구니 담기</a>
      </div>
      <div class="sub-detail-copy">
        <h2>Detail</h2>
        <p>BLACK FIT의 ${product.category} 큐레이션 상품입니다. 미니멀한 실루엣과 데일리하게 활용하기 좋은 소재감을 기준으로 선정했습니다.</p>
      </div>
    </div>
  `;
}

function renderSearchPage() {
  const input = document.querySelector("#searchPageInput");
  const grid = document.querySelector("#searchPageGrid");
  if (!input || !grid) return;

  const params = new URLSearchParams(location.search);
  input.value = params.get("q") || "";

  const draw = () => {
    const keyword = input.value.trim().toLowerCase();
    const result = pageProducts.filter((product) => (
      !keyword ||
      product.name.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    ));
    grid.innerHTML = result.length
      ? result.map(pageCard).join("")
      : `<div class="empty-state">검색 결과가 없습니다.</div>`;
  };

  input.addEventListener("input", draw);
  draw();
}

function renderMypagePage() {
  const wrap = document.querySelector("#mypageDashboard");
  if (!wrap) return;

  const orders = JSON.parse(localStorage.getItem("blackFitOrders") || "[]");
  const wishes = JSON.parse(localStorage.getItem("blackFitWishes") || "[]");

  wrap.innerHTML = `
    <div class="member-metrics page-metrics">
      <div><strong>${orders.length}</strong><span>Orders</span></div>
      <div><strong>${wishes.length}</strong><span>Wishlist</span></div>
      <div><strong>3</strong><span>Coupons</span></div>
    </div>
    <section class="sub-panel">
      <h2>주문 내역</h2>
      ${orders.length ? orders.map((order) => `
        <article class="order-card">
          <div class="order-top"><strong>${order.orderNumber}</strong><span>${order.status || "결제완료"}</span></div>
          <p>${order.createdAt || "-"} · ${order.items?.length || 0}개 상품</p>
          <b>${pageFormatPrice(order.total || 0)}</b>
        </article>
      `).join("") : `<p class="guide">아직 주문 내역이 없습니다.</p>`}
    </section>
  `;
}

renderBrandPage();
renderProductPage();
renderSearchPage();
renderMypagePage();

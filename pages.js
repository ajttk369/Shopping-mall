const pageProducts = [
  { id: 1, name: "오버사이즈 나일론 후드 파카", brand: "VOID ARCHIVE", category: "OUTER", price: 89000, discount: 18, image: "images/1523398002811-999ca8dec234.jpg", rating: 4.8, sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "미니멀 코튼 로고 티셔츠", brand: "MONO LANE", category: "TOP", price: 32000, discount: 12, image: "images/1521572163474-6864f9cf17ab.jpg", rating: 4.7, sizes: ["S", "M", "L"] },
  { id: 3, name: "와이드 핏 블랙 슬랙스", brand: "NEAT FIELD", category: "PANTS", price: 69000, discount: 20, image: "images/1473966968600-fa801b869a1a.jpg", rating: 4.9, sizes: ["28", "30", "32", "34"] },
  { id: 4, name: "레더 무드 숄더 백", brand: "STUDIO LOW", category: "BAG", price: 76000, discount: 15, image: "images/1590874103328-eac38a683ce7.jpg", rating: 4.6, sizes: ["FREE"] },
  { id: 9, name: "테크 러너 스니커즈", brand: "URBAN EDGE", category: "SHOES", price: 129000, discount: 25, image: "images/1608231387042-66d1773070a5.jpg", rating: 4.9, sizes: ["250", "260", "270", "280"] },
  { id: 11, name: "더블 브레스티드 코트", brand: "BLACK STUDIO", category: "OUTER", price: 189000, discount: 18, image: "images/1544022613-e87ca75a784a.jpg", rating: 4.8, sizes: ["S", "M", "L"] },
  { id: 19, name: "에센셜 와플 크롭 반팔티_5color", brand: "BLACK FIT", category: "TOP", price: 39000, discount: 12, image: "images/products/essential-waffle-crop-tee-product.png", rating: 4.9, sizes: ["S", "M", "L", "XL"] }
];

const pageBrands = [
  { name: "MONO LANE", copy: "기본에 집중한 미니멀 데일리웨어.", image: "images/1521572163474-6864f9cf17ab.jpg" },
  { name: "STUDIO LOW", copy: "부드러운 소재와 실용적인 실루엣.", image: "images/1516826957135-700dedea698c.jpg" },
  { name: "VOID ARCHIVE", copy: "도시적인 아우터와 테크 무드.", image: "images/1543076447-215ad9ba6923.jpg" },
  { name: "NEAT FIELD", copy: "슬랙스와 셋업 중심의 정돈된 캐주얼.", image: "images/1473966968600-fa801b869a1a.jpg" }
];

pageProducts.splice(0, pageProducts.length,
  { id: 1, name: "에센셜 와플 크롭 반팔티_5color", brand: "BLACK FIT", category: "TOP", price: 39000, discount: 12, image: "images/products/essential-waffle-crop-tee-product.png", rating: 4.9, sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "SY PUNCHING CAP SLEEVE TEE", brand: "STUDIO LOW", category: "TOP", price: 42000, discount: 10, image: "images/products/SY PUNCHING CAP SLEEVE TEE.png", rating: 4.7, sizes: ["S", "M", "L"] },
  { id: 3, name: "VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR", brand: "VOID ARCHIVE", category: "TOP", price: 36000, discount: 8, image: "images/products/VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR.png", rating: 4.8, sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "워셔블 데일리 반팔 니트_8color", brand: "MONO LANE", category: "TOP", price: 49000, discount: 15, image: "images/products/워셔블 데일리 반팔 니트_8color.png", rating: 4.6, sizes: ["S", "M", "L"] },
  { id: 7, name: "스트라이프 집 트랙탑", brand: "BLACK STUDIO", category: "OUTER", price: 79000, discount: 16, image: "images/products/스트라이프 집 트랙탑.png", rating: 4.8, sizes: ["S", "M", "L", "XL"] },
  { id: 8, name: "와플 클래식 트랙탑 - 원더화이트", brand: "STUDIO LOW", category: "OUTER", price: 89000, discount: 14, image: "images/products/와플 클래식 트랙탑 - 원더화이트.png", rating: 4.9, sizes: ["S", "M", "L", "XL"] },
  { id: 11, name: "BDU 드로우스트링 릴렉스드 팬츠", brand: "NEAT FIELD", category: "PANTS", price: 76000, discount: 18, image: "images/products/BDU 드로우스트링 릴렉스드 팬츠.png", rating: 4.8, sizes: ["28", "30", "32", "34"] },
  { id: 13, name: "스트링 밴딩 빈티지 다크 블루 워싱 포켓 카고 와이드 버뮤다 데님 반바지", brand: "BLACK STUDIO", category: "PANTS", price: 69000, discount: 15, image: "images/products/스트링 밴딩 빈티지 다크 블루 워싱 포켓 카고 와이드 버뮤다 데님 반바지.png", rating: 4.6, sizes: ["S", "M", "L", "XL"] },
  { id: 16, name: "Flipflop 02", brand: "URBAN EDGE", category: "SHOES", price: 39000, discount: 8, image: "images/products/Flipflop 02.png", rating: 4.5, sizes: ["240", "250", "260", "270", "280"] },
  { id: 19, name: "화이트라벨 일렉트론 엘티 30 DARK GRAY", brand: "BLACK STUDIO", category: "BAG", price: 118000, discount: 13, image: "images/products/화이트라벨 일렉트론 엘티 30 DARK GRAY.png", rating: 4.8, sizes: ["FREE"] },
  { id: 21, name: "셀리나 리젠나일론 토트 크로스백", brand: "MONO LANE", category: "BAG", price: 86000, discount: 12, image: "images/products/셀리나 리젠나일론 토트 크로스백.png", rating: 4.7, sizes: ["FREE"] },
  { id: 24, name: "WAYFARER 선글라스 - 매트 블랙", brand: "NOIR MUSE", category: "ACC", price: 59000, discount: 9, image: "images/products/WAYFARER 선글라스 - 매트 블랙.png", rating: 4.7, sizes: ["FREE"] },
  { id: 28, name: "텐셀 린넨 크롭 하프 셔츠", brand: "LOW CLASSIC", category: "TOP", price: 69000, discount: 15, image: "images/products/텐셀 린넨 크롭 하프 셔츠.png", rating: 4.8, sizes: ["S", "M", "L"] },
  { id: 29, name: "DGMA PATCHED SEMI BAGGY DENIM PANTS", brand: "BLACK STUDIO", category: "PANTS", price: 96000, discount: 14, image: "images/products/DGMA PATCHED SEMI BAGGY DENIM PANTS.png", rating: 4.8, sizes: ["28", "30", "32", "34"] },
  { id: 36, name: "뉴발란스 U740", brand: "URBAN EDGE", category: "SHOES", price: 129000, discount: 7, image: "images/products/뉴발란스 U740.png", rating: 4.9, sizes: ["240", "250", "260", "270", "280"] },
  { id: 38, name: "이클립스 라이트팩", brand: "VOID ARCHIVE", category: "BAG", price: 89000, discount: 11, image: "images/products/이클립스 라이트팩.png", rating: 4.8, sizes: ["FREE"] },
  { id: 40, name: "뉴 LA 볼드 코튼 볼캡", brand: "BLACK STUDIO", category: "ACC", price: 42000, discount: 8, image: "images/products/뉴 LA 볼드 코튼 볼캡.png", rating: 4.7, sizes: ["FREE"] }
);

const pageFormatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const pageSalePrice = (product) => Math.round(product.price * (100 - product.discount) / 100);
const pageCard = (product) => `
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

function renderBrandPage() {
  const list = document.querySelector("#brandPageGrid");
  if (!list) return;
  list.innerHTML = pageBrands.map((brand) => {
    const count = pageProducts.filter((product) => product.brand === brand.name).length;
    return `<article class="sub-brand-tile"><img src="${brand.image}" alt="${brand.name}"><div><span>${count} items</span><h3>${brand.name}</h3><p>${brand.copy}</p><a href="search.html?q=${encodeURIComponent(brand.name)}">상품 보기</a></div></article>`;
  }).join("");
}

function renderProductPage() {
  const wrap = document.querySelector("#productPageDetail");
  if (!wrap) return;
  const id = Number(new URLSearchParams(location.search).get("id")) || 1;
  const product = pageProducts.find((item) => item.id === id) || pageProducts[0];
  wrap.innerHTML = `
    <div class="product-page-gallery"><img src="${product.image}" alt="${product.name}"></div>
    <div class="product-page-info">
      <p class="eyebrow">${product.brand}</p>
      <h1>${product.name}</h1>
      <div class="rating">★ ${product.rating.toFixed(1)} · ${product.category}</div>
      <div class="modal-price"><span class="discount">${product.discount}%</span> <strong>${pageFormatPrice(pageSalePrice(product))}</strong></div>
      <div class="spec-grid"><div><span>FIT</span><strong>Regular</strong></div><div><span>FABRIC</span><strong>Cotton Blend</strong></div><div><span>CARE</span><strong>Dry Clean</strong></div><div><span>MODEL</span><strong>178cm / M</strong></div></div>
      <div class="purchase-box static"><p><strong>Size</strong></p><div class="size-options">${product.sizes.map((size) => `<button class="size-button">${size}</button>`).join("")}</div><a class="primary-btn full" href="index.html#products">메인에서 장바구니 담기</a></div>
      <div class="sub-detail-copy"><h2>Detail</h2><p>BLACK FIT이 큐레이션한 ${product.category} 아이템입니다. 미니멀한 실루엣과 높은 활용도를 기준으로 셀렉션했습니다.</p></div>
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
    const result = pageProducts.filter((product) => !keyword || product.name.toLowerCase().includes(keyword) || product.brand.toLowerCase().includes(keyword) || product.category.toLowerCase().includes(keyword));
    grid.innerHTML = result.length ? result.map(pageCard).join("") : `<div class="empty-state">검색 결과가 없습니다.</div>`;
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
    <div class="member-metrics page-metrics"><div><strong>${orders.length}</strong><span>Orders</span></div><div><strong>${wishes.length}</strong><span>Wishlist</span></div><div><strong>3</strong><span>Coupons</span></div></div>
    <section class="sub-panel"><h2>주문 내역</h2>${orders.length ? orders.map((order) => `<article class="order-card"><div class="order-top"><strong>${order.orderNumber}</strong><span>${order.status || "결제완료"}</span></div><p>${order.createdAt || "-"} · ${order.items?.length || 0}개 상품</p><b>${pageFormatPrice(order.total || 0)}</b></article>`).join("") : `<p class="guide">아직 주문 내역이 없습니다.</p>`}</section>
  `;
}

renderBrandPage();
renderProductPage();
renderSearchPage();
renderMypagePage();

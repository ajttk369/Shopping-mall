const baseProducts = [
  { id: 1, name: "오버사이즈 나일론 후드 파카", brand: "VOID ARCHIVE", category: "OUTER", price: 89000, discount: 18, image: "images/1523398002811-999ca8dec234.jpg", sizes: ["S", "M", "L", "XL"], stock: { S: 4, M: 8, L: 5, XL: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260523, collections: ["Minimal Black Edit", "Summer Layering"] },
  { id: 2, name: "미니멀 코튼 로고 티셔츠", brand: "MONO LANE", category: "TOP", price: 32000, discount: 12, image: "images/1521572163474-6864f9cf17ab.jpg", sizes: ["S", "M", "L"], stock: { S: 7, M: 12, L: 4 }, rating: 4.7, isBest: true, isNew: false, createdAt: 20260510, collections: ["Minimal Black Edit"] },
  { id: 3, name: "와이드 턱 블랙 슬랙스", brand: "NEAT FIELD", category: "PANTS", price: 69000, discount: 20, image: "images/1473966968600-fa801b869a1a.jpg", sizes: ["28", "30", "32", "34"], stock: { 28: 3, 30: 9, 32: 6, 34: 1 }, rating: 4.9, isBest: true, isNew: false, createdAt: 20260428, collections: ["Minimal Black Edit"] },
  { id: 4, name: "레더 무드 숄더 백", brand: "STUDIO LOW", category: "BAG", price: 76000, discount: 15, image: "images/1590874103328-eac38a683ce7.jpg", sizes: ["FREE"], stock: { FREE: 8 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260524, collections: ["Summer Layering"] },
  { id: 5, name: "클린 레더 스니커즈", brand: "URBAN EDGE", category: "SHOES", price: 99000, discount: 10, image: "images/1549298916-b41d501d3772.jpg", sizes: ["250", "260", "270", "280"], stock: { 250: 2, 260: 5, 270: 7, 280: 3 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260415, collections: ["Sneaker Utility"] },
  { id: 6, name: "라이트웨이트 워머 블루종", brand: "VOID ARCHIVE", category: "OUTER", price: 118000, discount: 22, image: "images/1543076447-215ad9ba6923.jpg", sizes: ["M", "L", "XL"], stock: { M: 4, L: 0, XL: 3 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260521, collections: ["Summer Layering"] },
  { id: 7, name: "소프트 니트 집업", brand: "STUDIO LOW", category: "TOP", price: 59000, discount: 17, image: "images/1516826957135-700dedea698c.jpg", sizes: ["S", "M", "L"], stock: { S: 3, M: 6, L: 0 }, rating: 4.5, isBest: false, isNew: true, createdAt: 20260520, collections: ["Summer Layering"] },
  { id: 8, name: "카펜터 워싱 데님 팬츠", brand: "NEAT FIELD", category: "PANTS", price: 82000, discount: 14, image: "images/1541099649105-f69ad21f3246.jpg", sizes: ["28", "30", "32", "34"], stock: { 28: 2, 30: 5, 32: 5, 34: 2 }, rating: 4.7, isBest: true, isNew: false, createdAt: 20260430, collections: ["Summer Layering"] },
  { id: 9, name: "테크 러너 스니커즈", brand: "URBAN EDGE", category: "SHOES", price: 129000, discount: 25, image: "images/1608231387042-66d1773070a5.jpg", sizes: ["250", "260", "270", "280", "290"], stock: { 250: 1, 260: 4, 270: 6, 280: 5, 290: 0 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260525, collections: ["Sneaker Utility"] },
  { id: 10, name: "컴팩트 메신저 크로스백", brand: "MONO LANE", category: "BAG", price: 54000, discount: 8, image: "images/1622560480605-d83c853bc5c3.jpg", sizes: ["FREE"], stock: { FREE: 11 }, rating: 4.4, isBest: false, isNew: false, createdAt: 20260412, collections: ["Minimal Black Edit"] },
  { id: 11, name: "더블 브레스티드 코트", brand: "BLACK STUDIO", category: "OUTER", price: 189000, discount: 18, image: "images/1544022613-e87ca75a784a.jpg", sizes: ["S", "M", "L"], stock: { S: 2, M: 5, L: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260526, collections: ["Minimal Black Edit"] },
  { id: 12, name: "슬림 드레이프 니트", brand: "LOW CLASSIC", category: "TOP", price: 73000, discount: 9, image: "images/1434389677669-e08b4cac3105.jpg", sizes: ["S", "M", "L"], stock: { S: 4, M: 4, L: 1 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260522, collections: ["Minimal Black Edit"] },
  { id: 13, name: "바이커 레더 재킷", brand: "NOIR MUSE", category: "OUTER", price: 248000, discount: 12, image: "images/1551028719-00167b16eac5.jpg", sizes: ["M", "L", "XL"], stock: { M: 2, L: 3, XL: 1 }, rating: 4.9, isBest: true, isNew: false, createdAt: 20260422, collections: ["Minimal Black Edit"] },
  { id: 14, name: "스퀘어 첼시 부츠", brand: "URBAN EDGE", category: "SHOES", price: 148000, discount: 15, image: "images/1605812860427-4024433a70fd.jpg", sizes: ["240", "250", "260", "270"], stock: { 240: 2, 250: 0, 260: 3, 270: 4 }, rating: 4.7, isBest: true, isNew: false, createdAt: 20260402, collections: ["Sneaker Utility"] },
  { id: 15, name: "미니멀 토트 백", brand: "MONO LANE", category: "BAG", price: 88000, discount: 7, image: "images/1594223274512-ad4803739b7c.jpg", sizes: ["FREE"], stock: { FREE: 9 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260425, collections: ["Summer Layering"] },
  { id: 16, name: "메탈 프레임 선글라스", brand: "NOIR MUSE", category: "ACC", price: 49000, discount: 5, image: "images/1511499767150-a48a237f0083.jpg", sizes: ["FREE"], stock: { FREE: 15 }, rating: 4.2, isBest: false, isNew: true, createdAt: 20260514, collections: ["Summer Layering"] },
  { id: 17, name: "코튼 와이드 카고 팬츠", brand: "BLACK STUDIO", category: "PANTS", price: 79000, discount: 18, image: "images/1517438476312-10d79c077509.jpg", sizes: ["28", "30", "32", "34", "36"], stock: { 28: 4, 30: 4, 32: 2, 34: 1, 36: 0 }, rating: 4.6, isBest: false, isNew: false, createdAt: 20260418, collections: ["Sneaker Utility"] },
  { id: 18, name: "로우 프로파일 스니커즈", brand: "STUDIO LOW", category: "SHOES", price: 112000, discount: 13, image: "images/1607522370275-f14206abe5d3.jpg", sizes: ["240", "250", "260", "270", "280"], stock: { 240: 2, 250: 6, 260: 7, 270: 3, 280: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260513, collections: ["Sneaker Utility"] }
  ,
  { id: 19, name: "에센셜 와플 크롭 반팔티_5color", brand: "BLACK FIT", category: "TOP", price: 39000, discount: 12, image: "images/products/essential-waffle-crop-tee-product.png", hoverImage: "images/products/essential-waffle-crop-tee-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 8, M: 12, L: 9, XL: 4 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260529, collections: ["Minimal Black Edit", "Summer Layering"], colors: ["#303239", "#2f2f2d", "#f2f2ef", "#9b9b98", "#111111"] }
];

baseProducts.splice(0, baseProducts.length,
  { id: 1, name: "에센셜 와플 크롭 반팔티_5color", brand: "BLACK FIT", category: "TOP", price: 39000, discount: 12, image: "images/products/essential-waffle-crop-tee-product.png", hoverImage: "images/products/essential-waffle-crop-tee-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 8, M: 12, L: 9, XL: 4 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260529, collections: ["Minimal Black Edit", "Summer Layering"], colors: ["#303239", "#2f2f2d", "#f2f2ef", "#9b9b98", "#111111"] },
  { id: 2, name: "SY PUNCHING CAP SLEEVE TEE", brand: "STUDIO LOW", category: "TOP", price: 42000, discount: 10, image: "images/products/SY PUNCHING CAP SLEEVE TEE.png", hoverImage: "images/products/SY PUNCHING CAP SLEEVE TEE-model.png", sizes: ["S", "M", "L"], stock: { S: 6, M: 10, L: 5 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260528, collections: ["Summer Layering"] },
  { id: 3, name: "VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR", brand: "VOID ARCHIVE", category: "TOP", price: 36000, discount: 8, image: "images/products/VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR.png", hoverImage: "images/products/VLAD 빈티지 ARCH 링거 티셔츠_2 COLOR-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 5, M: 11, L: 8, XL: 3 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260527, collections: ["Minimal Black Edit"] },
  { id: 4, name: "워셔블 데일리 반팔 니트_8color", brand: "MONO LANE", category: "TOP", price: 49000, discount: 15, image: "images/products/워셔블 데일리 반팔 니트_8color.png", hoverImage: "images/products/워셔블 데일리 반팔 니트_8color-model.png", sizes: ["S", "M", "L"], stock: { S: 7, M: 12, L: 6 }, rating: 4.6, isBest: true, isNew: false, createdAt: 20260520, collections: ["Summer Layering"] },
  { id: 5, name: "유니버스 페인팅 브러쉬 아트웍 피그먼트 오버핏 반팔 티셔츠 5COLOR", brand: "NOIR MUSE", category: "TOP", price: 45000, discount: 13, image: "images/products/유니버스 페인팅 브러쉬 아트웍 피그먼트 오버핏 반팔 티셔츠 5COLOR.png", hoverImage: "images/products/유니버스 페인팅 브러쉬 아트웍 피그먼트 오버핏 반팔 티셔츠 5COLOR-model.png", sizes: ["M", "L", "XL"], stock: { M: 9, L: 6, XL: 3 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260526, collections: ["Minimal Black Edit"] },
  { id: 6, name: "사나 레이스 셔링 탑", brand: "LOW CLASSIC", category: "TOP", price: 58000, discount: 11, image: "images/products/사나 레이스 셔링 탑.png", hoverImage: "images/products/사나 레이스 셔링 탑-model.png", sizes: ["S", "M", "L"], stock: { S: 5, M: 7, L: 3 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260523, collections: ["Summer Layering"] },
  { id: 7, name: "스트라이프 집 트랙탑", brand: "BLACK STUDIO", category: "OUTER", price: 79000, discount: 16, image: "images/products/스트라이프 집 트랙탑.png", hoverImage: "images/products/스트라이프 집 트랙탑-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 3, M: 9, L: 7, XL: 2 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260518, collections: ["Sneaker Utility"] },
  { id: 8, name: "와플 클래식 트랙탑 - 원더화이트", brand: "STUDIO LOW", category: "OUTER", price: 89000, discount: 14, image: "images/products/와플 클래식 트랙탑 - 원더화이트.png", hoverImage: "images/products/와플 클래식 트랙탑 - 원더화이트-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 4, M: 8, L: 6, XL: 2 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260525, collections: ["Summer Layering"] },
  { id: 9, name: "울 헤어리 브로드 스트라이프 가디건", brand: "MONO LANE", category: "OUTER", price: 98000, discount: 18, image: "images/products/울 헤어리 브로드 스트라이프 가디건.png", hoverImage: "images/products/울 헤어리 브로드 스트라이프 가디건-model.png", sizes: ["S", "M", "L"], stock: { S: 4, M: 7, L: 4 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260524, collections: ["Minimal Black Edit"] },
  { id: 10, name: "트윌 재킷-네이비", brand: "VOID ARCHIVE", category: "OUTER", price: 128000, discount: 12, image: "images/products/트윌 재킷-네이비.png", hoverImage: "images/products/트윌 재킷-네이비-model.png", sizes: ["M", "L", "XL"], stock: { M: 5, L: 6, XL: 2 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260516, collections: ["Minimal Black Edit"] },
  { id: 11, name: "BDU 드로우스트링 릴렉스드 팬츠", brand: "NEAT FIELD", category: "PANTS", price: 76000, discount: 18, image: "images/products/BDU 드로우스트링 릴렉스드 팬츠.png", hoverImage: "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png", sizes: ["28", "30", "32", "34"], stock: { 28: 4, 30: 8, 32: 6, 34: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260522, collections: ["Sneaker Utility"] },
  { id: 12, name: "Vintage Scratch Bootcut Jeans", brand: "LOW CLASSIC", category: "PANTS", price: 84000, discount: 10, image: "images/products/Vintage Scratch Bootcut Jeans.png", hoverImage: "images/products/Vintage Scratch Bootcut Jeans-model.png", sizes: ["26", "28", "30", "32"], stock: { 26: 3, 28: 7, 30: 6, 32: 2 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260521, collections: ["Minimal Black Edit"] },
  { id: 13, name: "스트링 밴딩 빈티지 다크 블루 워싱 포켓 카고 와이드 버뮤다 데님 반바지", brand: "BLACK STUDIO", category: "PANTS", price: 69000, discount: 15, image: "images/products/스트링 밴딩 빈티지 다크 블루 워싱 포켓 카고 와이드 버뮤다 데님 반바지.png", hoverImage: "images/products/스트링 밴딩 빈티지 다크 블루 워싱 포켓 카고 와이드 버뮤다 데님 반바지-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 5, M: 10, L: 7, XL: 2 }, rating: 4.6, isBest: true, isNew: false, createdAt: 20260515, collections: ["Sneaker Utility"] },
  { id: 14, name: "시티 테크 카고 숏 팬츠", brand: "URBAN EDGE", category: "PANTS", price: 59000, discount: 9, image: "images/products/시티 테크 카고 숏 팬츠.png", hoverImage: "images/products/시티 테크 카고 숏 팬츠-model.png", sizes: ["S", "M", "L"], stock: { S: 6, M: 9, L: 4 }, rating: 4.5, isBest: false, isNew: true, createdAt: 20260519, collections: ["Summer Layering"] },
  { id: 15, name: "우먼즈 나일론 루치드 롱 스커트", brand: "NOIR MUSE", category: "PANTS", price: 72000, discount: 12, image: "images/products/우먼즈 나일론 루치드 롱 스커트.png", hoverImage: "images/products/우먼즈 나일론 루치드 롱 스커트-model.png", sizes: ["S", "M", "L"], stock: { S: 5, M: 8, L: 3 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260517, collections: ["Summer Layering"] },
  { id: 16, name: "Flipflop 02", brand: "URBAN EDGE", category: "SHOES", price: 39000, discount: 8, image: "images/products/Flipflop 02.png", hoverImage: "images/products/Flipflop 02-model.png", sizes: ["240", "250", "260", "270", "280"], stock: { 240: 4, 250: 7, 260: 8, 270: 5, 280: 2 }, rating: 4.5, isBest: false, isNew: true, createdAt: 20260514, collections: ["Sneaker Utility"] },
  { id: 17, name: "성인 바야밴드 클로그 WTN", brand: "URBAN EDGE", category: "SHOES", price: 69000, discount: 7, image: "images/products/성인 바야밴드 클로그 WTN.png", hoverImage: "images/products/성인 바야밴드 클로그 WTN-model.png", sizes: ["240", "250", "260", "270", "280"], stock: { 240: 2, 250: 5, 260: 6, 270: 3, 280: 2 }, rating: 4.4, isBest: false, isNew: false, createdAt: 20260503, collections: ["Sneaker Utility"] },
  { id: 18, name: "코르테즈 W - 블랙,화이트", brand: "URBAN EDGE", category: "SHOES", price: 109000, discount: 10, image: "images/products/코르테즈 W - 블랙,화이트.png", hoverImage: "images/products/코르테즈 W - 블랙,화이트-model.png", sizes: ["230", "240", "250", "260"], stock: { 230: 3, 240: 6, 250: 4, 260: 2 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260502, collections: ["Sneaker Utility"] },
  { id: 19, name: "화이트라벨 일렉트론 엘티 30 DARK GRAY", brand: "BLACK STUDIO", category: "BAG", price: 118000, discount: 13, image: "images/products/화이트라벨 일렉트론 엘티 30 DARK GRAY.png", hoverImage: "images/products/화이트라벨 일렉트론 엘티 30 DARK GRAY-model.png", sizes: ["FREE"], stock: { FREE: 8 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260526, collections: ["Minimal Black Edit"] },
  { id: 20, name: "몽트 LT 백팩", brand: "VOID ARCHIVE", category: "BAG", price: 98000, discount: 10, image: "images/products/몽트 LT 백팩.png", hoverImage: "images/products/몽트 LT 백팩-model.png", sizes: ["FREE"], stock: { FREE: 9 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260513, collections: ["Summer Layering"] },
  { id: 21, name: "셀리나 리젠나일론 토트 크로스백", brand: "MONO LANE", category: "BAG", price: 86000, discount: 12, image: "images/products/셀리나 리젠나일론 토트 크로스백.png", hoverImage: "images/products/셀리나 리젠나일론 토트 크로스백-model.png", sizes: ["FREE"], stock: { FREE: 11 }, rating: 4.7, isBest: true, isNew: false, createdAt: 20260510, collections: ["Summer Layering"] },
  { id: 22, name: "2way beads string necklace", brand: "NOIR MUSE", category: "ACC", price: 36000, discount: 5, image: "images/products/2way beads string necklace.png", hoverImage: "images/products/2way beads string necklace-model.png", sizes: ["FREE"], stock: { FREE: 14 }, rating: 4.5, isBest: false, isNew: true, createdAt: 20260512, collections: ["Minimal Black Edit"] },
  { id: 23, name: "RACING PHENOMENON CAP", brand: "VOID ARCHIVE", category: "ACC", price: 42000, discount: 6, image: "images/products/RACING PHENOMENON CAP.png", hoverImage: "images/products/RACING PHENOMENON CAP-model.png", sizes: ["FREE"], stock: { FREE: 12 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260511, collections: ["Sneaker Utility"] },
  { id: 24, name: "WAYFARER 선글라스 - 매트 블랙", brand: "NOIR MUSE", category: "ACC", price: 59000, discount: 9, image: "images/products/WAYFARER 선글라스 - 매트 블랙.png", hoverImage: "images/products/WAYFARER 선글라스 - 매트 블랙-model.png", sizes: ["FREE"], stock: { FREE: 10 }, rating: 4.7, isBest: true, isNew: false, createdAt: 20260508, collections: ["Minimal Black Edit"] },
  { id: 25, name: "프리부르 남성 메탈 워치", brand: "BLACK STUDIO", category: "ACC", price: 149000, discount: 18, image: "images/products/프리부르 남성 메탈 워치.png", hoverImage: "images/products/프리부르 남성 메탈 워치-model.png", sizes: ["FREE"], stock: { FREE: 6 }, rating: 4.8, isBest: true, isNew: false, createdAt: 20260506, collections: ["Minimal Black Edit"] },
  { id: 26, name: "[가나디] 반팔 티셔츠", brand: "MONO LANE", category: "TOP", price: 39000, discount: 10, image: "images/products/[가나디] 반팔 티셔츠.png", hoverImage: "images/products/[가나디] 반팔 티셔츠-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 6, M: 10, L: 7, XL: 3 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260530, collections: ["Summer Layering"] },
  { id: 27, name: "AKM Horse Half Top", brand: "NOIR MUSE", category: "TOP", price: 52000, discount: 12, image: "images/products/AKM Horse Half Top.png", hoverImage: "images/products/AKM Horse Half Top-model.png", sizes: ["S", "M", "L"], stock: { S: 5, M: 8, L: 4 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 28, name: "텐셀 린넨 크롭 하프 셔츠", brand: "LOW CLASSIC", category: "TOP", price: 69000, discount: 15, image: "images/products/텐셀 린넨 크롭 하프 셔츠.png", hoverImage: "images/products/텐셀 린넨 크롭 하프 셔츠-model.png", sizes: ["S", "M", "L"], stock: { S: 4, M: 9, L: 5 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260530, collections: ["Summer Layering"] },
  { id: 29, name: "DGMA PATCHED SEMI BAGGY DENIM PANTS", brand: "BLACK STUDIO", category: "PANTS", price: 96000, discount: 14, image: "images/products/DGMA PATCHED SEMI BAGGY DENIM PANTS.png", hoverImage: "images/products/DGMA PATCHED SEMI BAGGY DENIM PANTS-model.png", sizes: ["28", "30", "32", "34"], stock: { 28: 3, 30: 7, 32: 5, 34: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260530, collections: ["Sneaker Utility"] },
  { id: 30, name: "VLAD 원턱 커브드 트랙 팬츠_립스탑", brand: "VOID ARCHIVE", category: "PANTS", price: 82000, discount: 11, image: "images/products/VLAD 원턱 커브드 트랙 팬츠_립스탑.png", hoverImage: "images/products/VLAD 원턱 커브드 트랙 팬츠_립스탑-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 4, M: 8, L: 6, XL: 2 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260530, collections: ["Sneaker Utility"] },
  { id: 31, name: "릴렉스 부츠컷 데님", brand: "NEAT FIELD", category: "PANTS", price: 79000, discount: 10, image: "images/products/릴렉스 부츠컷 데님.png", hoverImage: "images/products/릴렉스 부츠컷 데님-model.png", sizes: ["26", "28", "30", "32"], stock: { 26: 3, 28: 6, 30: 5, 32: 2 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 32, name: "에든 슬랍 세미 와이드 데님 팬츠", brand: "NEAT FIELD", category: "PANTS", price: 86000, discount: 13, image: "images/products/에든 슬랍 세미 와이드 데님 팬츠.png", hoverImage: "images/products/에든 슬랍 세미 와이드 데님 팬츠-model.png", sizes: ["28", "30", "32", "34"], stock: { 28: 4, 30: 7, 32: 4, 34: 2 }, rating: 4.7, isBest: true, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 33, name: "원턱 스웻 하프 팬츠", brand: "STUDIO LOW", category: "PANTS", price: 56000, discount: 9, image: "images/products/원턱 스웻 하프 팬츠.png", hoverImage: "images/products/원턱 스웻 하프 팬츠-model.png", sizes: ["S", "M", "L", "XL"], stock: { S: 5, M: 9, L: 7, XL: 3 }, rating: 4.5, isBest: false, isNew: true, createdAt: 20260530, collections: ["Summer Layering"] },
  { id: 34, name: "커브드 생지 데님 팬츠", brand: "BLACK STUDIO", category: "PANTS", price: 92000, discount: 12, image: "images/products/커브드 생지 데님 팬츠.png", hoverImage: "images/products/커브드 생지 데님 팬츠-model.png", sizes: ["28", "30", "32", "34"], stock: { 28: 3, 30: 7, 32: 6, 34: 2 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 35, name: "헤링본 코튼 버뮤다 쇼츠", brand: "MONO LANE", category: "PANTS", price: 64000, discount: 10, image: "images/products/헤링본 코튼 버뮤다 쇼츠.png", hoverImage: "images/products/헤링본 코튼 버뮤다 쇼츠-model.png", sizes: ["S", "M", "L"], stock: { S: 5, M: 9, L: 5 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260530, collections: ["Summer Layering"] },
  { id: 36, name: "뉴발란스 U740", brand: "URBAN EDGE", category: "SHOES", price: 129000, discount: 7, image: "images/products/뉴발란스 U740.png", hoverImage: "images/products/뉴발란스 U740-model.png", sizes: ["240", "250", "260", "270", "280"], stock: { 240: 3, 250: 6, 260: 7, 270: 4, 280: 2 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260530, collections: ["Sneaker Utility"] },
  { id: 37, name: "우먼즈 나일론 슬라우치 숄더백", brand: "LOW CLASSIC", category: "BAG", price: 78000, discount: 12, image: "images/products/우먼즈 나일론 슬라우치 숄더백.png", hoverImage: "images/products/우먼즈 나일론 슬라우치 숄더백-model.png", sizes: ["FREE"], stock: { FREE: 9 }, rating: 4.7, isBest: false, isNew: true, createdAt: 20260530, collections: ["Summer Layering"] },
  { id: 38, name: "이클립스 라이트팩", brand: "VOID ARCHIVE", category: "BAG", price: 89000, discount: 11, image: "images/products/이클립스 라이트팩.png", hoverImage: "images/products/이클립스 라이트팩-model.png", sizes: ["FREE"], stock: { FREE: 8 }, rating: 4.8, isBest: true, isNew: true, createdAt: 20260530, collections: ["Sneaker Utility"] },
  { id: 39, name: "[진격의거인] AOT SURVEY CORPS NECKLACE SILVER", brand: "NOIR MUSE", category: "ACC", price: 49000, discount: 6, image: "images/products/[진격의거인] AOT SURVEY CORPS NECKLACE SILVER.png", hoverImage: "images/products/[진격의거인] AOT SURVEY CORPS NECKLACE SILVER-model.png", sizes: ["FREE"], stock: { FREE: 12 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 40, name: "뉴 LA 볼드 코튼 볼캡", brand: "BLACK STUDIO", category: "ACC", price: 42000, discount: 8, image: "images/products/뉴 LA 볼드 코튼 볼캡.png", hoverImage: "images/products/뉴 LA 볼드 코튼 볼캡-model.png", sizes: ["FREE"], stock: { FREE: 13 }, rating: 4.7, isBest: true, isNew: true, createdAt: 20260530, collections: ["Sneaker Utility"] },
  { id: 41, name: "테라포마 - TITANIUM - PRIZM BLACK POLARIZED", brand: "NOIR MUSE", category: "ACC", price: 189000, discount: 15, image: "images/products/테라포마 - TITANIUM - PRIZM BLACK POLARIZED.png", hoverImage: "images/products/테라포마 - TITANIUM - PRIZM BLACK POLARIZED-model.png", sizes: ["FREE"], stock: { FREE: 5 }, rating: 4.9, isBest: true, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] },
  { id: 42, name: "트로이 웨스턴 레더 벨트", brand: "MONO LANE", category: "ACC", price: 54000, discount: 9, image: "images/products/트로이 웨스턴 레더 벨트.png", hoverImage: "images/products/트로이 웨스턴 레더 벨트-model.png", sizes: ["FREE"], stock: { FREE: 10 }, rating: 4.6, isBest: false, isNew: true, createdAt: 20260530, collections: ["Minimal Black Edit"] }
);

const brandStories = [
  { name: "MONO LANE", title: "Quiet Essential", image: "images/products/워셔블 데일리 반팔 니트_8color-model.png", copy: "일상에서 가장 자주 입는 기본 아이템을 간결한 실루엣으로 제안합니다." },
  { name: "STUDIO LOW", title: "Soft Utility", image: "images/products/와플 클래식 트랙탑 - 원더화이트-model.png", copy: "편안한 소재와 낮은 채도의 컬러로 오래 입는 데일리웨어를 만듭니다." },
  { name: "VOID ARCHIVE", title: "Urban Outerwear", image: "images/products/트윌 재킷-네이비-model.png", copy: "도시적인 레이어링에 어울리는 아우터와 테크 소재를 중심으로 전개합니다." },
  { name: "NEAT FIELD", title: "Tailored Casual", image: "images/products/BDU 드로우스트링 릴렉스드 팬츠-model.png", copy: "팬츠와 셋업 중심의 단정한 캐주얼을 큐레이션합니다." }
];

const defaultReviews = {
  1: [{ user: "min***", rating: 5, text: "핏이 여유롭고 소재가 가벼워서 계절 넘어갈 때 입기 좋습니다." }],
  3: [{ user: "jay***", rating: 5, text: "슬랙스 실루엣이 깔끔하고 신발 매치가 쉽습니다." }],
  9: [{ user: "seo***", rating: 5, text: "사진보다 실물이 더 트렌디하고 착화감도 안정적입니다." }]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const deliveryFee = 3000;
const orderStatuses = ["결제완료", "배송준비", "배송중", "배송완료"];
const categories = ["ALL", "OUTER", "TOP", "PANTS", "SHOES", "BAG", "ACC"];
let toastTimer;

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function withStock(product) {
  const base = baseProducts.find((item) => item.id === product.id) || {};
  const sizes = product.sizes || base.sizes || ["FREE"];
  const stock = product.stock || {};
  sizes.forEach((size, index) => {
    if (stock[size] === undefined) stock[size] = Math.max(1, 8 - index * 2);
  });
  return { ...base, ...product, sizes, stock, collections: product.collections || base.collections || [] };
}

let products = readStorage("blackFitProducts", null);
if (!Array.isArray(products) || products.length < baseProducts.length || products.some((product) => String(product.name || "").includes("?"))) {
  products = [...baseProducts];
  save("blackFitProducts", products);
}
products = products.map(withStock);

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
  recentSearches: readStorage("blackFitRecentSearches", []),
  wishes: new Set(readStorage("blackFitWishes", [])),
  cart: readStorage("blackFitCart", []),
  recent: readStorage("blackFitRecent", []),
  orders: readStorage("blackFitOrders", []),
  reviews: readStorage("blackFitReviews", defaultReviews),
  user: readStorage("blackFitUser", null),
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
  return state.reviews[productId] || [];
}

function averageRating(product) {
  const reviews = productReviews(product.id);
  if (!reviews.length) return product.rating;
  const sum = reviews.reduce((total, review) => total + Number(review.rating || 0), product.rating);
  return sum / (reviews.length + 1);
}

function productColors(product) {
  if (Array.isArray(product.colors) && product.colors.length) return product.colors;
  const palettes = {
    OUTER: ["#111111", "#77716b", "#e8e2d8"],
    TOP: ["#ffffff", "#111111", "#bfc4c9"],
    PANTS: ["#111111", "#d7d1c8", "#5d6470"],
    SHOES: ["#f7f7f7", "#111111", "#8f969c"],
    BAG: ["#111111", "#c8b79f", "#ece8df"],
    ACC: ["#111111", "#d9d9d9", "#2d6bff"]
  };
  return palettes[product.category] || ["#111111", "#ffffff", "#999999"];
}

function productCardOptions(product) {
  const colors = productColors(product).map((color) => `<i style="--swatch:${color}" aria-hidden="true"></i>`).join("");
  const sizes = product.sizes.slice(0, 4).map((size) => `<span>${size}</span>`).join("");
  return `<div class="card-options"><div class="color-swatches">${colors}</div><div class="size-preview">${sizes}</div></div>`;
}

function productSpecGrid(product) {
  return `
    <div class="spec-grid">
      <div><span>FIT</span><strong>${product.category === "PANTS" ? "Straight" : product.category === "OUTER" ? "Relaxed" : "Regular"}</strong></div>
      <div><span>FABRIC</span><strong>${product.category === "SHOES" ? "Leather Mix" : "Cotton Blend"}</strong></div>
      <div><span>CARE</span><strong>Dry Clean</strong></div>
      <div><span>MODEL</span><strong>178cm / M</strong></div>
    </div>
  `;
}

function productCard(product, rank = "") {
  const wished = state.wishes.has(product.id);
  return `
    <article class="product-card" data-id="${product.id}">
      <button class="product-image" type="button" data-open-product="${product.id}">
        ${rank ? `<span class="rank-badge">${rank}</span>` : ""}
        ${product.isNew ? `<span class="label-badge">NEW</span>` : ""}
        <img class="product-main-img" src="${product.image}" alt="${product.brand} ${product.name}" loading="lazy">
        ${product.hoverImage ? `<img class="product-hover-img" src="${product.hoverImage}" alt="${product.name} 모델 착용 이미지" loading="lazy">` : ""}
        <span class="quick-view">Quick View</span>
      </button>
      <button class="wish-button ${wished ? "active" : ""}" type="button" data-wish="${product.id}" aria-label="찜하기">${wished ? "♥" : "♡"}</button>
      <button class="product-info" type="button" data-open-product="${product.id}">
        <span class="category-name">${product.category}</span>
        <p class="brand-name">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
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
}

function renderBrands() {
  els.brandCards.innerHTML = brandStories.map((brand) => {
    const count = products.filter((product) => product.brand === brand.name).length;
    return `
      <article class="brand-card" data-brand-filter="${brand.name}">
        <img src="${brand.image}" alt="${brand.name}">
        <div><span>${count} items</span><h3>${brand.name}</h3><strong>${brand.title}</strong><p>${brand.copy}</p></div>
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
    ${recent.length ? `<div class="assist-block"><div class="assist-title"><span>최근 검색어</span><button type="button" data-search-clear>전체 삭제</button></div>${recent.map((item) => `<div class="assist-row"><button type="button" data-search-pick="${item}">${item}</button><button class="assist-remove" type="button" data-search-remove="${item}" aria-label="${item} 삭제">×</button></div>`).join("")}</div>` : ""}
    ${brands.length ? `<div class="assist-block"><span>브랜드 추천</span>${brands.map((brand) => `<button type="button" data-search-pick="${brand}">${brand}</button>`).join("")}</div>` : ""}
    ${productMatches.length ? `<div class="assist-block"><span>상품 추천</span>${productMatches.map((product) => `<button type="button" data-search-pick="${product.name}"><strong>${product.brand}</strong>${product.name}</button>`).join("")}</div>` : ""}
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
      <img src="${p.image}" alt="${p.name}">
      <div><strong>${p.name}</strong><p>${p.brand} · ${formatPrice(getSalePrice(p))}</p><button data-open-product="${p.id}" type="button">보기</button></div>
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
  const shipping = subtotal && !coupon.shippingFree ? deliveryFee : 0;
  return { subtotal, discount: coupon.discount, shipping, total: Math.max(0, subtotal - coupon.discount + shipping), coupon };
}

function getCartStock(item) {
  const product = products.find((p) => p.id === item.id);
  return product?.stock?.[item.size] ?? 99;
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const { subtotal, discount, shipping, total, coupon } = cartTotal();
  els.cartCount.textContent = count;
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
      <img src="${item.image}" alt="${item.name}">
      <div><strong>${item.name}</strong><p>Size ${item.size} · 재고 ${getCartStock(item)}개</p><b>${formatPrice(item.price * item.quantity)}</b>
        <div class="cart-controls"><button class="qty-button" data-cart-qty="minus" data-key="${item.key}">-</button><span>${item.quantity}</span><button class="qty-button" data-cart-qty="plus" data-key="${item.key}">+</button></div>
      </div>
      <button class="remove-button" data-remove="${item.key}">삭제</button>
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
    .slice(0, 3);
  if (!list.length) {
    els.cartRecommend.innerHTML = "";
    return;
  }
  els.cartRecommend.innerHTML = `
    <div class="panel-subtitle">Recommended</div>
    <div class="recommend-list">
      ${list.map((product) => `
        <button class="recommend-item" type="button" data-open-product="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <span><strong>${product.name}</strong><em>${product.brand} · ${formatPrice(getSalePrice(product))}</em></span>
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
      <div class="order-top"><strong>${order.orderNumber}</strong><span>${order.status || "결제완료"}</span></div>
      ${timelineMarkup(order.status)}
      <p>${order.createdAt || "-"} · ${order.items.length}개 상품</p>
      <ul>${order.items.slice(0, 3).map((item) => `<li>${item.name} / ${item.size} / ${item.quantity}개</li>`).join("")}</ul>
      <b>${formatPrice(order.total)}</b>
      <button class="ghost-btn full" type="button" data-order-detail="${order.orderNumber}">주문 상세 보기</button>
    </article>
  `).join("") : `<div class="cart-empty"><div><strong>아직 주문 내역이 없습니다.</strong><p>체크아웃을 완료하면 이곳에 주문이 쌓입니다.</p></div></div>`;

  els.mypageList.innerHTML = `
    <section class="member-card">
      <span>Signed in as</span>
      <strong>${state.user.id}</strong>
      <p>${state.user.role === "admin" ? "관리자 계정" : "일반 회원"} · 누적 주문 ${state.orders.length}건</p>
    </section>
    <div class="member-metrics"><div><strong>${wishCount}</strong><span>Wishlist</span></div><div><strong>${recentCount}</strong><span>Viewed</span></div><div><strong>2</strong><span>Coupons</span></div></div>
    <div class="panel-subtitle">Order History</div>
    ${orderMarkup}
  `;
}

function renderOrderDetail(orderNumber) {
  const order = state.orders.find((item) => item.orderNumber === orderNumber);
  if (!order) return;
  els.orderDetail.innerHTML = `
    <article class="order-detail-card">
      <span>${order.createdAt || "-"}</span>
      <h3>${order.orderNumber}</h3>
      ${timelineMarkup(order.status)}
      <div class="panel-subtitle">Items</div>
      ${order.items.map((item) => `<div class="order-line"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><p>Size ${item.size} · ${item.quantity}개</p></div><b>${formatPrice(item.price * item.quantity)}</b></div>`).join("")}
      <div class="summary-lite"><span>결제 금액</span><strong>${formatPrice(order.total)}</strong></div>
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
        <strong>${order.orderNumber}</strong>
        <p>${order.createdAt || "-"} · ${order.items.length}개 · ${formatPrice(order.total)}</p>
      </div>
      <select data-order-status="${order.orderNumber}">
        ${orderStatuses.map((status) => `<option value="${status}" ${status === (order.status || "결제완료") ? "selected" : ""}>${status}</option>`).join("")}
      </select>
      <button class="order-delete-btn" type="button" data-order-delete="${order.orderNumber}">삭제</button>
    </article>
  `).join("");
}

function openLayer(type) {
  els.overlay.hidden = false;
  document.body.classList.add("lock");
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
}

function closeLayers() {
  [els.modal, els.cartPanel, els.wishlistPanel, els.mypagePanel, els.orderPanel, els.authModal, els.adminPanel, els.checkoutModal].forEach((el) => el.classList.remove("open"));
  resetLoginForm();
  els.overlay.hidden = true;
  document.body.classList.remove("lock");
}

function gallery(product) {
  const map = {
    OUTER: ["images/1543076447-215ad9ba6923.jpg", "images/1551028719-00167b16eac5.jpg"],
    TOP: ["images/1602810318383-e386cc2a3ccf.jpg", "images/1434389677669-e08b4cac3105.jpg"],
    PANTS: ["images/1541099649105-f69ad21f3246.jpg", "images/1594633312681-425c7b97ccd1.jpg"],
    SHOES: ["images/1608231387042-66d1773070a5.jpg", "images/1607522370275-f14206abe5d3.jpg"],
    BAG: ["images/1594223274512-ad4803739b7c.jpg", "images/1622560480605-d83c853bc5c3.jpg"],
    ACC: ["images/1511499767150-a48a237f0083.jpg"]
  };
  return [product.image, product.hoverImage, ...(map[product.category] || [])].filter(Boolean).slice(0, 3);
}

function reviewListMarkup(product) {
  const reviews = productReviews(product.id);
  if (!reviews.length) return `<div class="empty-mini">아직 작성된 리뷰가 없습니다.</div>`;
  return reviews.map((review) => `
    <article class="review-item">
      <div><strong>${review.user}</strong><span>${"★".repeat(Number(review.rating))}${"☆".repeat(5 - Number(review.rating))}</span></div>
      <p>${review.text}</p>
    </article>
  `).join("");
}

function productTabMarkup(product, tab = "detail") {
  const contents = {
    detail: `<div class="tab-panel"><strong>상품 설명</strong><p>도시적인 무드에 맞춘 BLACK FIT 큐레이션 아이템입니다. 군더더기 없는 실루엣과 실용적인 소재로 데일리 스타일에 자연스럽게 어울립니다.</p></div>`,
    size: `<div class="tab-panel"><strong>사이즈 가이드</strong><p>상세 실측은 브랜드 기준에 따라 1~2cm 차이가 있을 수 있습니다. 여유로운 핏을 원하면 한 사이즈 업을 추천합니다.</p><div class="size-table">${product.sizes.map((size) => `<span>${size}</span>`).join("")}</div></div>`,
    review: `<div class="tab-panel"><strong>리뷰 ${productReviews(product.id).length}개</strong>${reviewListMarkup(product)}<form class="review-form" data-review-form="${product.id}"><select name="rating"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option></select><input name="text" placeholder="리뷰를 입력하세요" required><button class="primary-btn" type="submit">작성</button></form></div>`,
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
      <div class="modal-image"><img id="modalMainImage" src="${images[0]}" alt="${product.name}"></div>
      <div class="modal-thumbs">${images.map((image, i) => `<button class="${i === 0 ? "active" : ""}" data-gallery-image="${image}"><img src="${image}" alt=""></button>`).join("")}</div>
    </div>
    <div class="modal-detail">
      <p class="brand-name">${product.brand}</p>
      <h2>${product.name}</h2>
      <div class="rating">★ ${averageRating(product).toFixed(1)} · 리뷰 ${productReviews(product.id).length}개 · ${stockText(product)}</div>
      <div class="modal-price"><span class="discount">${product.discount}%</span> <strong>${formatPrice(getSalePrice(product))}</strong></div>
      ${productSpecGrid(product)}
      <div class="purchase-box">
        <p><strong>Size</strong></p>
        <div class="size-options">
          ${product.sizes.map((size) => {
            const left = Number(product.stock?.[size] || 0);
            return `<button class="size-button" data-size="${size}" data-left="${left}" ${left <= 0 ? "disabled" : ""}>${size}<small>${left <= 0 ? "품절" : `${left}개`}</small></button>`;
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
  const stock = Number(product.stock?.[size] || 0);
  if (!stock) return showToast("선택한 사이즈는 품절입니다.");
  const key = `${product.id}-${size}`;
  const found = state.cart.find((item) => item.key === key);
  const currentQty = found ? found.quantity : 0;
  if (currentQty + quantity > stock) return showToast(`재고는 ${stock}개까지 담을 수 있습니다.`);
  if (found) found.quantity += quantity;
  else state.cart.push({ key, id: product.id, name: product.name, brand: product.brand, image: product.image, price: getSalePrice(product), size, quantity });
  save("blackFitCart", state.cart);
  renderCart();
  showToast("장바구니에 상품을 담았습니다.");
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
      <img src="${p.image}" alt="${p.name}">
      <div><strong>${p.name}</strong><p>${p.brand} · ${p.category} · ${formatPrice(getSalePrice(p))} · 재고 ${totalStock(p)}개</p></div>
      <button data-admin-edit="${p.id}">수정</button>
      <button data-admin-delete="${p.id}">삭제</button>
    </article>
  `).join("");
  renderAdminOrders();
}

function stockToInput(stock = {}) {
  return Object.entries(stock).map(([size, count]) => `${size}:${count}`).join(",");
}

function parseStock(value, sizes) {
  const entries = value.split(",").map((item) => item.trim()).filter(Boolean);
  const stock = {};
  entries.forEach((entry) => {
    const [size, count] = entry.split(":").map((part) => part.trim());
    if (size) stock[size] = Math.max(0, Number(count || 0));
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
  $("#adminSizes").value = product.sizes.join(",");
  $("#adminStock").value = stockToInput(product.stock);
  $("#adminBest").checked = product.isBest;
  $("#adminNew").checked = product.isNew;
}

function refresh() {
  products = products.map(withStock);
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
  els.menuToggle.addEventListener("click", () => els.nav.classList.toggle("open"));
  els.moreToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    els.moreDropdown.classList.toggle("open");
  });
  els.searchFocus.addEventListener("click", () => { $("#products").scrollIntoView({ behavior: "smooth" }); els.searchInput.focus(); });
  $$(".nav-link").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.scrollTarget) {
      $(`#${button.dataset.scrollTarget}`).scrollIntoView({ behavior: "smooth" });
      els.nav.classList.remove("open");
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
      addToCart(state.activeProduct, state.selectedSize, state.selectedQty);
      if (event.target.closest("#buyButton")) {
        closeLayers();
        openLayer("cart");
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
    if (!review.text) return;
    state.reviews[productId] = [review, ...(state.reviews[productId] || [])];
    save("blackFitReviews", state.reviews);
    renderProductTabs("review");
    renderProducts();
    renderHome();
    showToast("리뷰가 등록되었습니다.");
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
      localStorage.removeItem("blackFitCoupon");
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
    closeLayers();
    els.checkoutTotal.textContent = formatPrice(cartTotal().total);
    els.checkoutForm.hidden = false;
    els.orderComplete.hidden = true;
    openLayer("checkout");
  });
  els.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const orderNumber = `BF-${Date.now().toString().slice(-8)}`;
    const orderedItems = state.cart.map((item) => ({ ...item }));
    orderedItems.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product?.stock?.[item.size] !== undefined) product.stock[item.size] = Math.max(0, product.stock[item.size] - item.quantity);
    });
    const total = cartTotal();
    state.orders.unshift({
      orderNumber,
      items: orderedItems,
      subtotal: total.subtotal,
      discount: total.discount,
      shipping: total.shipping,
      coupon: state.coupon,
      total: total.total,
      status: "결제완료",
      createdAt: new Date().toLocaleString("ko-KR")
    });
    save("blackFitOrders", state.orders);
    save("blackFitProducts", products);
    state.cart = [];
    state.coupon = null;
    save("blackFitCart", state.cart);
    localStorage.removeItem("blackFitCoupon");
    renderCart();
    renderAdminOrders();
    els.checkoutForm.reset();
    els.checkoutForm.hidden = true;
    els.orderComplete.hidden = false;
    els.orderNumberText.textContent = `주문번호 ${orderNumber}`;
  });
  els.loginOpen.addEventListener("click", () => {
    if (state.user) {
      state.user = null;
      localStorage.removeItem("blackFitUser");
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
    const sizes = $("#adminSizes").value.split(",").map((size) => size.trim()).filter(Boolean);
    const product = {
      id: Number($("#adminProductId").value) || Date.now(),
      name: $("#adminName").value.trim(),
      brand: $("#adminBrand").value.trim(),
      category: $("#adminCategory").value,
      price: Number($("#adminPrice").value),
      discount: Number($("#adminDiscount").value),
      image: $("#adminImage").value.trim(),
      sizes,
      stock: parseStock($("#adminStock").value, sizes),
      collections: [],
      rating: 4.5,
      isBest: $("#adminBest").checked,
      isNew: $("#adminNew").checked,
      createdAt: Number(new Date().toISOString().slice(0, 10).replaceAll("-", ""))
    };
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
    state.orders = state.orders.filter((order) => order.orderNumber !== remove.dataset.orderDelete);
    save("blackFitOrders", state.orders);
    renderAdminOrders();
    renderMyPage();
    showToast("주문이 삭제되었습니다.");
  });
  els.adminResetForm.addEventListener("click", resetAdminForm);
  els.adminResetProducts.addEventListener("click", () => {
    products = [...baseProducts];
    save("blackFitProducts", products);
    refresh();
    resetAdminForm();
  });
  els.recentClear.addEventListener("click", () => { state.recent = []; save("blackFitRecent", state.recent); renderRecent(); });
  els.backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $(".newsletter")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("뉴스레터 신청이 완료되었습니다.");
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
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeLayers(); });
}

function initReveal() {
  const targets = $$("section, .product-card, .brand-card, .campaign-grid article, .site-footer");
  targets.forEach((target) => target.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

function init() {
  renderHome();
  renderFilters();
  renderProducts();
  renderCart();
  renderWishlist();
  renderRecent();
  renderLogin();
  renderMyPage();
  renderAdmin();
  bind();
  initReveal();
}

init();

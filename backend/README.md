# BLACK FIT Python Backend

포트폴리오용 FastAPI API입니다. 실제 결제·배송은 진행되지 않습니다. 정적 프론트엔드의 localStorage 기능은 이 API와 자동 연결되지 않습니다.

## 실행

```powershell
cd "C:\Users\DYU\Desktop\종안\포폴모음\쇼핑몰"
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

- 화면: http://127.0.0.1:8000/index.html
- API 문서: http://127.0.0.1:8000/docs
- 상태: http://127.0.0.1:8000/api/health

## 관리자 설정

관리자 API는 `ADMIN_PASSWORD`가 없으면 비활성화됩니다. 기존 프론트엔드 UI의 `admin/admin` 데모 계정과 별개입니다.

- `ADMIN_USER`: 관리자 아이디, 기본값 `admin`
- `ADMIN_PASSWORD`: 충분히 긴 관리자 비밀번호, 공개 저장소에 기록하지 않습니다.
- `ADMIN_TOKEN`: 선택 사항. 미설정 시 시작할 때 임의 토큰을 생성합니다. 여러 워커에서는 공통 토큰을 환경 변수로 지정합니다.
- 로그인 응답의 토큰은 관리자 요청의 `X-Admin-Token` 헤더로 전달합니다.
- `ALLOWED_ORIGINS`: 다른 출처의 프론트엔드를 연결할 때 정확한 HTTPS 출처를 쉼표로 구분합니다. 기본값은 별도 CORS 허용 없음입니다.
- `RATELIMIT_STORAGE_URI`: 선택 공유 저장소. 기본 메모리는 워커별 제한이며 Redis 사용 시 관련 패키지 추가가 필요합니다.

일반 로그인은 회원 인증이 아닌 데모 응답이며, 회원용 접근 권한을 제공하지 않습니다.

## API

- `GET /api/products`: 상품 조회·필터
- `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`: 관리자 상품 관리
- `POST /api/orders`: 모의 주문 생성
- `GET /api/orders`, `PATCH /api/orders/{number}`, `DELETE /api/orders/{number}`: 관리자 주문 관리
- `POST /api/contact`: 데모 문의 저장
- `POST /api/newsletter`: 이메일 형식 확인 후 중복 없이 저장

주문 요청은 `customer: {name, phone, address}`, `items: [{id, size, quantity}]`, 선택적 `coupon` 및 `memo`를 받습니다. 상품명·가격·소계·배송비·할인·총액은 서버가 계산합니다. 중복 상품/옵션 수량을 합산해 재고를 검사하고 저장과 재고 차감을 같은 잠금 안에서 처리합니다. 무료배송 기준은 쿠폰 차감 전 상품 금액 5만원입니다.

## 저장 및 제한

기본 상품은 공통 `catalog.json`에서 읽고 서버 데이터는 `backend/data/store.json`에 저장합니다. 브라우저 데이터와 별개입니다. 파일 잠금과 임시 파일 교체를 사용하며 손상된 JSON을 자동 초기화하지 않습니다. 기존 데이터의 첫 ID 업그레이드 전에 `store.before-upgrade.json` 백업을 생성합니다. JSON·잠금·백업은 Git 대상에서 제외됩니다.

정적 제공은 공개 파일 목록과 `images/`로 제한합니다. 요청 크기는 64KiB, 기본 API 제한은 120회/분, 로그인·문의·구독은 각 5회/분, 모의 주문은 10회/분, 관리자 변경은 각 30회/분입니다. 메모리 제한은 프로세스별이므로 배포 시 공유 저장소·프록시 설정이 필요합니다.

이 API는 공개 데모의 보조 방어입니다. 실제 서비스에는 인증·권한·결제·영속 DB·개인정보 보호 설계가 추가로 필요합니다.

이번 변경에서는 빌드·자동 테스트·배포 환경 동작 검증을 실행하지 않았습니다.


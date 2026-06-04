# BLACK FIT Python Backend

BLACK FIT 포트폴리오 쇼핑몰에 붙일 수 있는 Python FastAPI 백엔드입니다. 상품, 주문, 로그인, 문의, 뉴스레터 API를 제공합니다.

## 실행 방법

```powershell
cd "C:\Users\i5E-\Desktop\쇼핑몰"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.app:app --reload --port 8000
```

실행 후 아래 주소로 접속합니다.

- 프론트엔드: http://127.0.0.1:8000/index.html
- API 문서: http://127.0.0.1:8000/docs
- 상태 확인: http://127.0.0.1:8000/api/health

## 관리자 계정

- 아이디: `admin`
- 비밀번호: `admin`

로그인 API에서 받은 `token`을 관리자 API 요청의 `X-Admin-Token` 헤더로 보내면 상품/주문 관리 API를 사용할 수 있습니다.

## 주요 API

- `GET /api/products`: 상품 목록 조회
- `POST /api/products`: 상품 추가
- `PUT /api/products/{product_id}`: 상품 수정
- `DELETE /api/products/{product_id}`: 상품 삭제
- `POST /api/orders`: 주문 생성
- `GET /api/orders`: 주문 목록 조회
- `PATCH /api/orders/{order_number}`: 주문 상태 변경
- `DELETE /api/orders/{order_number}`: 주문 삭제
- `POST /api/contact`: 문의 저장
- `POST /api/newsletter`: 뉴스레터 구독 저장

# 알라딘 OpenAPI 연동 설계 및 상세 설명서

이 문서는 알라딘 도서 OpenAPI를 프로젝트(Next.js + Express + Prisma + Redis 환경)에 연동하는 각 과정에 대한 상세 설명을 담고 있습니다.

## 1단계 - 공통 타입 정의 (`types/aladin.ts`)

**파일 위치:** `types/aladin.ts`

### 주요 정의
1. **`AladinQueryType`**: 상품 리스트에서 사용하는 검색 타입(Bestseller, ItemNewAll, ItemNewSpecial)을 리터럴 타입으로 한정합니다.
2. **`AladinBook`**: 알라딘 OpenAPI에서 넘어오는 책 하나의 객체를 매핑합니다. 도서 상세(ItemLookUp.aspx) 정보 조회시 전달되는 `subInfo`의 `packing`, `ratingInfo`, `bestSellerRank` 항목을 옵셔널로 선언하여 범용적으로 사용할 수 있게 설계했습니다.
3. **`AladinBaseResponse`**: 알라딘 API의 JSON 응답 포맷(버전, 쿼리, 페이지 등 기본 정보)을 추상화하여 공통 속성을 분리했습니다.
4. **`AladinListResponse`, `AladinSearchResponse`**: `AladinBaseResponse`를 상속받고 내부에 반환되는 `item` 배열의 타입을 `AladinBook[]`으로 선언하여 타입 단언에 활용하도록 했습니다.
5. **`BookListResponse`**: 프론트엔드와 백엔드 서비스(Express) 사이에서 일관되게 사용할 자체적인 페이지네이션 응답 규격으로 구성했습니다.

### 환경 변수 설정
최상단 루트 폴더에 `.env.example` 파일을 추가하여 `ALADIN_TTB_KEY` 발급 및 설정 방법을 정의하였습니다. 
백엔드(Express) 기동 전, 발급된 TTBKey를 `.env` 파일에 복사/설정해야합니다.

## 2단계 - 백엔드 서비스 구현 (`AladinApiService`, Redis 캐싱)

**파일 위치:**
- `backend/src/services/aladin.service.ts`
- `backend/src/utils/redis.ts`

### 주요 구현 내용
1. **Redis 설정 및 초기화**: `createClient`를 사용해 레디스 커넥션을 맺고 애플리케이션 시작시 연결되도록 구성했습니다.
2. **API 통신 캡슐화**: `AladinApiService` 클래스는 `axios`를 통해 OpenAPI(`ItemList`, `ItemSearch`, `ItemLookUp`)를 호출하는 로직을 통합 관리합니다. 환경변수 `ALADIN_TTB_KEY` 참조를 강제하여 보안을 유지합니다.
3. **스마트한 캐싱 레이어 도입 (`fetchWithCache`)**:
   - `crypto` 모듈을 통한 `params_hash` 해싱으로, 파라미터 순서와 상관없이 동일 조건에 대한 고유한 Redis 키(`aladin:{type}:{params_hash}`)를 자동 생성합니다.
   - Redis 접근 중 오류가 발생하더라도 애플리케이션 장애로 이어지지 않고 **원본 타겟 API 호출로 자연스럽게 Fallback** 되도록 안전한 예외 처리를 구성했습니다.
   - API 응답이 성공이고 자체 오류 코드(`errorCode`)가 없을 경우에만 Redis 캐시로 저장합니다. 
4. **TTL 최적화**: 베스트셀러 및 신간은 3600초(1시간), 도서 검색 결과는 600초(10분), 상품 상세 조회는 86400초(24시간)로 요구사항을 완벽히 매핑했습니다.

## 3단계 - Express 라우터 (`/api/books`) 및 컨트롤러 구현

**파일 위치:**
- `backend/src/controllers/book.controller.ts`
- `backend/src/routes/book.routes.ts`

### 주요 구현 내용
1. **API 엔드포인트 세분화**: 요구사항에 따라 베스트셀러(`/bestseller`), 신간(`/new`), 검색(`/search`), 상세(`/:isbn`) 총 4개의 라우트를 정의했습니다. 라우트 충돌을 방지하기 위해 `/:isbn`은 최하단에 배치했습니다.
2. **응답 포맷 표준화 (`BookListResponse`)**: 알라딘 API 원본(`AladinListResponse/AladinSearchResponse`) 대신, 클라이언트에서 쉽게 목록을 그릴 수 있는 범용 포맷(`{ books, total, page, limit }`)으로 데이터를 가공 후 내려줍니다. 이는 프론트엔드의 React Query 페이지네이션 구현을 돕습니다.
3. **안전한 에러 로우팅 (`next(error)`)**: 서비스 호출 과정에서 알라딘 API 한도초과(Limit Exceeded)나 Redis 장애, 네트워크 에러가 발생하면 `try-catch`를 통해 Express의 글로벌 `errorHandler` 미들웨어로 트랜잭션을 넘기게 설계했습니다.

## 4단계 - 프론트엔드 API 클라이언트 및 React Query 훅

**파일 위치:**
- `frontend/src/lib/api/books.ts`
- `frontend/src/hooks/queries/useBooks.ts`
- `frontend/src/hooks/useDebounce.ts`

### 주요 구현 내용
1. **API 클라이언트 (`bookApi`)**: 백엔드(`/api/books`) 엔드포인트와 통신하며, 서버에서 가공한 `BookListResponse` 타입을 명시하여 향후 UI 컴포넌트에서 안전하게 사용할 수 있습니다.
2. **목적별 React Query 커스텀 훅**: `useBestsellers`, `useNewBooks`, `useBookSearch`, `useBookDetail` 등 도메인별 책임이 분리된 훅을 구현했습니다.
3. **staleTime & gcTime 최적화**: 브라우저단에서도 백엔드 Redis TTL 전략에 호응하도록 캐싱 정책을 유지하여 `staleTime`(10분~24시간 차등 적용)과 `gcTime`을 명시, 불필요한 HTTP 커넥션을 줄였습니다.
4. **검색 최적화 (Debounce)**: 타이핑시 매 타수마다 API가 호출되는 현상(서버 Rate limit 초과 위험)을 방어하기 위해 300ms 딜레이를 제공하는 `useDebounce` 훅을 별개로 준비했습니다.

## 5단계 - React 컴포넌트 구현 및 Next.js 설정

**파일 위치:**
- `frontend/src/components/books/BookCard.tsx`
- `frontend/src/components/books/BookList.tsx`
- `frontend/src/components/books/BookSearch.tsx`
- `frontend/next.config.ts`

### 주요 구현 내용
1. **BookCard 컴포넌트**: `next/image`를 사용해 알라딘 표지 이미지를 최적화하여 렌더링하고, 가격 정보 및 알라딘 공식 외부 링크를 제공합니다.
2. **BookList 컴포넌트**: 반응형 그리드 모바일 퍼스트 뷰(`grid-cols`)로 도서 목록을 배치하며, 클라이언트 사이드에서 활용할 수 있는 페이지네이션 바 레이아웃을 제공합니다.
3. **BookSearch 컴포넌트 (실시간 검색)**: `react-hook-form`과 `zod`를 결합해 검색 폼을 제어하고, `useDebounce`를 결합하여 타이핑 즉시 안전하게 실시간 검색 결과 창이 갱신되는 유려한 검색 경험을 완성했습니다.
4. **Next.js 외부 이미지 허용 안전 조치**: 이미지 렌더링 에러 방지를 위해 `next.config.ts` 내 `remotePatterns` 옵션에 알라딘 연동 이미지 서버(`*.aladin.co.kr`)를 정규 등록 완료하였습니다.

---
**이로써 알라딘 OpenAPI 타입 정의(1단계)부터, Redis 캐시가 적용된 백엔드 서비스와 라우터(2, 3단계), 그리고 쾌적한 React Query 기반 프론트엔드 실시간 검색 및 목록 UI 연동(4, 5단계)까지 전체 요구사항 구현이 성공적으로 완료되었습니다.**

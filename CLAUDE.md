# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 개요

독서 클럽 플랫폼: 독서 기록, 모임, 통계를 한 곳에서 관리하는 웹 애플리케이션

**기술 스택:**
- **프론트엔드**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **백엔드**: Express, TypeScript, Prisma ORM
- **데이터베이스**: MySQL 8.0
- **캐시**: Redis
- **실시간**: Socket.IO
- **인증**: JWT

## 개발 환경 설정

### 1. Docker로 데이터베이스 시작

```bash
docker-compose up -d
```

MySQL (포트 3306), Redis (포트 6379)가 실행됩니다.

### 2. 백엔드 설정

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate    # DB 마이그레이션
npm run dev               # 개발 서버 시작 (포트 4000)
```

### 3. 프론트엔드 설정

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev               # 개발 서버 시작 (포트 3000)
```

## 주요 개발 명령어

### 백엔드

```bash
npm run dev                  # 개발 서버 (hot reload)
npm run build               # TypeScript 컴파일
npm run start               # 프로덕션 서버
npm run prisma:generate     # Prisma Client 재생성
npm run prisma:migrate      # DB 마이그레이션
```

### 프론트엔드

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint
```

## 아키텍처 및 핵심 개념

### 백엔드 구조

**계층별 구조:**
- **Controllers** (`backend/src/controllers/`): HTTP 요청 처리, 요청 검증
  - `auth.controller.ts`: 인증 (회원가입, 로그인)
  - `book.controller.ts`: 책 검색 (알라딘 API 연동)
  - `reading.controller.ts`: 독서 기록 관리
  - `club.controller.ts`: 독서 모임 관리

- **Services** (`backend/src/services/`): 비즈니스 로직, DB 쿼리
  - `auth.service.ts`: 인증 로직 (JWT, 비밀번호 해싱)
  - `aladin.service.ts`: 알라딘 API 통신 및 캐싱
  - `book.service.ts`: 책 정보 관리
  - `reading.service.ts`: 독서 기록 비즈니스 로직
  - `club.service.ts`: 모임 관리 로직

- **Routes** (`backend/src/routes/`): API 엔드포인트 정의

- **Middlewares** (`backend/src/middlewares/`):
  - `auth.middleware.ts`: JWT 토큰 검증
  - `error.middleware.ts`: 전역 에러 처리

- **Utils** (`backend/src/utils/`):
  - `aladin-api.ts`: 알라딘 OpenAPI 클라이언트
  - `jwt.ts`: JWT 토큰 생성/검증
  - `prisma.ts`: Prisma 클라이언트
  - `redis.ts`: Redis 캐시

- **Socket** (`backend/src/socket/`):
  - `chat.handler.ts`: Socket.IO 실시간 채팅 처리

**데이터베이스 스키마 (Prisma):**
- `User`: 사용자 정보
- `Book`: 책 정보 (알라딘 API에서 캐싱)
- `Reading`: 사용자의 독서 기록 (상태: 읽는중, 완료, 위시리스트)
- `ReadingNote`: 독서록/메모
- `Club`: 독서 모임
- `ClubMember`: 모임 멤버 및 역할 관리
- `ClubBook`: 모임의 이달의/이주의 책
- `ClubPost`: 토론 게시판 게시물
- `ClubComment`: 게시판 댓글
- `ClubSchedule`: 모임 일정
- `ChatMessage`: 실시간 채팅 메시지

**주요 API 엔드포인트:**
- `POST /api/auth/register`: 회원가입
- `POST /api/auth/login`: 로그인
- `GET /api/books/search`: 책 검색
- `GET /api/books/rankings`: 베스트셀러
- `POST /api/reading/record`: 독서 기록 추가
- `GET /api/clubs`: 모임 목록
- `POST /api/clubs`: 모임 생성

### 프론트엔드 구조

**페이지 구조 (App Router):**
- `app/page.tsx`: 홈페이지 (베스트셀러 표시)
- `app/search/page.tsx`: 책 검색
- `app/rankings/page.tsx`: 책 순위
- `app/groups/page.tsx`: 독서 모임 목록
- `app/recordBook/page.tsx`: 독서 기록

**컴포넌트 구조:**
- `components/Navar.tsx`: 상단 네비게이션
- `components/Sidebar.tsx`: 사이드바
- `components/books/`: 책 관련 컴포넌트
  - `BookSearch.tsx`: 검색 폼
  - `BookList.tsx`: 책 목록 표시
  - `BookCard.tsx`: 개별 책 카드
  - `RankingList.tsx`: 순위 목록
  - `HomeBestseller.tsx`: 홈 베스트셀러

**상태 관리:**
- React Query (`@tanstack/react-query`): 서버 상태 관리
- `providers/QueryProvider.tsx`: React Query 설정

**폼 관리:**
- React Hook Form + Zod: 폼 검증

**통신:**
- Axios: HTTP 클라이언트
- Socket.IO Client: 실시간 채팅

## 환경 변수

### 프론트엔드 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 백엔드 (.env)
```
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=mysql://user:password@localhost:3306/reading_club
JWT_SECRET=your-secret-key
ALADIN_API_KEY=your-aladin-api-key
REDIS_URL=redis://localhost:6379
```

## 주의사항

### 인증 흐름
1. 로그인 시 JWT 토큰 발급
2. 클라이언트는 모든 요청에 `Authorization: Bearer <token>` 헤더 포함
3. 백엔드는 `auth.middleware.ts`에서 토큰 검증

### 데이터 캐싱
- 알라딘 API 응답은 DB의 `Book` 테이블에 캐싱
- ISBN으로 중복 검사하여 동일한 책 중복 저장 방지

### Socket.IO
- `setupChatHandlers(io)`에서 모임별 실시간 채팅 처리
- 클라이언트는 모임 입장 시 해당 룸에 join

## 깃 워크플로우

- 메인 브랜치: `main`
- 개발 브랜치: 기능별로 생성 후 PR로 병합
- 커밋 메시지: 한국어로 작성 (예: `feat: 책 검색 기능 추가`)

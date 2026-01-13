# 독서 클럽 프로젝트

독서 기록, 모임, 통계를 한 곳에서 관리하는 독서 클럽 애플리케이션

## 🛠 기술 스택

### 프론트엔드
- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (@tanstack/react-query)
- **Form**: React Hook Form + Zod
- **Charts**: Recharts
- **Real-time**: Socket.IO Client

### 백엔드
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Authentication**: JWT
- **Real-time**: Socket.IO

## 📁 프로젝트 구조

```
book/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/       # App Router 페이지
│   │   ├── components/# React 컴포넌트
│   │   ├── hooks/     # Custom Hooks
│   │   ├── lib/       # API 클라이언트, 유틸
│   │   ├── types/     # TypeScript 타입
│   │   └── providers/ # Context Providers
│   └── package.json
│
├── backend/           # Express 백엔드
│   ├── src/
│   │   ├── controllers/  # HTTP 요청 처리
│   │   ├── services/     # 비즈니스 로직
│   │   ├── routes/       # API 라우트
│   │   ├── middlewares/  # 미들웨어
│   │   ├── utils/        # 유틸리티
│   │   └── socket/       # Socket.IO 핸들러
│   ├── prisma/
│   │   └── schema.prisma # DB 스키마
│   └── package.json
│
└── docker-compose.yml # MySQL + Redis
```

## 🚀 시작하기

### 1. 데이터베이스 실행 (Docker)

```bash
# MySQL + Redis 시작
docker-compose up -d

# 상태 확인
docker-compose ps
```

### 2. 백엔드 설정

```bash
cd backend

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어서 필요한 값 수정

# 의존성 설치
npm install

# Prisma 마이그레이션
npm run prisma:migrate

# 개발 서버 실행
npm run dev
```

백엔드 서버: http://localhost:4000

### 3. 프론트엔드 설정

```bash
cd frontend

# 환경변수 설정
cp .env.example .env.local

# 의존성 설치 (이미 완료됨)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: http://localhost:3000

## 📋 주요 기능

### 인증
- [x] 회원가입 / 로그인
- [ ] 소셜 로그인 (추후)

### 책 검색
- [ ] 알라딘 API 연동
- [ ] 책 검색
- [ ] 베스트셀러 순위

### 독서 기록
- [ ] 읽은 책 등록
- [ ] 독서 날짜/페이지 기록
- [ ] 독서록 작성
- [ ] 별점/리뷰
- [ ] 월별/연도별 통계
- [ ] 독서 잔디밭

### 독서 모임
- [ ] 모임 생성/검색/참여
- [ ] 이달의/이주의 책 설정
- [ ] 토론 게시판
- [ ] 실시간 채팅
- [ ] 일정 관리

## 🔧 개발 명령어

### 프론트엔드
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint
```

### 백엔드
```bash
npm run dev              # 개발 서버 (hot reload)
npm run build            # TypeScript 컴파일
npm run start            # 프로덕션 서버
npm run prisma:generate  # Prisma Client 생성
npm run prisma:migrate   # DB 마이그레이션
```

### Docker
```bash
docker-compose up -d     # 서비스 시작
docker-compose down      # 서비스 중지
docker-compose logs -f   # 로그 확인
```

## 📝 환경 변수

### 프론트엔드 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 백엔드 (.env)
```
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL="mysql://user:password@localhost:3306/reading_club"
JWT_SECRET=your-secret-key
ALADIN_API_KEY=your-aladin-api-key
```

## 📚 API 문서

API 엔드포인트는 추후 추가 예정

## 🤝 기여

이 프로젝트는 독서 클럽 팀 프로젝트입니다.

## 📄 라이선스

MIT

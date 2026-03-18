// import { Router } from 'express';
// import { authController } from '../controllers/auth.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';

// const router = Router();

// // 공개 라우트
// router.post('/signup', authController.signup);
// router.post('/login', authController.login);

// // 보호된 라우트 (인증 필요)
// router.get('/me', authMiddleware, authController.me);
// router.post('/logout', authMiddleware, authController.logout);

// export default router;

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // 미들웨어 임포트 확인!

const router = Router();

// 1. 회원가입: 누구나 접근 가능
// POST /api/auth/signup
router.post('/signup', authController.signup);

// 2. 로그인: 누구나 접근 가능
// POST /api/auth/login
router.post('/login', authController.login);

// 3. 내 정보 조회: 반드시 로그증(authMiddleware)이 필요함
// GET /api/auth/me
router.get('/me', authMiddleware, authController.me);
router.put('/me', authMiddleware, authController.updateProfile);

// 4. 로그아웃 (선택사항)
router.post('/logout', authController.logout);

export default router;
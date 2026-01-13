import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 공개 라우트
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 보호된 라우트 (인증 필요)
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);

export default router;

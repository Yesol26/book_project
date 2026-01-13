import { Router } from 'express';
import { clubController } from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 모든 라우트는 인증 필요
router.use(authMiddleware);

// 모임 생성
router.post('/', clubController.createClub);

// 모임 목록 조회
router.get('/', clubController.getClubs);

// 모임 상세 조회
router.get('/:id', clubController.getClub);

// 모임 참여
router.post('/:id/join', clubController.joinClub);

// 모임 탈퇴
router.post('/:id/leave', clubController.leaveClub);

export default router;

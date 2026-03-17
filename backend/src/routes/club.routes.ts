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

// 모임 삭제
router.delete('/:id', clubController.deleteClub);

// 모임 참여
router.post('/:id/join', clubController.joinClub);

// 모임 탈퇴
router.post('/:id/leave', clubController.leaveClub);

// ===== 모임 기록 관련 라우트 ===== //
// 기록 목록 조회
router.get('/:id/records', clubController.getRecords);

// 기록 등록
router.post('/:id/records', clubController.createRecord);

// 특정 기록 삭제
router.delete('/:id/records/:recordId', clubController.deleteRecord);

// ===== 모임 책 관련 라우트 ===== //
// 새로운 책 등록 / 변경
router.post('/:id/books', clubController.addClubBook);

// 책 완독/미완독 처리
router.patch('/:id/books/:bookId/status', clubController.updateClubBookStatus);

export default router;

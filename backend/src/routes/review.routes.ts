// import { Router } from 'express';
// import { reviewController } from '../controllers/review.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';

// const router = Router();

// // POST /api/reviews
// router.post('/', authMiddleware, reviewController.createReview);

// export default router;

import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // 인증 미들웨어 경로

const router = Router();

// 내 리뷰 목록 조회 (GET /api/reviews/me)
router.get('/me', authMiddleware, reviewController.getMyReviews);

// 새 리뷰 작성 (POST /api/reviews)
router.post('/', authMiddleware, reviewController.createReview);

export default router;

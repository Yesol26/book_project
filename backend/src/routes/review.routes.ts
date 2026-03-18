import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/reviews
router.post('/', authMiddleware, reviewController.createReview);

export default router;
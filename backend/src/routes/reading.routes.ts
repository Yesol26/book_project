import { Router } from 'express';
import { readingController } from '../controllers/reading.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 모든 라우트는 인증 필요
router.use(authMiddleware);

router.post('/', readingController.createReading);
router.get('/', readingController.getReadings);
router.get('/stats', readingController.getStats);
router.get('/:id', readingController.getReading);
router.put('/:id', readingController.updateReading);
router.delete('/:id', readingController.deleteReading);

export default router;

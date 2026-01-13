import { Router } from 'express';
import { bookController } from '../controllers/book.controller';

const router = Router();

// 책 검색 (알라딘 API)
router.get('/search', bookController.searchBooks);

// 베스트셀러 조회
router.get('/bestsellers', bookController.getBestsellers);

// 책 상세 정보
router.get('/:isbn', bookController.getBookDetail);

export default router;

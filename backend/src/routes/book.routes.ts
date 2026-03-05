import { Router } from 'express';
import { bookController } from '../controllers/book.controller';

const router = Router();

// 베스트셀러 조회
router.get('/bestseller', bookController.getBestseller);

// 신간 조회
router.get('/new', bookController.getNewBooks);

// 책 검색
router.get('/search', bookController.searchBooks);

// 책 상세 정보 (정규식/파라미터 우선순위를 위해 가장 아래 배치)
router.get('/:isbn', bookController.getBookDetail);

export default router;

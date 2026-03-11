import { Request, Response, NextFunction } from 'express';
import { aladinApiService } from '../services/aladin.service';
import { BookListResponse } from '../../../types/aladin';

export const bookController = {
    // 베스트셀러 조회: GET /api/books/bestseller?page=1&limit=10
    getBestseller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
            const searchTarget = (req.query.searchTarget as string) || 'Book';

            const response = await aladinApiService.getItemList('Bestseller', page, limit, searchTarget);

            const result: BookListResponse = {
                books: response.item || [],
                total: response.totalResults || 0,
                page,
                limit,
            };

            res.status(200).json(result);
        } catch (error) {
            next(error); // 오류를 Express 공통 에러 핸들러로 위임
        }
    },

    // 신간 조회: GET /api/books/new?type=all|special&page=1&limit=10
    getNewBooks: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
            const typeParam = req.query.type as string;
            const searchTarget = (req.query.searchTarget as string) || 'Book';

            // type이 special이면 주목신간, 그 외는 전체 신간
            const queryType = typeParam === 'special' ? 'ItemNewSpecial' : 'ItemNewAll';

            const response = await aladinApiService.getItemList(queryType, page, limit, searchTarget);

            const result: BookListResponse = {
                books: response.item || [],
                total: response.totalResults || 0,
                page,
                limit,
            };

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // 도서 검색: GET /api/books/search?q=검색어&page=1&limit=10
    searchBooks: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const q = req.query.q as string;
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
            const categoryId = req.query.categoryId
                ? parseInt(req.query.categoryId as string, 10)
                : undefined;

            if (!q) {
                res.status(400).json({ message: '검색어(q) 파라미터가 필요합니다.' });
                return;
            }

            const response = await aladinApiService.searchBooks(q, page, limit, categoryId);

            const result: BookListResponse = {
                books: response.item || [],
                total: response.totalResults || 0,
                page,
                limit,
            };

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // 도서 상세: GET /api/books/:isbn
    getBookDetail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { isbn } = req.params;

            if (!isbn) {
                res.status(400).json({ message: 'ISBN 파라미터가 필요합니다.' });
                return;
            }

            const response = await aladinApiService.getBookDetail(isbn);

            if (!response.item || response.item.length === 0) {
                res.status(404).json({ message: '도서를 찾을 수 없습니다.' });
                return;
            }

            // 상품 정보 1개를 반환
            res.status(200).json(response.item[0]);
        } catch (error) {
            next(error);
        }
    },
};

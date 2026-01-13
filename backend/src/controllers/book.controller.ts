import { Request, Response } from 'express';
import { bookService } from '../services/book.service';

export const bookController = {
    // 책 검색
    searchBooks: async (req: Request, res: Response): Promise<void> => {
        // TODO: query parameter 검증
        // TODO: bookService.searchBooks 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 베스트셀러 조회
    getBestsellers: async (req: Request, res: Response): Promise<void> => {
        // TODO: bookService.getBestsellers 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 책 상세 정보
    getBookDetail: async (req: Request, res: Response): Promise<void> => {
        // TODO: isbn parameter 검증
        // TODO: bookService.getBookByIsbn 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },
};

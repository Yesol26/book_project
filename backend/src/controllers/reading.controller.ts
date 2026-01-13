import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { readingService } from '../services/reading.service';

export const readingController = {
    // 독서 기록 생성
    createReading: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 입력 검증 (bookId, status 필수)
        // TODO: readingService.createReading 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 독서 기록 목록 조회
    getReadings: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: query parameter로 status 필터링
        // TODO: readingService.getUserReadings 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 독서 기록 상세 조회
    getReading: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: readingService.getReadingById 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 독서 기록 수정
    updateReading: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: readingService.updateReading 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 독서 기록 삭제
    deleteReading: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: readingService.deleteReading 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 독서 통계
    getStats: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: readingService.getReadingStats 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },
};

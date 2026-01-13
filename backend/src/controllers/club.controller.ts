import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

// 독서 모임 관련 컨트롤러
export const clubController = {
    // 모임 생성
    createClub: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 구현 필요
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 모임 목록 조회
    getClubs: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 구현 필요
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 모임 상세 조회
    getClub: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 구현 필요
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 모임 참여
    joinClub: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 구현 필요
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 모임 탈퇴
    leaveClub: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: 구현 필요
        res.status(501).json({ message: 'Not implemented yet' });
    },
};

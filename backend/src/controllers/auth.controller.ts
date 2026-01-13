import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const authController = {
    // 회원가입
    signup: async (req: Request, res: Response): Promise<void> => {
        // TODO: 입력 검증 (email, password, name)
        // TODO: authService.signup 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 로그인
    login: async (req: Request, res: Response): Promise<void> => {
        // TODO: 입력 검증 (email, password)
        // TODO: authService.login 호출
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 현재 사용자 정보
    me: async (req: AuthRequest, res: Response): Promise<void> => {
        // TODO: req.userId로 사용자 정보 조회
        res.status(501).json({ message: 'Not implemented yet' });
    },

    // 로그아웃
    logout: async (req: Request, res: Response): Promise<void> => {
        // 클라이언트에서 토큰 삭제
        res.status(200).json({ message: 'Logged out successfully' });
    },
};

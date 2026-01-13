import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

// JWT 토큰 검증 미들웨어
export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    // TODO: Authorization 헤더에서 토큰 추출
    // TODO: JWT 토큰 검증
    // TODO: req.userId, req.userEmail 설정
    next();
};

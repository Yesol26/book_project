// import { Request, Response, NextFunction } from 'express';

// export interface AuthRequest extends Request {
//     userId?: string;
//     userEmail?: string;
// }

// // JWT 토큰 검증 미들웨어
// export const authMiddleware = (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
// ): void => {
//     // TODO: Authorization 헤더에서 토큰 추출
//     // TODO: JWT 토큰 검증
//     // TODO: req.userId, req.userEmail 설정
//     next();
// };


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. 인터페이스 정의 (따로 import 할 필요 없음)
export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 2. 미들웨어 함수
export const authMiddleware = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: '접근 권한이 없습니다.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
        
        // 중요: 컨트롤러에서 쓸 수 있도록 유저 정보를 심어줌
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        
        next(); // 통과! 다음 단계(컨트롤러)로 가세요.
    } catch (err) {
        res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
};
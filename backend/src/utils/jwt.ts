import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
    userId: string;
    email: string;
}

// JWT 토큰 생성
export const generateToken = (payload: JwtPayload): string => {
    // TODO: JWT 토큰 생성 로직
    return '';
};

// JWT 토큰 검증
export const verifyToken = (token: string): JwtPayload => {
    // TODO: JWT 토큰 검증 로직
    return { userId: '', email: '' };
};

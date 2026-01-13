import prisma from '../utils/prisma';

// 회원가입
export const signup = async (data: any) => {
    // TODO: 이메일 중복 확인
    // TODO: 비밀번호 해싱 (bcrypt)
    // TODO: 사용자 생성
    // TODO: JWT 토큰 생성 및 반환
};

// 로그인
export const login = async (data: any) => {
    // TODO: 이메일로 사용자 찾기
    // TODO: 비밀번호 확인 (bcrypt.compare)
    // TODO: JWT 토큰 생성 및 반환
};

// 현재 사용자 정보 조회
export const getCurrentUser = async (userId: string) => {
    // TODO: userId로 사용자 정보 조회
};

export const authService = {
    signup,
    login,
    getCurrentUser,
};

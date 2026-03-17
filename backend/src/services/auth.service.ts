// import prisma from '../utils/prisma';

// // 회원가입
// export const signup = async (data: any) => {
//     // TODO: 이메일 중복 확인
//     // TODO: 비밀번호 해싱 (bcrypt)
//     // TODO: 사용자 생성
//     // TODO: JWT 토큰 생성 및 반환
// };

// // 로그인
// export const login = async (data: any) => {
//     // TODO: 이메일로 사용자 찾기
//     // TODO: 비밀번호 확인 (bcrypt.compare)
//     // TODO: JWT 토큰 생성 및 반환
// };

// // 현재 사용자 정보 조회
// export const getCurrentUser = async (userId: string) => {
//     // TODO: userId로 사용자 정보 조회
// };

// export const authService = {
//     signup,
//     login,
//     getCurrentUser,
// };


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma'; // 본인의 prisma 인스턴스 파일 경로

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authService = {
  // 회원가입 실무 로직
  signup: async (email: string, password: string, name: string) => {
    // 1. 중복 이메일(아이디) 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('이미 존재하는 아이디입니다.');
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. DB에 저장
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true, userId: user.id };
  },

  // 로그인 실무 로직
  login: async (email: string, password: string) => {
    // 1. 유저 존재 확인
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // 2. 비밀번호 대조
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // 3. JWT 토큰 발행
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' } // 1일 동안 유지
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  },

  // ID로 유저 정보 조회 (me API용)
  getUserById: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, profileImage: true }, // 비번 제외
    });

    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user;
  },
};
// import { Request, Response } from 'express';
// import { authService } from '../services/auth.service';
// import { AuthRequest } from '../middlewares/auth.middleware';

// export const authController = {
//     // 회원가입
//     signup: async (req: Request, res: Response): Promise<void> => {
//         // TODO: 입력 검증 (email, password, name)
//         // TODO: authService.signup 호출
//         res.status(501).json({ message: 'Not implemented yet' });
//     },

//     // 로그인
//     login: async (req: Request, res: Response): Promise<void> => {
//         // TODO: 입력 검증 (email, password)
//         // TODO: authService.login 호출
//         res.status(501).json({ message: 'Not implemented yet' });
//     },

//     // 현재 사용자 정보
//     me: async (req: AuthRequest, res: Response): Promise<void> => {
//         // TODO: req.userId로 사용자 정보 조회
//         res.status(501).json({ message: 'Not implemented yet' });
//     },

//     // 로그아웃
//     logout: async (req: Request, res: Response): Promise<void> => {
//         // 클라이언트에서 토큰 삭제
//         res.status(200).json({ message: 'Logged out successfully' });
//     },
// };

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const authController = {
    // 회원가입
    signup: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, name } = req.body;
            
            // 입력 검증
            if (!email || !password || !name) {
                res.status(400).json({ message: '모든 필드를 입력해주세요.' });
                return;
            }

            const result = await authService.signup(email, password, name);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // 로그인
    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
                return;
            }

            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    },

    // 현재 사용자 정보 (내 정보 보기)
    me: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            // 미들웨어에서 넣어준 req.userId 사용
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
                return;
            }

            const user = await authService.getUserById(userId);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    },

    // 프로필 업데이트 (이름, 비밀번호 변경)
    updateProfile: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
                return;
            }

            const updatedUser = await authService.updateProfile(userId, req.body);
            res.status(200).json({ message: '프로필이 업데이트되었습니다.', user: updatedUser });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // 로그아웃
    logout: async (req: Request, res: Response): Promise<void> => {
        // 보통 JWT는 클라이언트(브라우저)에서 토큰을 삭제하면 로그아웃됩니다.
        // 만약 Redis를 쓴다면 여기서 토큰을 블랙리스트에 추가하는 로직을 넣을 수 있습니다.
        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    },
};
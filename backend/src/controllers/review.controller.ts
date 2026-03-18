// import { Response } from 'express';
// import { AuthRequest } from '../middlewares/auth.middleware';
// import { reviewService } from '../services/review.service';

// export const reviewController = {
//   createReview: async (req: AuthRequest, res: Response): Promise<void> => {
//     try {
//       const userId = req.userId;
//       if (!userId) {
//         res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
//         return;
//       }
      
//       const review = await reviewService.createReview(userId, req.body);
//       res.status(201).json({ message: '리뷰가 성공적으로 등록되었습니다.', review });
//     } catch (error: any) {
//       res.status(500).json({ message: error.message || '리뷰 등록 중 오류가 발생했습니다.' });
//     }
//   }
// };

import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
  // 내 리뷰 목록 가져오기
  getMyReviews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // authMiddleware에서 주입된 사용자 ID
      const userId = (req as any).user.userId;
      const reviews = await reviewService.getReviewsByUserId(userId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },

  // 새 리뷰 작성하기
  createReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const reviewData = req.body;
      const newReview = await reviewService.createReview(userId, reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  },
};

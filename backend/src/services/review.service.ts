// import prisma from '../utils/prisma';

// export const reviewService = {
//   // 리뷰 생성
//   createReview: async (userId: number, data: any) => {
//     const review = await prisma.review.create({
//       data: {
//         userId,
//         bookTitle: data.bookTitle,
//         bookAuthor: data.bookAuthor,
//         rating: data.rating,
//         title: data.title,
//         content: data.content,
//       },
//     });
//     return review;
//   },
// };

import prisma from '../utils/prisma';

export const reviewService = {
  // 유저 ID로 리뷰 목록 조회
  getReviewsByUserId: async (userId: string) => {
    return prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // 새 리뷰 생성
  createReview: async (userId: string, data: {
    bookTitle: string;
    bookAuthor: string;
    rating: number;
    title: string;
    content: string;
  }) => {
    return prisma.review.create({
      data: {
        userId,
        ...data,
      },
    });
  },
};

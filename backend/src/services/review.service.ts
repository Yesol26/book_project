import prisma from '../utils/prisma';

export const reviewService = {
  // 리뷰 생성
  createReview: async (userId: number, data: any) => {
    const review = await prisma.review.create({
      data: {
        userId,
        bookTitle: data.bookTitle,
        bookAuthor: data.bookAuthor,
        rating: data.rating,
        title: data.title,
        content: data.content,
      },
    });
    return review;
  },
};
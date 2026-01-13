import prisma from '../utils/prisma';

// 독서 기록 생성
export const createReading = async (data: any) => {
    // TODO: Prisma로 독서 기록 생성
};

// 사용자의 독서 기록 목록 조회
export const getUserReadings = async (userId: string, status?: string) => {
    // TODO: Prisma로 독서 기록 목록 조회 (status 필터링 옵션)
};

// 독서 기록 상세 조회
export const getReadingById = async (id: string, userId: string) => {
    // TODO: Prisma로 독서 기록 상세 조회 (본인 것만)
};

// 독서 기록 수정
export const updateReading = async (id: string, userId: string, data: any) => {
    // TODO: Prisma로 독서 기록 수정 (본인 것만)
};

// 독서 기록 삭제
export const deleteReading = async (id: string, userId: string) => {
    // TODO: Prisma로 독서 기록 삭제 (본인 것만)
};

// 독서 통계
export const getReadingStats = async (userId: string) => {
    // TODO: 전체 독서량, 이번 달 독서량, 올해 독서량 계산
    // TODO: 월별 독서 통계 (잔디밭용)
    // TODO: 평균 별점 계산
};

export const readingService = {
    createReading,
    getUserReadings,
    getReadingById,
    updateReading,
    deleteReading,
    getReadingStats,
};

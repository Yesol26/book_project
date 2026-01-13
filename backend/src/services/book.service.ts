import prisma from '../utils/prisma';
import { aladinApi } from '../utils/aladin-api';

// 책 검색 (알라딘 API)
export const searchBooks = async (query: string, page: number = 1) => {
    // TODO: aladinApi.searchBooks 호출
};

// 베스트셀러 조회
export const getBestsellers = async (categoryId?: string) => {
    // TODO: aladinApi.getBestsellers 호출
};

// 책 상세 정보 (DB 캐싱)
export const getBookByIsbn = async (isbn: string) => {
    // TODO: DB에서 먼저 찾기
    // TODO: 없으면 알라딘 API에서 가져와서 DB에 저장
};

// 책 생성 또는 조회
export const findOrCreateBook = async (bookData: any) => {
    // TODO: Prisma upsert로 책 생성 또는 조회
};

export const bookService = {
    searchBooks,
    getBestsellers,
    getBookByIsbn,
    findOrCreateBook,
};

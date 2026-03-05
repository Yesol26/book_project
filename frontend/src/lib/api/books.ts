import { apiClient } from './client';
import { AladinBook, BookListResponse } from '../../../../types/aladin';

export const bookApi = {
    // 베스트셀러 리스트 조회
    getBestsellers: async (page: number = 1, limit: number = 10): Promise<BookListResponse> => {
        const { data } = await apiClient.get<BookListResponse>('/books/bestseller', { params: { page, limit } });
        return data;
    },

    // 신간 리스트 조회
    getNewBooks: async (type: 'all' | 'special', page: number = 1, limit: number = 10): Promise<BookListResponse> => {
        const { data } = await apiClient.get<BookListResponse>('/books/new', { params: { type, page, limit } });
        return data;
    },

    // 검색
    searchBooks: async (query: string, page: number = 1, limit: number = 10): Promise<BookListResponse> => {
        const { data } = await apiClient.get<BookListResponse>('/books/search', { params: { q: query, page, limit } });
        return data;
    },

    // 상품 상세
    getBookDetail: async (isbn: string): Promise<AladinBook> => {
        const { data } = await apiClient.get<AladinBook>(`/books/${isbn}`);
        return data;
    },
};

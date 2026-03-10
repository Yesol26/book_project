import { useQuery } from '@tanstack/react-query';
import { bookApi } from '../../lib/api/books';

// 1. 베스트셀러 훅
export const useBestsellers = (page: number = 1, searchTarget: string = 'Book') => {
    return useQuery({
        queryKey: ['books', 'bestseller', page, searchTarget],
        queryFn: () => bookApi.getBestsellers(page, 10, searchTarget),
        staleTime: 1000 * 60 * 60, // 1시간 (백엔드 캐시와 동일)
        gcTime: 1000 * 60 * 60 * 2, // 가비지 컬렉션은 2시간
    });
};

// 2. 신간 도서 훅
export const useNewBooks = (type: 'all' | 'special', page: number = 1, searchTarget: string = 'Book') => {
    return useQuery({
        queryKey: ['books', 'new', type, page, searchTarget],
        queryFn: () => bookApi.getNewBooks(type, page, 10, searchTarget),
        staleTime: 1000 * 60 * 60, // 1시간
        gcTime: 1000 * 60 * 60 * 2, // 2시간
    });
};

// 3. 도서 검색 훅 (검색어 입력 중에는 호출하지 않고 debounce 쿼리와 함께 사용됨)
export const useBookSearch = (query: string, page: number = 1) => {
    return useQuery({
        queryKey: ['books', 'search', query, page],
        queryFn: () => bookApi.searchBooks(query, page),
        // 쿼리가 빈 문자열이 아닐 때만 API를 호출하도록 방어
        enabled: !!query && query.trim().length > 0,
        staleTime: 1000 * 60 * 10, // 10분
        gcTime: 1000 * 60 * 30, // 30분
    });
};

// 4. 도서 상세 훅
export const useBookDetail = (isbn: string) => {
    return useQuery({
        queryKey: ['books', 'detail', isbn],
        queryFn: () => bookApi.getBookDetail(isbn),
        enabled: !!isbn,
        staleTime: 1000 * 60 * 60 * 24, // 상세 정보는 자주 안바뀌므로 24시간
        gcTime: 1000 * 60 * 60 * 48, // 48시간
    });
};

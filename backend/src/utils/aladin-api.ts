// 알라딘 API 클라이언트
// API 문서: https://blog.aladin.co.kr/openapi

const ALADIN_API_KEY = process.env.ALADIN_API_KEY || '';
const ALADIN_BASE_URL = 'http://www.aladin.co.kr/ttb/api';

// 책 검색
export const searchBooks = async (query: string, page: number = 1) => {
    // TODO: axios로 알라딘 API 호출
    // TODO: ItemSearch.aspx 엔드포인트 사용
};

// 베스트셀러 조회
export const getBestsellers = async (categoryId?: string) => {
    // TODO: axios로 알라딘 API 호출
    // TODO: ItemList.aspx 엔드포인트 사용
};

// 책 상세 정보
export const getBookDetail = async (isbn: string) => {
    // TODO: axios로 알라딘 API 호출
    // TODO: ItemLookUp.aspx 엔드포인트 사용
};

export const aladinApi = {
    searchBooks,
    getBestsellers,
    getBookDetail,
};

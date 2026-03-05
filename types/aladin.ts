// types/aladin.ts

/**
 * 알라딘 상품 리스트 QueryType
 * Bestseller: 베스트셀러
 * ItemNewAll: 신간전체
 * ItemNewSpecial: 주목할만한 신간
 */
export type AladinQueryType = 'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial';

/**
 * 알라딘 상품 상세(도서) 정보 인터페이스
 * 알라딘 OpenAPI JSON 응답 매핑
 */
export interface AladinBook {
    title: string;
    link: string;
    author: string;
    pubDate: string;
    description: string;
    isbn: string;
    isbn13: string;
    itemId: number;
    priceSales: number;
    priceStandard: number;
    mallType: string;
    stockStatus: string;
    mileage: number;
    cover: string;
    categoryId: number;
    categoryName: string;
    publisher: string;
    salesPoint: number;
    adult: boolean;
    fixedPrice: boolean;
    customerReviewRank: number;
    subInfo?: {
        packing?: {
            styleDesc?: string;
            weight?: number;
            sizeDepth?: number;
            sizeHeight?: number;
            sizeWidth?: number;
        };
        ratingInfo?: {
            ratingScore: number;
            ratingCount: number;
            commentReviewCount: number;
            myReviewCount: number;
        };
        bestSellerRank?: string;
    };
}

/**
 * 알라딘 API 기본 응답 형식
 */
export interface AladinBaseResponse {
    version: string;
    title: string;
    link: string;
    pubDate: string;
    imageUrl: string;
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
    query: string;
    searchCategoryId: number;
    searchCategoryName: string;
}

/**
 * 상품리스트 응답 인터페이스 (/ItemList.aspx)
 */
export interface AladinListResponse extends AladinBaseResponse {
    item: AladinBook[];
}

/**
 * 도서검색 응답 인터페이스 (/ItemSearch.aspx)
 */
export interface AladinSearchResponse extends AladinBaseResponse {
    item: AladinBook[];
}

/**
 * 백엔드 -> 프론트엔드 자체 공통 도서 응답 규격
 */
export interface BookListResponse {
    books: AladinBook[];
    total: number;
    page: number;
    limit: number;
}

import axios from 'axios';
import crypto from 'crypto';
import redisClient from '../utils/redis';
import {
    AladinQueryType,
    AladinListResponse,
    AladinSearchResponse
} from '../../../types/aladin';

export class AladinApiService {
    private readonly baseUrl = 'http://www.aladin.co.kr/ttb/api';
    private readonly version = '20131101';
    private readonly output = 'js';

    private get ttbKey(): string {
        const key = process.env.ALADIN_TTB_KEY;
        if (!key) throw new Error('ALADIN_TTB_KEY is not defined in environment variables');
        return key;
    }

    /**
     * Redis 캐시 키 생성 헬퍼
     * 컨벤션: aladin:{type}:{params_hash}
     */
    private generateCacheKey(type: string, params: Record<string, any>): string {
        const sortedParams = Object.keys(params)
            .sort()
            .map((k) => `${k}=${params[k]}`)
            .join('&');
        const hash = crypto.createHash('sha256').update(sortedParams).digest('hex');
        return `aladin:${type}:${hash}`;
    }

    /**
     * 알라딘 API 호출 및 Redis 캐싱 캡슐화
     */
    private async fetchWithCache<T>(
        endpoint: string,
        type: string,
        params: Record<string, any>,
        ttlSeconds: number
    ): Promise<T> {
        const cacheKey = this.generateCacheKey(type, params);

        // 1. 캐시 시도 (에러 발생해도 API 호출로 Fallback)
        try {
            if (redisClient.isReady) {
                const cached = await redisClient.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached) as T;
                }
            }
        } catch (err) {
            console.warn('Redis Get Cache Error (Fallback to API):', err);
        }

        // 2. 캐시 미스시 알라딘 API 호출
        const response = await axios.get<T>(`${this.baseUrl}${endpoint}`, {
            params: {
                ttbkey: this.ttbKey,
                output: this.output,
                Version: this.version,
                ...params,
            },
            timeout: 5000,
        });

        const data = response.data;

        // 3. API 응답 캐싱 (errorCode가 있는 오류 응답은 캐싱하지 않음)
        try {
            if (redisClient.isReady) {
                const anyData = data as any;
                if (!anyData.errorCode) {
                    await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(data));
                }
            }
        } catch (err) {
            console.warn('Redis Set Cache Error:', err);
        }

        return data;
    }

    /**
     * 베스트셀러 및 신간 조회
     * TTL: 1시간 (3600초)
     */
    public async getItemList(
        queryType: AladinQueryType,
        page: number = 1,
        limit: number = 10
    ): Promise<AladinListResponse> {
        const params = {
            QueryType: queryType,
            MaxResults: limit,
            start: page,
            SearchTarget: 'Book',
        };

        return this.fetchWithCache<AladinListResponse>(
            '/ItemList.aspx',
            queryType.toLowerCase(),
            params,
            3600
        );
    }

    /**
     * 도서 검색
     * TTL: 10분 (600초)
     */
    public async searchBooks(
        query: string,
        page: number = 1,
        limit: number = 10
    ): Promise<AladinSearchResponse> {
        const params = {
            Query: query,
            MaxResults: limit,
            start: page,
            SearchTarget: 'Book',
        };

        return this.fetchWithCache<AladinSearchResponse>(
            '/ItemSearch.aspx',
            'search',
            params,
            600
        );
    }

    /**
     * 상품 상세 조회
     * TTL: 24시간 (86400초)
     */
    public async getBookDetail(isbn13: string): Promise<AladinListResponse> {
        const params = {
            ItemId: isbn13,
            ItemIdType: 'ISBN13',
            OptResult: 'packing,ratingInfo,bestSellerRank',
        };

        return this.fetchWithCache<AladinListResponse>(
            '/ItemLookUp.aspx',
            'detail',
            params,
            86400
        );
    }
}

export const aladinApiService = new AladinApiService();

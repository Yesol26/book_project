'use client';

import { AladinBook } from '../../../../types/aladin';
import RankingCard from './RankingCard';

interface RankingListProps {
    books: AladinBook[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    total?: number;
    onPageChange: (page: number) => void;
}

// 스켈레톤 로딩 아이템
function SkeletonItem() {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="w-12 h-16 bg-gray-200 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="w-16 flex-shrink-0 space-y-1">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

export default function RankingList({
    books,
    isLoading,
    page,
    totalPages,
    total,
    onPageChange,
}: RankingListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonItem key={i} />
                ))}
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="text-center text-gray-400 py-20 text-lg">
                결과가 없습니다.
            </div>
        );
    }

    const startRank = (page - 1) * 10 + 1;

    return (
        <div>
            {/* 총 결과 수 */}
            {total !== undefined && (
                <p className="text-sm text-gray-500 mb-4">
                    총 <span className="font-semibold text-indigo-600">{total.toLocaleString()}</span>건
                </p>
            )}

            {/* 순위 리스트 */}
            <div className="space-y-3">
                {books.map((book, index) => (
                    <RankingCard
                        key={book.isbn13 || book.isbn || `rank-${index}`}
                        book={book}
                        rank={startRank + index}
                    />
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        이전
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // 현재 페이지 기준으로 최대 5개 페이지 버튼 표시
                        const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                        const pageNum = start + i;
                        if (pageNum > totalPages) return null;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${pageNum === page
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

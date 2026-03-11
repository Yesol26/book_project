'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import { AladinBook } from '../../../../types/aladin';

interface BookListProps {
    books: AladinBook[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    total?: number;
    onPageChange: (page: number) => void;
}

// 스켈레톤 카드
function SkeletonCard() {
    return (
        <div className="flex flex-col animate-pulse">
            <div className="w-full aspect-[3/4] rounded-lg bg-gray-200 mb-2.5" />
            <div className="h-3.5 bg-gray-200 rounded w-4/5 mb-1.5" />
            <div className="h-3 bg-gray-100 rounded w-3/5 mb-1.5" />
            <div className="h-3.5 bg-gray-200 rounded w-2/5" />
        </div>
    );
}

export default function BookList({ books, isLoading, page, totalPages, total, onPageChange }: BookListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
                {Array.from({ length: 21 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-gray-400 text-base">검색 결과가 없습니다.</p>
                <p className="text-gray-300 text-sm mt-1">다른 검색어로 시도해보세요.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 결과 수 */}
            {total !== undefined && (
                <p className="mb-4 text-sm text-gray-500">
                    검색결과 <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
                </p>
            )}

            {/* 그리드 */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
                {books.map((book) => (
                    <BookCard key={book.itemId} book={book} />
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${page === pageNum
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}
        </div>
    );
}

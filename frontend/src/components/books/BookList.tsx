'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
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

function SkeletonCard() {
    return (
        <div className="flex flex-col animate-pulse">
            <div className="w-full aspect-[3/4] rounded-md bg-gray-200 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-4/5 mb-1" />
            <div className="h-2.5 bg-gray-100 rounded w-3/5 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-2/5" />
        </div>
    );
}

export default function BookList({
    books, isLoading, page, totalPages, total, onPageChange
}: BookListProps) {
    const { isWishlisted, toggleWishlist } = useWishlist();

    if (isLoading) {
        return (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {Array.from({ length: 28 }).map((_, i) => <SkeletonCard key={i} />)}
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

    const getPageNumbers = () => {
        const delta = 2;
        const start = Math.max(1, page - delta);
        const end = Math.min(totalPages, page + delta);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="w-full">
            {total !== undefined && (
                <p className="mb-4 text-sm text-gray-500">
                    검색결과 <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
                </p>
            )}

            {/* 7열 그리드, gap 좁게 */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-x-3 gap-y-6">
                {books.map((book) => (
                    <BookCard
                        key={book.itemId}
                        book={book}
                        isWishlisted={isWishlisted(book.itemId)}
                        onToggleWishlist={() => toggleWishlist({
                            itemId: book.itemId,
                            title: book.title,
                            author: book.author,
                            cover: book.cover
                        })}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-1.5">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={page === 1}
                        className="px-3 py-2 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                    >
                        처음
                    </button>
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                                page === pageNum
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages}
                        className="px-3 py-2 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                    >
                        끝
                    </button>
                </div>
            )}
        </div>
    );
}
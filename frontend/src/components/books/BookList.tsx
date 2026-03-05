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

export default function BookList({ books, isLoading, page, totalPages, total, onPageChange }: BookListProps) {
    if (isLoading) {
        return <div className="py-12 text-center text-gray-500 animate-pulse">도서 목록을 불러오는 중...</div>;
    }

    if (!books || books.length === 0) {
        return <div className="py-12 text-center text-gray-500">검색 결과가 없습니다.</div>;
    }

    return (
        <div className="w-full">
            {total !== undefined && (
                <div className="mb-4 text-gray-700 font-medium text-sm">
                    총 <span className="text-blue-600 font-bold">{total.toLocaleString()}</span>건의 결과
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {books.map((book) => (
                    <BookCard key={book.itemId} book={book} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-10 mb-8 flex justify-center items-center gap-3">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                        이전
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

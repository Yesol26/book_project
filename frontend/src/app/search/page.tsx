import { Suspense } from 'react';
import BookSearch from '@/components/books/BookSearch';

export default function SearchPage() {
    return (
        <div className="flex-1 bg-white">

            <header className="py-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900">도서 검색</h1>
                </div>
            </header>

            <main className="px-4">
                {/* useSearchParams를 사용하는 클라이언트 컴포넌트는 Suspense로 감싸야 함 */}
                <Suspense fallback={<div className="py-20 text-center animate-pulse">검색 모듈을 불러오는 중...</div>}>
                    <BookSearch />
                </Suspense>
            </main>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookSearch, useBestsellers } from '../../hooks/queries/useBooks';
import { useDebounce } from '../../hooks/useDebounce';
import BookList from './BookList';
import BookCard from './BookCard';
import { Search, X } from 'lucide-react';

const searchSchema = z.object({
    query: z.string().min(1, '최소 1글자 이상 입력해주세요.').or(z.literal('')),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const TABS = ['통합', '도서'] as const;
type TabType = (typeof TABS)[number];

const SORT_OPTIONS = [
    { label: '인기순', value: 'Accuracy' },
    { label: '최신순', value: 'PublishTime' },
    { label: '판매량순', value: 'SalesPoint' },
    { label: '낮은 가격순', value: 'LowPrice' },
];

// 카테고리 칩 — 알라딘 CategoryId 기준 (0 = 전체)
const CATEGORY_CHIPS: { label: string; categoryId: number | undefined }[] = [
    { label: '전체', categoryId: undefined },
    { label: '소설', categoryId: 1 },
    { label: '에세이', categoryId: 55890 },
    { label: '경제경영', categoryId: 170 },
    { label: 'IT', categoryId: 351 },
    { label: '인문', categoryId: 656 },
    { label: '여행', categoryId: 1196 },
    { label: '자기계발', categoryId: 336 },
];

// [추가] 빈 상태 컴포넌트 — 베스트셀러 추천 표시
function EmptyState({ query }: { query?: string }) {
    const { data, isLoading } = useBestsellers(1, 'Book');
    const books = data?.books?.slice(0, 4) ?? [];

    return (
        <div className="mt-12">
            {/* 아이콘 + 안내 텍스트 */}
            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-indigo-500" />
                </div>
                {query ? (
                    <>
                        <p className="text-gray-700 font-semibold text-base">
                            &lsquo;{query}&rsquo;에 대한 결과가 없어요
                        </p>
                        <p className="text-gray-400 text-sm mt-1">다른 검색어로 시도해보세요.</p>
                    </>
                ) : (
                    <p className="text-gray-500 text-base">찾고 싶은 책을 검색해보세요</p>
                )}
            </div>

            {/* 구분선 + 추천 */}
            <div className="border-t border-gray-100 pt-8">
                <p className="text-sm font-bold text-gray-700 mb-5">이런 책은 어때요? 👀</p>
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col animate-pulse">
                                <div className="w-full aspect-[3/4] bg-gray-200 rounded-r-md mb-2.5" />
                                <div className="h-3.5 bg-gray-200 rounded w-4/5 mb-1.5" />
                                <div className="h-3 bg-gray-100 rounded w-3/5" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {books.map((book) => (
                            <BookCard key={book.itemId} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BookSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [page, setPage] = useState(initialPage);
    const [activeTab, setActiveTab] = useState<TabType>('도서');
    const [sortBy, setSortBy] = useState('Accuracy');
    // 선택된 카테고리 CategoryId (undefined = 전체)
    const [activeChip, setActiveChip] = useState<number | undefined>(undefined);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { register, watch, setValue, formState: { errors } } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: initialQuery },
        mode: 'onChange',
    });

    const queryValue = watch('query');

    useEffect(() => {
        if (!errors.query) {
            setSearchTerm(queryValue || '');
            if (queryValue !== initialQuery && queryValue !== debouncedSearchTerm) {
                setPage(1);
            }
        }
    }, [queryValue, errors.query]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let urlChanged = false;

        if (debouncedSearchTerm.trim().length > 0) {
            if (params.get('q') !== debouncedSearchTerm) { params.set('q', debouncedSearchTerm); urlChanged = true; }
            if (params.get('page') !== page.toString()) { params.set('page', page.toString()); urlChanged = true; }
        } else {
            if (params.has('q')) { params.delete('q'); params.delete('page'); urlChanged = true; }
        }

        if (urlChanged) router.replace(`?${params.toString()}`, { scroll: false });
    }, [debouncedSearchTerm, page, router, searchParams]);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        if (currentQ !== debouncedSearchTerm && currentQ !== searchTerm) setSearchTerm(currentQ);
        if (currentPage !== page) setPage(currentPage);
    }, [searchParams]);

    const { data, isLoading, error } = useBookSearch(debouncedSearchTerm, page, activeChip);
    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;
    const hasQuery = debouncedSearchTerm.trim().length > 0;
    const hasResults = (data?.books?.length ?? 0) > 0;

    const handleClear = () => {
        setValue('query', '');
        setSearchTerm('');
    };

    // 칩 선택 시 CategoryId 업데이트 + 페이지 리셋
    const handleChipSelect = (categoryId: number | undefined) => {
        setActiveChip(categoryId);
        setPage(1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">

            {/* 페이지 타이틀 */}
            <h1 className="text-center text-xl font-bold text-gray-800 mb-6">검색결과</h1>

            {/* 검색바 */}
            <div className="relative max-w-2xl mx-auto mb-6">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    {...register('query')}
                    placeholder="도서명, 저자, 출판사 등 검색"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                />
                {queryValue && !isLoading && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* 탭 */}
            <div className="flex gap-0 border-b border-gray-200 mb-4 max-w-2xl mx-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 카테고리 칩 — 탭 바로 아래, 전체 너비 */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
                {CATEGORY_CHIPS.map((chip) => (
                    <button
                        key={chip.categoryId ?? 'all'}
                        onClick={() => handleChipSelect(chip.categoryId)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeChip === chip.categoryId
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* 에러 */}
            {error && (
                <div className="text-center text-red-500 py-10">검색 중 서버 오류가 발생했습니다.</div>
            )}

            {/* [수정] 검색어 없을 때 — EmptyState 컴포넌트 */}
            {!error && !hasQuery && <EmptyState />}

            {/* [수정] 검색 결과 없을 때 */}
            {!error && hasQuery && !isLoading && !hasResults && (
                <EmptyState query={debouncedSearchTerm} />
            )}

            {/* 검색 결과 — [수정] 우측 aside 제거, 단일 컬럼 전체 너비 */}
            {!error && hasQuery && (isLoading || hasResults) && (
                <div>
                    {/* 결과 수 + 정렬 */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm text-gray-500">
                            검색결과{' '}
                            <span className="font-bold text-gray-900">
                                {data?.total?.toLocaleString() ?? '—'}
                            </span>
                        </p>
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <BookList
                        books={data?.books || []}
                        isLoading={isLoading}
                        page={page}
                        totalPages={totalPages}
                        total={undefined}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}

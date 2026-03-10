'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookSearch } from '../../hooks/queries/useBooks';
import { useDebounce } from '../../hooks/useDebounce';
import BookList from './BookList';
import { Search, X, SlidersHorizontal } from 'lucide-react';

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

export default function BookSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [page, setPage] = useState(initialPage);
    const [activeTab, setActiveTab] = useState<TabType>('도서');
    const [sortBy, setSortBy] = useState('Accuracy');

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

    const { data, isLoading, error } = useBookSearch(debouncedSearchTerm, page);
    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;
    const hasQuery = debouncedSearchTerm.trim().length > 0;

    const handleClear = () => {
        setValue('query', '');
        setSearchTerm('');
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
                {queryValue && (
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
            <div className="flex gap-0 border-b border-gray-200 mb-6 max-w-2xl mx-auto">
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

            {/* 에러 */}
            {error && (
                <div className="text-center text-red-500 py-10">검색 중 서버 오류가 발생했습니다.</div>
            )}

            {/* 검색어 없을 때 */}
            {!error && !hasQuery && (
                <div className="text-center text-gray-400 mt-32 text-base">
                    궁금한 도서를 검색해보세요 📚
                </div>
            )}

            {/* 검색 결과 */}
            {!error && hasQuery && (
                <div className="flex gap-8">
                    {/* 좌측: 결과 목록 */}
                    <div className="flex-1 min-w-0">
                        {/* 결과 수 + 정렬 */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-gray-500">
                                검색결과{' '}
                                <span className="font-bold text-gray-900">
                                    {data?.total?.toLocaleString() ?? '—'}
                                </span>
                            </p>
                            <div className="flex items-center gap-2">
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
                        </div>

                        <BookList
                            books={data?.books || []}
                            isLoading={isLoading}
                            page={page}
                            totalPages={totalPages}
                            total={undefined}   /* 위에서 직접 표시하므로 List에선 숨김 */
                            onPageChange={setPage}
                        />
                    </div>

                    {/* 우측: 필터 패널 */}
                    <aside className="w-52 flex-shrink-0 hidden lg:block">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
                            {/* 헤더 */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    필터
                                </div>
                            </div>

                            {/* 카테고리 */}
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">카테고리</p>
                                <ul className="space-y-2">
                                    {['소설', '에세이', '경제경영', '자기계발', 'IT', '인문', '여행'].map((cat) => (
                                        <li key={cat}>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <span className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-indigo-400 transition-colors flex items-center justify-center flex-shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-indigo-200 transition-colors" />
                                                </span>
                                                <span className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors">{cat}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 도서 종류 */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">도서 종류</p>
                                <ul className="space-y-2">
                                    {['국내도서', '외국도서', '전자책'].map((type) => (
                                        <li key={type}>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <span className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-indigo-400 transition-colors flex-shrink-0" />
                                                <span className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors">{type}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

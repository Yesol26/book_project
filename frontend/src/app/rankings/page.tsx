'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBestsellers, useNewBooks } from '../../hooks/queries/useBooks';
import RankingList from '../../components/books/RankingList';

// 탭 정의
const TABS = [
    { id: 'bestseller', label: '베스트셀러' },
    { id: 'new-all', label: '신간 전체' },
    { id: 'new-special', label: '주목 신간' },
] as const;

type TabId = (typeof TABS)[number]['id'];

// 카테고리 필터 옵션 (알라딘 SearchTarget 값과 매핑)
const CATEGORIES = [
    { label: '전체 도서', value: 'Book' },
    { label: '국내도서', value: 'Korean' },
    { label: '외국도서', value: 'Foreign' },
    { label: '소설/시', value: 'Novel' },
    { label: '경제경영', value: 'Business' },
    { label: '자기계발', value: 'SelfManagement' },
    { label: '인문학', value: 'Humanity' },
    { label: 'IT/컴퓨터', value: 'Computer' },
];

// 실제 컨텐츠 컴포넌트 (useSearchParams 사용)
function RankingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialTab = (searchParams.get('tab') as TabId) || 'bestseller';
    const initialCategory = searchParams.get('category') || 'Book';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [searchTarget, setSearchTarget] = useState(initialCategory);
    const [page, setPage] = useState(initialPage);

    // URL 동기화
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('tab', activeTab);
        params.set('category', searchTarget);
        params.set('page', page.toString());
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeTab, searchTarget, page, router]);

    // 탭/카테고리 변경 시 페이지 리셋
    const handleTabChange = (tab: TabId) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSearchTarget(category);
        setPage(1);
    };

    // 현재 탭에 맞는 API 호출
    const bestsellersQuery = useBestsellers(page, searchTarget);
    const newAllQuery = useNewBooks('all', page, searchTarget);
    const newSpecialQuery = useNewBooks('special', page, searchTarget);

    const queryMap: Record<TabId, typeof bestsellersQuery> = {
        'bestseller': bestsellersQuery,
        'new-all': newAllQuery,
        'new-special': newSpecialQuery,
    };

    const activeQuery = queryMap[activeTab];
    const data = activeQuery.data;
    const isLoading = activeQuery.isLoading;
    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* 페이지 헤더 */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-1">도서 순위</h1>
                    <p className="text-sm text-gray-500">알라딘 베스트셀러 및 신간 도서 순위를 확인하세요.</p>
                </div>

                {/* 탭 UI */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 카테고리 필터 */}
                <div className="flex items-center gap-3 mb-6">
                    <label htmlFor="category-select" className="text-sm font-semibold text-gray-600 flex-shrink-0">
                        분야
                    </label>
                    <select
                        id="category-select"
                        value={searchTarget}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 에러 상태 */}
                {activeQuery.error && (
                    <div className="text-center text-red-500 py-12 bg-white rounded-xl border border-red-100">
                        데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                    </div>
                )}

                {/* 순위 리스트 */}
                {!activeQuery.error && (
                    <RankingList
                        books={data?.books || []}
                        isLoading={isLoading}
                        page={page}
                        totalPages={totalPages}
                        total={data?.total}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
}

// useSearchParams는 Suspense 경계 필요 (Next.js 15)
export default function RankingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        }>
            <RankingsContent />
        </Suspense>
    );
}

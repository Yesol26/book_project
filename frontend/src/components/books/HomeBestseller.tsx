'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { useBestsellers } from '@/hooks/queries/useBooks';
import { getHighQualityCover } from '@/lib/utils/image';

const CATEGORY_TABS = [
    { label: '종합', value: 'Book' },
    { label: '소설', value: 'Novel' },
    { label: '경제/경영', value: 'Business' },
    { label: '자기계발', value: 'SelfManagement' },
    { label: '시/에세이', value: 'Essay' },
    { label: '인문/교양', value: 'Humanity' },
    { label: 'IT', value: 'Computer' },
];

import { useState } from 'react';
import { AladinBook } from '../../../../types/aladin';

function RankBadge({ rank }: { rank: number }) {
    const base = 'w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0';
    if (rank === 1) return <span className={`${base} bg-yellow-400 text-white`}>1</span>;
    if (rank === 2) return <span className={`${base} bg-gray-300 text-white`}>2</span>;
    if (rank === 3) return <span className={`${base} bg-amber-600 text-white`}>3</span>;
    return <span className={`${base} bg-gray-100 text-gray-500`}>{rank}</span>;
}

function RankItem({ book, rank }: { book: AladinBook; rank: number }) {
    const coverUrl = getHighQualityCover(book.cover);
    // salesPoint 기반 임의 순위변동 (실제 API에서 해당 필드 없을 시 Mock)
    const change = Math.floor(Math.random() * 7) - 3;

    return (
        <div className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
            {/* 순위 */}
            <RankBadge rank={rank} />

            {/* 표지 — 책 모양 */}
            <div
                className="relative w-10 h-14 flex-shrink-0 overflow-hidden rounded-r-sm group-hover:scale-105 transition-transform duration-200"
                style={{ boxShadow: '-3px 3px 8px rgba(0,0,0,0.22)' }}
            >
                {coverUrl
                    ? <Image src={coverUrl} alt={book.title} fill className="object-cover" sizes="40px" />
                    : <div className="w-full h-full bg-gray-200" />
                }
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{book.author}</p>
            </div>

            {/* 순위 변동 */}
            <div className="flex-shrink-0 flex items-center gap-0.5">
                {change > 0 ? (
                    <>
                        <TrendingUp className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] font-bold text-red-400">{change}</span>
                    </>
                ) : change < 0 ? (
                    <>
                        <TrendingDown className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400">{Math.abs(change)}</span>
                    </>
                ) : (
                    <Minus className="w-3 h-3 text-gray-300" />
                )}
            </div>
        </div>
    );
}

export default function HomeBestseller() {
    const [activeCategory, setActiveCategory] = useState('Book');
    const { data, isLoading } = useBestsellers(1, activeCategory);
    const books = data?.books?.slice(0, 10) ?? [];

    return (
        <section>
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-amber-400 rounded-full" />
                    베스트셀러 순위
                </h3>
                <Link
                    href="/rankings?tab=bestseller&category=Book&page=1"
                    className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline"
                >
                    전체보기 <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar">
                {CATEGORY_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveCategory(tab.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === tab.value
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 랭킹 리스트 — 2열 그리드 */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="w-10 h-14 bg-gray-200 rounded flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 bg-gray-200 rounded w-4/5" />
                                <div className="h-3 bg-gray-100 rounded w-3/5" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
                    {books.map((book, i) => (
                        <RankItem key={book.itemId} book={book} rank={i + 1} />
                    ))}
                </div>
            )}
        </section>
    );
}

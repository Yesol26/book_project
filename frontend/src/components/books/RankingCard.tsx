'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AladinBook } from '../../../../types/aladin';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RankingCardProps {
    book: AladinBook;
    rank: number;
}

// 순위에 따른 메달 색상 클래스
function getRankStyle(rank: number): { badge: string; text: string } {
    if (rank === 1) return { badge: 'bg-yellow-400 text-white', text: 'text-yellow-500' };
    if (rank === 2) return { badge: 'bg-gray-400 text-white', text: 'text-gray-500' };
    if (rank === 3) return { badge: 'bg-amber-600 text-white', text: 'text-amber-700' };
    return { badge: 'bg-indigo-50 text-indigo-600', text: 'text-gray-500' };
}

// salesPoint를 이용해 순위 변동 아이콘 표시 (임시: salesPoint 기준 편의 처리)
function RankChange({ rank }: { rank: number }) {
    // 실제 순위 변동 데이터가 없으므로 UI 데모용으로 처리
    const mod = rank % 3;
    if (mod === 0) return <span className="flex items-center gap-0.5 text-xs text-red-400"><TrendingUp className="w-3 h-3" />상승</span>;
    if (mod === 1) return <span className="flex items-center gap-0.5 text-xs text-blue-400"><TrendingDown className="w-3 h-3" />하락</span>;
    return <span className="flex items-center gap-0.5 text-xs text-gray-400"><Minus className="w-3 h-3" />유지</span>;
}

export default function RankingCard({ book, rank }: RankingCardProps) {
    const rankStyle = getRankStyle(rank);

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group">
            {/* 순위 번호 */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${rankStyle.badge} shadow-sm`}>
                {rank}
            </div>

            {/* 책 표지 */}
            <Link href={book.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <div className="relative w-12 h-16 bg-gray-100 rounded-md overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    {book.cover ? (
                        <Image
                            src={book.cover}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No img</div>
                    )}
                </div>
            </Link>

            {/* 책 정보 */}
            <div className="flex-1 min-w-0">
                <Link href={book.link} target="_blank" rel="noopener noreferrer">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                        {book.title}
                    </h4>
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{book.author}</p>
                <div className="mt-1.5 flex items-center gap-2">
                    <RankChange rank={rank} />
                    {book.categoryName && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full line-clamp-1">
                            {book.categoryName.split('>').pop()?.trim()}
                        </span>
                    )}
                </div>
            </div>

            {/* 가격 */}
            <div className="flex-shrink-0 text-right">
                <p className="text-sm font-bold text-indigo-600">
                    {book.priceSales ? book.priceSales.toLocaleString() : 0}원
                </p>
                {book.priceStandard > book.priceSales && (
                    <p className="text-xs text-gray-400 line-through">
                        {book.priceStandard.toLocaleString()}원
                    </p>
                )}
            </div>
        </div>
    );
}

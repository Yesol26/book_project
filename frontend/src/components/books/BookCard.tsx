import Image from 'next/image';
import { AladinBook } from '../../../../types/aladin';
import { getHighQualityCover } from '@/lib/utils/image';

interface BookCardProps {
    book: AladinBook;
}

export default function BookCard({ book }: BookCardProps) {
    const coverUrl = getHighQualityCover(book.cover);

    return (
        <div className="group cursor-pointer flex flex-col">
            {/* 표지 — 책 모양 CSS */}
            <div className="relative w-full aspect-[3/4] mb-2.5">
                <div
                    className="w-full h-full rounded-r-md overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                    style={{
                        boxShadow: '-4px 4px 12px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)',
                    }}
                >
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 28vw, (max-width: 768px) 22vw, (max-width: 1024px) 18vw, 168px"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-300 text-xs italic">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            {/* 정보 */}
            <div className="space-y-0.5 px-0.5">
                <h3
                    className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors"
                    title={book.title}
                >
                    {book.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-sm font-bold text-gray-900">
                        {book.priceSales ? book.priceSales.toLocaleString() : 0}원
                    </span>
                    {book.priceStandard > book.priceSales && (
                        <span className="text-xs text-gray-400 line-through">
                            {book.priceStandard.toLocaleString()}원
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

import Image from 'next/image';
import Link from 'next/link';
import { AladinBook } from '../../../../types/aladin';

interface BookCardProps {
    book: AladinBook;
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative w-full aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
                {book.cover ? (
                    <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">{book.author}</p>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="font-semibold text-blue-600">
                        {book.priceSales ? book.priceSales.toLocaleString() : 0}원
                    </span>
                    {book.priceStandard > book.priceSales && (
                        <span className="text-xs text-gray-400 line-through">
                            {book.priceStandard.toLocaleString()}원
                        </span>
                    )}
                </div>
                <Link
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full text-center py-2 px-4 border border-transparent text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    알라딘에서 보기
                </Link>
            </div>
        </div>
    );
}

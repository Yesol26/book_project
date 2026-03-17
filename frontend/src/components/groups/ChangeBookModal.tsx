import React, { useState } from 'react';
import { X, Search, Book } from 'lucide-react';
import { useAddClubBook } from '@/hooks/queries/useClubs';
import { useBookSearch } from '@/hooks/queries/useBooks';
import { useDebounce } from '@/hooks/useDebounce';

interface ChangeBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    clubId: string;
}

export default function ChangeBookModal({ isOpen, onClose, clubId }: ChangeBookModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { data: searchResults, isLoading: isSearchLoading } = useBookSearch(debouncedSearchTerm, 1);

    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [showBookDropdown, setShowBookDropdown] = useState(false);

    const { mutate: addClubBook, isPending } = useAddClubBook();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBook) {
            alert('책을 선택해주세요.');
            return;
        }

        const bookData = {
            isbn: selectedBook.isbn13 || selectedBook.isbn,
            title: selectedBook.title,
            author: selectedBook.author,
            publisher: selectedBook.publisher,
            publishDate: selectedBook.pubDate,
            description: selectedBook.description,
            coverImage: selectedBook.cover,
            category: selectedBook.categoryName,
        };

        addClubBook({
            clubId,
            book: bookData,
        }, {
            onSuccess: () => {
                alert('책이 변경되었습니다.');
                setSelectedBook(null);
                setSearchTerm('');
                onClose();
            },
            onError: (err: any) => {
                alert(err.response?.data?.message || '책 변경 중 오류가 발생했습니다.');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-visible">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">새로운 책 추가하기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-visible">
                    <p className="text-sm text-gray-500">
                        주의: 현재 읽고 있는 책은 최대 3권까지 지정 가능합니다. 새 책 추가 후, 각 책마다 수동으로 완독/미완독 처리를 할 수 있습니다.
                    </p>

                    <div className="relative z-50">
                        <label className="block text-sm font-bold text-gray-700 mb-2">추가할 책 검색</label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowBookDropdown(true);
                                }}
                                onFocus={() => setShowBookDropdown(true)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="새로 읽을 책을 검색해보세요"
                            />
                        </div>

                        {/* 검색 드롭다운 */}
                        {showBookDropdown && searchTerm.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl max-h-60 overflow-y-auto z-50">
                                {isSearchLoading ? (
                                    <div className="p-4 text-center text-sm text-gray-500">검색 중...</div>
                                ) : (searchResults?.books?.length ?? 0) > 0 ? (
                                    <ul className="py-2">
                                        {searchResults?.books.map((book: any) => (
                                            <li
                                                key={book.isbn13 || book.isbn}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-3 items-center"
                                                onClick={() => {
                                                    setSelectedBook(book);
                                                    setSearchTerm(book.title);
                                                    setShowBookDropdown(false);
                                                }}
                                            >
                                                {book.cover ? (
                                                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                                                ) : (
                                                    <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center">
                                                        <Book className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-gray-900 line-clamp-1">{book.title}</div>
                                                    <div className="text-xs text-gray-500">{book.author}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
                                )}
                            </div>
                        )}

                        {/* 선택된 책 표시 */}
                        {selectedBook && !showBookDropdown && (
                            <div className="mt-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={selectedBook.cover} alt={selectedBook.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                                    <div>
                                        <div className="text-sm font-bold text-indigo-900 line-clamp-1">{selectedBook.title}</div>
                                        <div className="text-xs text-indigo-600 mt-0.5">{selectedBook.author}</div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => { setSelectedBook(null); setSearchTerm(''); }} className="px-3 py-1.5 text-xs bg-white text-indigo-600 font-bold rounded shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                    다시 선택
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!selectedBook || isPending}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? '추가 중...' : '이 책 추가하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

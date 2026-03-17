import React, { useState } from 'react';
import { X, Search, Book, Check } from 'lucide-react';
import { useCreateClub } from '@/hooks/queries/useClubs';
import { useBookSearch } from '@/hooks/queries/useBooks';
import { useDebounce } from '@/hooks/useDebounce';

interface CreateClubModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateClubModal({ isOpen, onClose }: CreateClubModalProps) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('10');
    const [meetingDayOfWeek, setMeetingDayOfWeek] = useState<number[]>([]);
    const [meetingTime, setMeetingTime] = useState('');
    const [bookChangeDay, setBookChangeDay] = useState('1');
    const [description, setDescription] = useState('');

    const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    // 이달의 책 검색 관련 상태
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { data: searchResults, isLoading: isSearchLoading } = useBookSearch(debouncedSearchTerm, 1);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [showBookDropdown, setShowBookDropdown] = useState(false);

    const { mutate: createClub, isPending } = useCreateClub();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let bookData = undefined;
        if (selectedBook) {
            bookData = {
                isbn: selectedBook.isbn13 || selectedBook.isbn,
                title: selectedBook.title,
                author: selectedBook.author,
                publisher: selectedBook.publisher,
                publishDate: selectedBook.pubDate,
                description: selectedBook.description,
                coverImage: selectedBook.cover,
                category: selectedBook.categoryName,
            };
        }

        createClub({
            name,
            capacity: parseInt(capacity),
            meetingDayOfWeek,
            meetingTime,
            bookChangeDay: parseInt(bookChangeDay),
            description,
            book: bookData,
        }, {
            onSuccess: () => {
                onClose();
            },
            onError: (err: any) => {
                alert(err.response?.data?.message || '모임 생성 중 오류가 발생했습니다.');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">새 독서모임 만들기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">모임 이름*</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="멋진 모임 이름을 지어주세요"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">모집 인원*</label>
                            <input
                                type="number"
                                required
                                min="2"
                                max="100"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">정기 모임일</label>
                            <div className="flex gap-2 mb-3">
                                {DAYS.map((day, idx) => (
                                    <button
                                        type="button"
                                        key={idx}
                                        onClick={() => {
                                            if (meetingDayOfWeek.includes(idx)) {
                                                setMeetingDayOfWeek(meetingDayOfWeek.filter(d => d !== idx));
                                            } else {
                                                setMeetingDayOfWeek([...meetingDayOfWeek, idx].sort());
                                            }
                                        }}
                                        className={`w-10 h-10 rounded-full font-bold transition-colors ${meetingDayOfWeek.includes(idx)
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="time"
                                value={meetingTime}
                                onChange={(e) => setMeetingTime(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">매월 몇 일에 새 책을 시작하나요? (책 교체일)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="31"
                            value={bookChangeDay}
                            onChange={(e) => setBookChangeDay(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="1~31 사이의 일을 입력하세요"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2">이달의 첫 책 선택</label>
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
                                placeholder="읽을 책을 검색해보세요"
                            />
                        </div>

                        {/* 검색 드롭다운 */}
                        {showBookDropdown && searchTerm.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl max-h-60 overflow-y-auto z-20">
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
                            <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={selectedBook.cover} alt={selectedBook.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                                    <div>
                                        <div className="text-sm font-bold text-indigo-900 line-clamp-1">{selectedBook.title}</div>
                                        <div className="text-xs text-indigo-600">{selectedBook.author}</div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => { setSelectedBook(null); setSearchTerm(''); }} className="p-1 px-3 text-xs bg-white text-indigo-600 font-bold rounded shadow-sm">
                                    변경
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">모임 소개*</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
                            placeholder="어떤 모임인지 자세히 설명해주세요. (주제, 진행 방식 등)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? '생성 중...' : '모임 만들기'}
                    </button>
                </form>
            </div>
        </div>
    );
}

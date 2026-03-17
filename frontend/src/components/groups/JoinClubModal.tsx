import React from 'react';
import { X, Users, BookOpen, Calendar } from 'lucide-react';
import { useJoinClub } from '@/hooks/queries/useClubs';

interface JoinClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    club: any;
}

export default function JoinClubModal({ isOpen, onClose, club }: JoinClubModalProps) {
    const { mutate: joinClub, isPending } = useJoinClub();

    if (!isOpen || !club) return null;

    const memberCount = club.members?.length || 0;
    const isFull = memberCount >= club.capacity;

    const handleJoin = () => {
        if (isFull) return;
        joinClub(club.id, {
            onSuccess: () => {
                alert('가입이 완료되었습니다!');
                onClose();
            },
            onError: (err: any) => {
                alert(err.response?.data?.message || '가입 중 오류가 발생했습니다.');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="relative">
                    {club.coverImage ? (
                        <img src={club.coverImage} className="w-full h-32 object-cover" alt="cover" />
                    ) : (
                        <div className="w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/30 transition-colors backdrop-blur-sm">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-black text-indigo-600">
                        {club.name?.charAt(0) || '📚'}
                    </div>
                </div>

                <div className="p-6 pt-12 space-y-6">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 mb-1">{club.name}</h2>
                        <p className="text-gray-500 text-sm whitespace-pre-wrap leading-relaxed">{club.description}</p>
                    </div>

                    <div className="flex flex-col gap-3 py-4 border-y border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Users className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">{memberCount}명</span> / {club.capacity}명 참여중
                                {isFull && <span className="ml-2 text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">정원 초과</span>}
                            </div>
                        </div>

                        {club.meetingDay && (
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-bold">정기 모임:</span> {club.meetingDay}
                                </div>
                            </div>
                        )}

                        {club.books && club.books.length > 0 && club.books[0].book && (
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">이달의 책:</span>
                                    <span className="truncate max-w-[150px] inline-block">{club.books[0].book.title}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleJoin}
                            disabled={isFull || isPending}
                            className="flex-[2] py-3.5 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? '가입 처리 중...' : isFull ? '정원 초과' : '참여 신청하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

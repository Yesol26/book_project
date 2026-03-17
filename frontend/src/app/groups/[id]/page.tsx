"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useClub, useClubRecords, useCreateClubRecord, useDeleteClubRecord, useDeleteClub, useUpdateClubBookStatus } from '@/hooks/queries/useClubs';
import Sidebar from '@/components/Sidebar';
import { Users, Calendar, BookOpen, Send, FileText, Plus, Trash2, ArrowLeft, MessageCircle, Library, CheckCircle2 } from 'lucide-react';
import ChangeBookModal from '@/components/groups/ChangeBookModal';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';

export default function ClubDetailPage() {
    const router = useRouter();
    const params = useParams();
    const clubId = params.id as string;

    const { user, isLoading: isUserLoading } = useAuth();
    const { data: club, isLoading: isClubLoading, error: clubError } = useClub(clubId);

    const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'records'>('info');

    const { mutate: deleteClub } = useDeleteClub();

    // 권한 체크: 로딩 완료 후, 유저가 멤버가 아니면 튕겨냄
    useEffect(() => {
        if (!isUserLoading && !isClubLoading) {
            if (clubError || !club) {
                alert('모임을 찾을 수 없습니다.');
                router.push('/groups');
                return;
            }

            const isMember = club.members?.some((m: any) => m.userId === user?.id);
            if (!isMember) {
                alert('모임 멤버만 접근할 수 있습니다.');
                router.push('/groups');
            }
        }
    }, [user, club, isUserLoading, isClubLoading, clubError, router]);

    const isOwner = club?.members?.find((m: any) => m.userId === user?.id)?.role === 'OWNER';

    if (isUserLoading || isClubLoading) {
        return <div className="p-10 text-center">로딩 중...</div>;
    }

    if (!user || !club) return null;


    const handleDeleteClub = () => {
        if (confirm('정말로 이 모임을 삭제하시겠습니까? 관련 데이터가 모두 삭제되며 복구할 수 없습니다.')) {
            deleteClub(clubId, {
                onSuccess: () => {
                    alert('모임이 삭제되었습니다.');
                    router.push('/groups');
                },
                onError: (err: any) => alert(err.response?.data?.message || '모임 삭제 실패')
            });
        }
    };

    return (
        <div className="flex flex-1 h-screen overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
                <header className="bg-white px-8 py-5 border-b border-gray-100 shrink-0">
                    <div className="max-w-7xl mx-auto flex items-center gap-4">
                        <button onClick={() => router.push('/groups')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">{club.name}</h1>
                            <p className="text-sm text-gray-500 line-clamp-1">{club.description}</p>
                        </div>
                        {isOwner && (
                            <div className="ml-auto">
                                <button onClick={handleDeleteClub} className="text-red-500 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors">
                                    모임 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="bg-white border-b border-gray-100 shrink-0">
                    <div className="max-w-7xl mx-auto px-8 flex gap-8">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`py-4 font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            기본 정보
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`py-4 font-bold border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            오픈채팅
                        </button>
                        <button
                            onClick={() => setActiveTab('records')}
                            className={`py-4 font-bold border-b-2 transition-colors ${activeTab === 'records' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            모임 기록/공지
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto p-8 w-full h-full">
                        {activeTab === 'info' && <ClubInfoTab clubId={club.id} club={club} isOwner={isOwner} />}
                        {activeTab === 'chat' && <ClubChatTab clubId={club.id} userId={user.id} userName={user.name!} />}
                        {activeTab === 'records' && <ClubRecordsTab clubId={club.id} isOwner={isOwner} userId={user.id} />}
                    </div>
                </div>
            </main>
        </div>
    );
}

// 1. 정보 탭
function ClubInfoTab({ clubId, club, isOwner }: { clubId: string; club: any; isOwner: boolean }) {
    const { mutate: updateBookStatus } = useUpdateClubBookStatus();
    const [isChangeBookOpen, setIsChangeBookOpen] = useState(false);

    const handleUpdateStatus = (bookId: string, status: 'COMPLETED' | 'EXPIRED') => {
        const text = status === 'COMPLETED' ? '완독' : '미완독';
        if (confirm(`이 책을 [${text}] 처리하시겠습니까?`)) {
            updateBookStatus({ clubId, bookId, status }, {
                onSuccess: () => alert(`${text} 처리되었습니다.`),
                onError: (err: any) => alert(err.response?.data?.message || '실패')
            });
        }
    };

    const currentBooks = club.books?.filter((b: any) => b.status === 'READING') || [];
    const historyBooks = club.books?.filter((b: any) => b.status === 'COMPLETED' || b.status === 'EXPIRED') || [];
    const ownerMember = club.members?.find((m: any) => m.role === 'OWNER');
    const now = new Date();

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">모임 소개</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{club.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">참여 인원</div>
                        <div className="font-bold text-gray-900">{club.members?.length || 0} / {club.capacity}명</div>
                    </div>
                </div>

                {ownerMember?.user && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="shrink-0">
                            {ownerMember.user.profileImage ? (
                                <img
                                    src={ownerMember.user.profileImage}
                                    alt={ownerMember.user.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg ring-2 ring-amber-200">
                                    {ownerMember.user.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded border border-amber-200">모임장</span>
                            </div>
                            <div className="font-bold text-gray-900">{ownerMember.user.name}</div>
                        </div>
                    </div>
                )}

                {(club.meetingDayOfWeek || club.meetingTime) && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">정기 모임일</div>
                            <div className="font-bold text-gray-900">
                                {club.meetingDayOfWeek ? (() => {
                                    const days = ['일', '월', '화', '수', '목', '금', '토'];
                                    const selectedDays = club.meetingDayOfWeek.split(',').map((d: string) => days[parseInt(d)]);
                                    return `매주 ${selectedDays.join(', ')}요일`;
                                })() : ''}
                                {club.meetingTime ? ` ${club.meetingTime}` : ''}
                                {!club.meetingDayOfWeek && !club.meetingTime && club.meetingDay ? club.meetingDay : ''}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" /> 현재 읽고 있는 책
                            <span className="text-sm font-normal text-indigo-500 ml-2">({currentBooks.length}/3)</span>
                        </h3>
                    </div>
                    {isOwner && (
                        <div className="flex gap-2 relative">
                            <button
                                onClick={() => setIsChangeBookOpen(true)}
                                disabled={currentBooks.length >= 3}
                                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> 책 추가
                            </button>
                            {currentBooks.length >= 3 && (
                                <div className="absolute top-full right-0 mt-2 whitespace-nowrap text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                                    최대 3권까지 지정 가능합니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {currentBooks.map((currentBookLine: any) => {
                    const isPastEndDate = currentBookLine.endDate && new Date(currentBookLine.endDate) < now;
                    return (
                        <div key={currentBookLine.id} className="mb-6 last:mb-0 pb-6 border-b border-gray-100 last:border-0 relative z-10 flex gap-4">
                            {currentBookLine.book.coverImage ? (
                                <img src={currentBookLine.book.coverImage} className="w-24 h-36 object-cover rounded shadow-md border border-gray-100" alt="cover" />
                            ) : (
                                <div className="w-24 h-36 bg-gray-100 rounded shadow-md border border-gray-200 flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col">
                                {isOwner && isPastEndDate && (
                                    <div className="mb-2 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg self-start">
                                        ⚠️ 설정한 책 교체일이 지났습니다. 완독 또는 미완독 처리 후 새 책을 추가하세요.
                                    </div>
                                )}
                                <h4 className="font-bold text-xl mb-1 text-gray-900">{currentBookLine.book.title}</h4>
                                <div className="text-indigo-600 text-sm font-medium">{currentBookLine.book.author}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(currentBookLine.startDate).toLocaleDateString('ko-KR')}
                                    {currentBookLine.endDate ? ` ~ ${new Date(currentBookLine.endDate).toLocaleDateString('ko-KR')} 목표` : ' 시작'}
                                </div>
                                <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed mb-auto">{currentBookLine.book.description}</p>

                                {isOwner && (
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={() => handleUpdateStatus(currentBookLine.id, 'COMPLETED')} className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> 완독
                                        </button>
                                        <button onClick={() => handleUpdateStatus(currentBookLine.id, 'EXPIRED')} className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                                            <Trash2 className="w-3.5 h-3.5" /> 미완독
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {currentBooks.length === 0 && (
                    <div className="py-10 text-center text-gray-500 font-medium relative z-10">
                        현재 지정된 책이 없습니다.<br />새로운 책을 추가해보세요.
                    </div>
                )}
            </div>

            {historyBooks.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Library className="w-5 h-5 text-gray-500" /> 독서 히스토리
                    </h3>
                    <div className="space-y-4">
                        {historyBooks.map((hb: any) => (
                            <div key={hb.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative">
                                {hb.status === 'COMPLETED' && (
                                    <div className="absolute top-4 right-4 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                                        완독 완료
                                    </div>
                                )}
                                {hb.status === 'EXPIRED' && (
                                    <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded border border-gray-300">
                                        미완독
                                    </div>
                                )}

                                {hb.book.coverImage ? (
                                    <img src={hb.book.coverImage} className="w-16 h-24 object-cover rounded shadow-sm opacity-80" alt="cover" />
                                ) : (
                                    <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-md text-gray-800 pr-16">{hb.book.title}</h4>
                                    <div className="text-xs text-gray-500 mt-1 mb-2">
                                        {new Date(hb.startDate).toLocaleDateString('ko-KR')} ~ {hb.completedAt ? new Date(hb.completedAt).toLocaleDateString('ko-KR') : hb.endDate ? new Date(hb.endDate).toLocaleDateString('ko-KR') : ''}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2">{hb.book.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ChangeBookModal isOpen={isChangeBookOpen} onClose={() => setIsChangeBookOpen(false)} clubId={clubId} />
        </div>
    );
}

// 2. 채팅 탭
function ClubChatTab({ clubId, userId, userName }: { clubId: string; userId: string; userName: string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        connectSocket();
        const socket = getSocket();

        socket.emit('join-club', clubId);

        const handleNewMessage = (data: any) => {
            setMessages(prev => [...prev, data]);
        };

        socket.on('new-message', handleNewMessage);

        return () => {
            socket.emit('leave-club', clubId);
            socket.off('new-message', handleNewMessage);
        };
    }, [clubId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const socket = getSocket();
        socket.emit('send-message', {
            clubId,
            userId,
            userName,
            message: input,
            createdAt: new Date().toISOString()
        });

        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-250px)] max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> 실시간 오픈채팅
                </h3>
                <p className="text-xs text-indigo-600 mt-1">모임원들과 자유롭게 대화를 나누세요.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">첫 메시지를 보내보세요!</div>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.userId === userId;
                    return (
                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs text-gray-500 mb-1 ml-1">{msg.userName}</span>
                            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] break-words shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="메시지를 입력하세요..."
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

// 3. 기록 탭
function ClubRecordsTab({ clubId, isOwner, userId }: { clubId: string; isOwner: boolean; userId: string }) {
    const { data: records = [], isLoading } = useClubRecords(clubId);
    const { mutate: createRecord, isPending: isCreating } = useCreateClubRecord();
    const { mutate: deleteRecord } = useDeleteClubRecord();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isNotice, setIsNotice] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalTitle = title;
        if (isNotice && isOwner) {
            finalTitle = `[공지] ${title}`;
        }

        createRecord({
            clubId,
            data: { title: finalTitle, content, isNotice: isOwner ? isNotice : false }
        }, {
            onSuccess: () => {
                setIsFormOpen(false);
                setTitle('');
                setContent('');
                setIsNotice(false);
            },
            onError: (err: any) => alert(err.response?.data?.message || '오류 발생')
        });
    };

    const handleDelete = (recordId: string) => {
        if (confirm('정말로 이 기록을 삭제하시겠습니까?')) {
            deleteRecord({ clubId, recordId }, {
                onError: (err: any) => alert(err.response?.data?.message || '삭제 권한이 없습니다.')
            });
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" /> 모임 기록게시판
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">공지사항이나 모임 일지를 남겨주세요.</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> 글쓰기
                    </button>
                )}
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 relative">
                    <h4 className="font-bold text-gray-900 mb-2">새 글 작성</h4>

                    {isOwner && (
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" id="notice" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                            <label htmlFor="notice" className="text-sm font-bold text-gray-700 select-none cursor-pointer">공지사항으로 등록</label>
                        </div>
                    )}

                    <input
                        required placeholder="제목을 입력하세요"
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    <textarea
                        required placeholder="내용을 입력하세요"
                        value={content} onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 resize-none"
                    />

                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">취소</button>
                        <button type="submit" disabled={isCreating} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                            {isCreating ? '등록 중...' : '등록하기'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center text-gray-500 p-10">불러오는 중...</div>
                ) : records.length > 0 ? (
                    records.map((r: any) => (
                        <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors">
                            <div className="flex justify-between gap-4">
                                <h4 className={`text-lg font-bold mb-2 flex items-center gap-2 ${r.title.includes('[공지]') ? 'text-rose-600' : 'text-gray-900'}`}>
                                    {r.title}
                                </h4>

                                {(isOwner || r.authorId === userId) && (
                                    <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 max-h-10">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed mb-4">{r.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <span className="font-medium text-gray-600">{r.author?.name || '알수없음'}</span>
                                <span>{new Date(r.createdAt).toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-500 flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-200 mb-4" />
                        아직 등록된 기록이 없습니다.<br />첫 번째 기록을 남겨보세요!
                    </div>
                )}
            </div>
        </div>
    );
}

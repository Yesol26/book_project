"use client";

import React, { useState } from 'react';
import {
  Users, Search, Plus, Calendar, MessageSquare,
  MessageCircle, BookOpen, ChevronRight, Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useClubs } from '@/hooks/queries/useClubs';
import { useAuth } from '@/hooks/useAuth';
import CreateClubModal from '@/components/groups/CreateClubModal';
import JoinClubModal from '@/components/groups/JoinClubModal';
import ClubCalendar from '@/components/groups/ClubCalendar';

export default function GroupsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: allClubs = [], isLoading } = useClubs();

  const [activeTab, setActiveTab] = useState('recruiting');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClubForJoin, setSelectedClubForJoin] = useState<any | null>(null);

  // 현재 사용자가 참여 중인 모임 필터링
  const myGroups = allClubs.filter((club: any) =>
    club.members?.some((m: any) => m.userId === user?.id)
  );

  // 전체 클럽 목록 (가입한 클럽 포함 여부는 선택사항. 여기서는 전체 노출 또는 미가입 모임만 노출할 수도 있음)
  const trendingGroups = allClubs;

  // "내 독서모임" 리스트 클릭 시 이동
  const handleMyGroupClick = (clubId: string) => {
    router.push(`/groups/${clubId}`);
  };

  // "참여 신청" 또는 "오픈 채팅" 버튼 클릭 핸들러
  const handleClubAction = (club: any) => {
    const isMember = club.members?.some((m: any) => m.userId === user?.id);
    if (isMember) {
      // 이미 멤버면 해당 모임 상세 페이지로 이동 (오픈채팅 등 이용)
      router.push(`/groups/${club.id}`);
    } else {
      // 멤버가 아니면 가입 모달 오픈
      setSelectedClubForJoin(club);
    }
  };

  return (
    <div className="flex flex-1">
      <Sidebar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* 상단 헤더 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">독서 모임</h1>
            <p className="text-gray-500 text-sm mt-1">함께 읽고 토론하며 생각을 나눠보세요.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="관심 있는 모임 검색"
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm outline-none"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus className="w-4 h-4" /> 모임 생성
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> 나의 독서모임
              </h3>
              <div className="space-y-3">
                {myGroups.length > 0 ? myGroups.map((group: any) => (
                  <div
                    key={group.id}
                    onClick={() => handleMyGroupClick(group.id)}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors border border-transparent hover:border-indigo-100 group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700 truncate">{group.name}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 text-center py-4">가입한 모임이 없습니다.</div>
                )}
              </div>
            </section>

            <ClubCalendar myGroups={myGroups} />
          </aside>

          <section className="lg:col-span-3 space-y-8">
            <div className="flex gap-6 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('recruiting')}
                className={`pb-4 text-sm font-bold transition-all ${activeTab === 'recruiting' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
              >
                참여 가능한 모임
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-10 text-center text-gray-500 font-medium">모임 목록을 불러오는 중입니다...</div>
              ) : trendingGroups.length > 0 ? (
                trendingGroups.map((group: any) => {
                  const isMember = group.members?.some((m: any) => m.userId === user?.id);
                  const isOwner = group.members?.some((m: any) => m.userId === user?.id && m.role === 'OWNER');
                  const ownerMember = group.members?.find((m: any) => m.role === 'OWNER');
                  const isFull = group.members?.length >= group.capacity;

                  return (
                    <div key={group.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            {isOwner ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded border border-amber-200">모임장</span>
                            ) : isMember ? (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded">참여중</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded">모집중</span>
                            )}
                            <h4 className="font-bold text-gray-900">{group.name}</h4>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{group.description}</p>
                          <div className="flex flex-wrap gap-4 pt-2">
                            {group.books && group.books.length > 0 && group.books[0].book && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <BookOpen className="w-3.5 h-3.5" /> 이달의 책: <span className="font-medium text-gray-700 text-xs truncate max-w-[120px]">{group.books[0].book.title}</span>
                              </div>
                            )}
                            {(group.meetingDayOfWeek || group.meetingTime || group.meetingDay) && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {group.meetingDayOfWeek ? (() => {
                                  const days = ['일', '월', '화', '수', '목', '금', '토'];
                                  const selectedDays = group.meetingDayOfWeek.split(',').map((d: string) => days[parseInt(d)]);
                                  return `매주 ${selectedDays.join(', ')}요일`;
                                })() : group.meetingDay}
                                {group.meetingTime ? ` ${group.meetingTime}` : ''}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Users className="w-3.5 h-3.5" /> {group.members?.length || 0} / {group.capacity}명
                              {isFull && !isMember && <span className="ml-1 text-[10px] font-bold text-red-500">(정원 초과)</span>}
                            </div>
                            {ownerMember?.user && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                {ownerMember.user.profileImage ? (
                                  <img src={ownerMember.user.profileImage} alt="" className="w-4 h-4 rounded-full object-cover" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                                    {ownerMember.user.name?.[0]}
                                  </div>
                                )}
                                <span>모임장: {ownerMember.user.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2 justify-center">
                          <button
                            onClick={() => handleClubAction(group)}
                            disabled={isFull && !isMember}
                            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-colors ${isMember
                              ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                              : isFull
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                              }`}
                          >
                            {isMember ? '상세 및 채팅하기' : isFull ? '정원 초과' : '참여 신청'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-gray-500 font-medium">현재 등록된 모임이 없습니다. 첫 모임을 생성해보세요!</div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4">
              <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden group flex items-center justify-between">
                <div className="relative z-10 w-full flex justify-between items-center">
                  <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Hash className="w-4 h-4" /> 나만의 독서 모임을 운영해보는 건 어떨까요?
                    </h4>
                    <p className="text-indigo-100 text-xs">내가 원하는 책, 관심 있는 주제, 맞는 인원을 직접 정할 수 있어요.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shrink-0 max-w-fit align-middle ml-4"
                  >
                    지금 모임 만들기
                  </button>
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* 모달 */}
      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <JoinClubModal
        isOpen={!!selectedClubForJoin}
        onClose={() => setSelectedClubForJoin(null)}
        club={selectedClubForJoin}
      />
    </div>
  );
}
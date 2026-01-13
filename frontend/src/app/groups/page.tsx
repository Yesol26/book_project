"use client";

import React, { useState } from 'react';
import { 
  Users, Search, Plus, Calendar, MessageSquare, 
  MessageCircle, BookOpen, ChevronRight, Hash 
} from 'lucide-react';
import Navbar from '@/components/Navar';
// --- 가짜 데이터 (모임 목록) ---
const myGroups = [
  { id: 1, name: '백석독모회', nextMeeting: '2024-01-20', newMessages: 3 },
  { id: 2, name: '건전모', nextMeeting: '2024-01-25', newMessages: 0 },
];

const trendingGroups = [
  { id: 3, name: '책읽자! 독모장: 임석구', description: '매주 일요일 저녁 8시, 인문학 서적을 읽고 토론합니다.', members: 12 },
  { id: 4, name: '새벽 독서단', description: '미라클 모닝과 함께하는 독서 모임', members: 45 },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState('recruiting');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* 상단 헤더: 모임 생성 및 검색 */}
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
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" /> 모임 생성
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 좌측: 나의 독서모임 & 캘린더 (와이어프레임 좌측 사이드바) */}
          <aside className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> 나의 독서모임
              </h3>
              <div className="space-y-3">
                {myGroups.map(group => (
                  <div key={group.id} className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors border border-transparent hover:border-indigo-100 group">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">{group.name}</span>
                      {group.newMessages > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{group.newMessages}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 일정 관리 영역 (간이 캘린더) */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm">2025년 12월</h3>
                <div className="flex gap-2 text-gray-400">
                  <ChevronRight className="w-4 h-4 rotate-180 cursor-pointer" />
                  <ChevronRight className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 font-medium text-gray-400">
                {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* 간이 날짜 표시 루프 */}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className={`py-1 text-[11px] rounded-md transition-colors cursor-pointer ${i + 1 === 17 ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100">
                일정 추가
              </button>
            </section>
          </aside>

          {/* 중앙/우측: 모임 탐색 및 상세 섹션 (와이어프레임 메인 영역) */}
          <section className="lg:col-span-3 space-y-8">
            {/* 탭 메뉴 */}
            <div className="flex gap-6 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('recruiting')}
                className={`pb-4 text-sm font-bold transition-all ${activeTab === 'recruiting' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
              >
                독서 모임 모집중
              </button>
              <button 
                onClick={() => setActiveTab('active')}
                className={`pb-4 text-sm font-bold transition-all ${activeTab === 'active' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
              >
                진행중인 토론
              </button>
            </div>

            {/* 모임 카드 리스트 (와이어프레임 중앙 리스트 영역) */}
            <div className="space-y-4">
              {trendingGroups.map(group => (
                <div key={group.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded">신규 모임</span>
                        <h4 className="font-bold text-gray-900">{group.name}</h4>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{group.description}</p>
                      
                      {/* 모임 정보 태그 */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <BookOpen className="w-3.5 h-3.5" /> 이달의 책: <span className="font-medium text-gray-700 text-xs">불편한 편의점</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" /> 매주 토요일
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Users className="w-3.5 h-3.5" /> {group.members}명 참여중
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 justify-center">
                      <button className="flex-1 md:flex-none px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
                        참여 신청
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" /> 오픈 채팅
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 기능 프리뷰 섹션 (토론 게시판 / 실시간 채팅) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" /> 토론 게시판
                  </h4>
                  <p className="text-indigo-100 text-xs mb-4">읽고 있는 책에 대해 자유롭게 의견을 남겨보세요.</p>
                  <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                    전체 보기
                  </button>
                </div>
                <MessageCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">실시간 채팅</h4>
                  <p className="text-gray-400 text-xs">모임원들과 실시간으로 소통하세요.</p>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      U{i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    +5
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
"use client";

import React from 'react';
import { Book, Calendar, Star, ChevronRight, BarChart3, PlusCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Sidebar from '@/components/Sidebar';

// --- 가짜 데이터 (Statistics) ---
const monthlyData = [
  { month: '1월', count: 4 }, { month: '2월', count: 7 }, { month: '3월', count: 5 },
  { month: '4월', count: 8 }, { month: '5월', count: 6 }, { month: '6월', count: 3 },
];

// --- 1. 독서 잔디밭 컴포넌트 ---
const ReadingGrass = () => {
  const grassData = Array.from({ length: 150 }, () => Math.floor(Math.random() * 4));

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" /> 독서 기록 잔디밭
        </h3>
        <span className="text-xs text-gray-400">최근 5개월간의 기록</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {grassData.map((level, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-[2px] ${level === 0 ? 'bg-gray-100' :
              level === 1 ? 'bg-indigo-200' :
                level === 2 ? 'bg-indigo-400' : 'bg-indigo-600'
              }`}
            title={`Level ${level}`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-end items-center gap-2 text-[10px] text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-100 rounded-sm" />
          <div className="w-2 h-2 bg-indigo-200 rounded-sm" />
          <div className="w-2 h-2 bg-indigo-600 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// --- 2. 도서 카드 컴포넌트 ---
const MyBookCard = ({ title, author, rating }: { title: string; author: string; rating: number }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 relative overflow-hidden group">
      Book Cover
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
      <p className="text-xs text-gray-500">{author}</p>
      <div className="flex items-center gap-1 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
        ))}
      </div>
      <button className="w-full mt-3 py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg transition-colors border border-indigo-100">
        리뷰 작성하기
      </button>
    </div>
  </div>
);

// --- 메인 서재 페이지 컴포넌트 ---
export default function MyLibrary() {
  return (
    <div className="flex flex-1">
      {/* 사이드바 — 접기/펼치기 가능, 기본 닫힘 */}
      <Sidebar />


      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* 상단 프로필 헤더 */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900">예솔님의 서재</h1>
            <p className="text-gray-500 text-sm mt-1">올해 벌써 24권의 책을 읽으셨네요! 👏</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <PlusCircle className="w-4 h-4" /> 읽은 책 등록
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 현재 읽고 있는 책 */}
          <section className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
              현재 읽고 있는 책
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-24 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-[10px] font-bold text-indigo-600 mb-1">독서중 (65%)</p>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">불편한 편의점</h4>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1">
                      <div className="bg-indigo-500 h-full rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 bg-gray-50 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors">
                더보기
              </button>
            </div>
          </section>

          {/* 오른쪽: 통계 및 잔디밭 */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 통계 차트 영역 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" /> 월별 독서 통계
                </h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <ReadingGrass />
            </div>

            {/* 하단: 독서 기록함 / 위시리스트 탭 */}
            <section>
              <div className="flex gap-6 border-b border-gray-100 mb-6">
                <button className="pb-4 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600">독서 기록함</button>
                <button className="pb-4 text-sm font-medium text-gray-400 hover:text-gray-600">위시리스트</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                <MyBookCard title="가재가 노래하는 곳" author="델리아 오언" rating={5} />
                <MyBookCard title="물고기는 존재하지 않는다" author="룰루 밀러" rating={4} />
                <MyBookCard title="미드나잇 라이브러리" author="매트 헤이그" rating={5} />
                <MyBookCard title="지구 끝의 온기" author="김초엽" rating={4} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
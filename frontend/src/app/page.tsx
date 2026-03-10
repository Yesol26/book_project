"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Search, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import HomeBestseller from '@/components/books/HomeBestseller';

// --- 서브 컴포넌트: 도서 카드 ---
const BookCard = ({ title, author, category }: { title: string; author: string; category?: string }) => (
  <div className="min-w-[160px] group cursor-pointer">
    <div className="relative aspect-[3/4] bg-white rounded-xl mb-3 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 italic text-xs p-4 text-center">
        {title}
      </div>
      {category && (
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 rounded-full font-bold text-indigo-600">
          {category}
        </span>
      )}
    </div>
    <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{author}</p>
  </div>
);

// --- 메인 홈 컴포넌트 ---
export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed.length > 0) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&page=1`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-1">
      {/* 1. 사이드바 — 메인홈에서는 항상 열림 */}
      <Sidebar />


      {/* 2. 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col overflow-x-hidden">

        {/* 메인 콘텐츠 스크롤 영역 */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-12">

          {/* 히어로 배너 */}
          <section className="relative w-full h-[320px] bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200 flex items-center px-12 text-white">
            <div className="z-10 max-w-md">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block backdrop-blur-sm">NEW TREND</span>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                지금 지쳤나요?<br />독서로 회복하세요.
              </h2>
              <p className="text-indigo-100 mb-8">하루 15분, 당신의 마음을 채우는 가장 쉬운 방법</p>
              <Link
                href="/search"
                className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                도서 검색하기
              </Link>
            </div>

            <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[400px] bg-white/10 rounded-full blur-3xl" />
            <div className="absolute right-12 bottom-0 w-1/3 h-[85%] bg-white/20 rounded-t-2xl backdrop-blur-md border border-white/30 hidden lg:flex items-center justify-center">
              <div className="text-white/50 text-6xl rotate-12 font-black italic">BOOK ART</div>
              <div className="absolute bottom-4 right-4 bg-black/30 px-3 py-1 rounded-full text-xs font-mono">01 / 03</div>
            </div>
          </section>

          {/* 도서 섹션 1: 내가 읽고 있는 책 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                내가 읽고 있는 책
              </h3>
              <button className="text-sm text-indigo-600 font-medium">전체보기</button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
              <BookCard title="마흔에 읽는 쇼펜하우어" author="강용수" category="인문" />
              <BookCard title="세이노의 가르침" author="세이노" category="자기계발" />
              <BookCard title="모순" author="양귀자" category="소설" />
              <BookCard title="도둑맞은 집중력" author="요한 하리" category="사회" />
            </div>
          </section>

          {/* 도서 섹션 2: 추천 장르 */}
          <section className="bg-indigo-50/50 -mx-8 px-8 py-12 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">당신을 위한 추천 장르</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-indigo-600 hover:text-white transition-all"><Menu className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BookCard key={i} title={`추천 도서 제목 ${i}`} author={`작가 이름 ${i}`} />
              ))}
            </div>
          </section>

          {/* 베스트셀러 순위 섹션 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <HomeBestseller />
          </div>

        </div>
      </main>
    </div>
  );
}

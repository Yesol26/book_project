"use client";

import React, { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { Search, Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import HomeBestseller from '@/components/books/HomeBestseller';
import { useBestsellers } from '@/hooks/queries/useBooks';
import { getHighQualityCover } from '@/lib/utils/image';
import { AladinBook } from '../../../types/aladin';

// --- 서브 컴포넌트: 도서 카드 (실제 API 데이터) ---
const BookCard = ({ book, category }: { book: AladinBook; category?: string }) => {
  const coverUrl = getHighQualityCover(book.cover);
  return (
    <div className="w-[160px] flex-shrink-0 group cursor-pointer">
      <div
        className="relative aspect-[3/4] mb-3 overflow-hidden rounded-r-md group-hover:-translate-y-1 transition-all duration-300"
        style={{ boxShadow: '-4px 4px 12px rgba(0,0,0,0.22)' }}
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="160px"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 italic text-xs p-4 text-center">
            {book.title}
          </div>
        )}
        {category && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 rounded-full font-bold text-indigo-600">
            {category}
          </span>
        )}
      </div>
      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title}</h4>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{book.author}</p>
    </div>
  );
};

// --- 서브 컴포넌트: 도서 카드 스켈레톤 ---
const BookCardSkeleton = () => (
  <div className="w-[160px] flex-shrink-0 animate-pulse">
    <div className="aspect-[3/4] bg-gray-200 rounded-r-md mb-3" style={{ boxShadow: '-4px 4px 12px rgba(0,0,0,0.08)' }} />
    <div className="h-3.5 bg-gray-200 rounded w-4/5 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-3/5" />
  </div>
);

// --- 서브 컴포넌트: 히어로 배너 책 3권 ---
const HeroBookStack = ({ books }: { books: AladinBook[] }) => {
  const rotates = ['-8deg', '0deg', '8deg'];
  const zIndexes = [10, 20, 10];

  return (
    <div className="absolute right-12 bottom-0 h-[85%] hidden lg:flex items-end justify-center gap-[-16px]">
      {books.slice(0, 3).map((book, i) => {
        const coverUrl = getHighQualityCover(book.cover);
        return (
          <Link
            key={book.itemId}
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[110px] h-[160px] flex-shrink-0 -mx-3 hover:scale-105 transition-transform duration-300"
            style={{
              transform: `rotate(${rotates[i]})`,
              zIndex: zIndexes[i],
            }}
          >
            <div
              className="w-full h-full overflow-hidden rounded-r-md"
              style={{ boxShadow: '-4px 4px 14px rgba(0,0,0,0.35)' }}
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="110px"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-white/60 text-xs p-2 text-center" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

// --- 메인 홈 컴포넌트 ---
export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 베스트셀러 훅 — 히어로 배너 + "내가 읽고 있는 책" 공용
  const { data: bestsellers, isLoading } = useBestsellers(1, 'Book');
  const books = bestsellers?.books ?? [];

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

            {/* 배경 블러 오브 */}
            <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[400px] bg-white/10 rounded-full blur-3xl" />

            {/* 히어로 배너 — 베스트셀러 책 3권 비스듬히 */}
            {books.length >= 3 && <HeroBookStack books={books} />}
          </section>

          {/* 도서 섹션 1: 내가 읽고 있는 책 → useBestsellers 연결 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                지금 인기있는 책
              </h3>
              <Link href="/rankings" className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline">
                전체보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
                : books.slice(0, 8).map((book) => (
                  <BookCard
                    key={book.itemId}
                    book={book}
                    category={book.categoryName?.split('>').pop()?.trim()}
                  />
                ))
              }
            </div>
          </section>

          {/* 도서 섹션 2: 추천 장르 — 섹션 스타일 통일 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full" />
                당신을 위한 추천 장르
              </h3>
              <Link href="/rankings" className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline">
                전체보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
                : books.slice(3, 9).map((book) => (
                  <BookCard
                    key={book.itemId}
                    book={book}
                    category={book.categoryName?.split('>').pop()?.trim()}
                  />
                ))
              }
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

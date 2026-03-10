"use client";

import React, { useState, KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: '메인 홈', href: '/' },
    { name: '도서 순위', href: '/rankings' },
    { name: '도서 검색', href: '/search' },
    { name: '내 서재', href: '/recordBook' },
    { name: '모임 활동', href: '/groups' },
  ];

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
    <nav className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-[50] px-8 flex items-center justify-between">
      {/* 1. 로고 영역 */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            독서 클럽
          </span>
        </Link>

        {/* 2. 메인 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-5 text-sm font-bold transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. 우측 유틸리티 영역 */}
      <div className="flex items-center gap-5">
        <div className="relative hidden lg:block">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-indigo-500 transition-colors"
            onClick={handleSearch}
          />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="책 제목, 저자 검색"
            className="bg-gray-100 border-none rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 w-48 transition-all focus:w-64 outline-none"
          />
        </div>
        <button className="text-gray-400 hover:text-indigo-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block" />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block group-hover:text-indigo-600 transition-colors">
            예솔님
          </span>
        </div>
      </div>
    </nav>
  );
}
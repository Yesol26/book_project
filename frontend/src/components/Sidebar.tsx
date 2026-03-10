"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const categories = [
    "소설", "세계문학전집", "경제경영", "자기계발", "IT",
    "외국어", "에세이", "여행", "라이프스타일", "부모", "어린이", "인문"
];

export default function Sidebar() {
    const router = useRouter();

    const handleCategory = (cat: string) => {
        router.push(`/search?q=${encodeURIComponent(cat)}&page=1`);
    };

    return (
        <aside className="w-44 flex-shrink-0 border-r border-gray-200 bg-white/60 backdrop-blur-md sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block p-4">
            <nav>
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    분야별 카테고리
                </h3>
                <ul className="space-y-0.5">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => handleCategory(cat)}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

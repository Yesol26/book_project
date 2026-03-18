"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 위시리스트에 저장될 책의 핵심 정보 타입
export interface WishlistBook {
  itemId: number | string;
  title: string;
  author: string;
  cover: string;
}

interface WishlistContextType {
  wishlist: WishlistBook[];
  toggleWishlist: (book: WishlistBook) => void;
  isWishlisted: (itemId: number | string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// 유틸 함수: JWT 토큰에서 로그인한 유저의 ID를 추출합니다.
const getUserIdFromToken = () => {
  if (typeof window === 'undefined') return 'guest';
  const token = localStorage.getItem('token');
  if (!token) return 'guest';
  try {
    // JWT의 payload(두 번째 부분)를 디코딩합니다.
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.userId || 'guest';
  } catch (e) {
    return 'guest';
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string>(() => getUserIdFromToken());

  const [wishlist, setWishlist] = useState<WishlistBook[]>(() => {
    // 클라이언트 사이드에서만 localStorage에 접근
    if (typeof window === 'undefined') {
      return [];
    }
    const currentUserId = getUserIdFromToken();
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${currentUserId}`);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("위시리스트 로딩 실패:", error);
      return [];
    }
  });

  // 라우팅(페이지 이동)될 때 로그인한 유저가 바뀌었는지 감지하여 위시리스트 분리
  useEffect(() => {
    const currentUserId = getUserIdFromToken();
    if (currentUserId !== userId) {
      setUserId(currentUserId);
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${currentUserId}`);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      } catch (error) {
        setWishlist([]);
      }
    }
  }, [pathname, userId]);

  // 위시리스트가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    const currentUserId = getUserIdFromToken();
    localStorage.setItem(`wishlist_${currentUserId}`, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (book: WishlistBook) => {
    setWishlist((prev) => {
      const exists = prev.some((b) => b.itemId === book.itemId);
      return exists ? prev.filter((b) => b.itemId !== book.itemId) : [book, ...prev];
    });
  };

  const isWishlisted = (itemId: number | string) => {
    return wishlist.some((b) => b.itemId === itemId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist는 WishlistProvider 내부에서 사용해야 합니다.');
  }
  return context;
};

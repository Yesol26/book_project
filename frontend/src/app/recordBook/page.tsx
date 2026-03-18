"use client";

import React, { useState, useEffect } from 'react';
import { Book, Calendar, Star, ChevronRight, BarChart3, PlusCircle, X, Heart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useWishlist } from '@/contexts/WishlistContext';
import Sidebar from '@/components/Sidebar';

// --- 가짜 데이터 (Statistics) ---
const monthlyData = [
  { month: '1월', count: 4 }, { month: '2월', count: 7 }, { month: '3월', count: 5 },
  { month: '4월', count: 8 }, { month: '5월', count: 6 }, { month: '6월', count: 3 },
];

// --- 1. 독서 잔디밭 컴포넌트 ---
const ReadingGrass = () => {
  // 초기 렌더링(서버 및 첫 클라이언트 렌더) 시에는 모두 0(회색)으로 맞춥니다.
  const [grassData, setGrassData] = useState<number[]>(Array.from({ length: 150 }, () => 0));

  useEffect(() => {
    setGrassData(Array.from({ length: 150 }, () => Math.floor(Math.random() * 4)));
  }, []);

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

// --- 2. 도서 카드 컴포넌트 (5순위: 별점 보라색으로 통일) ---
const MyBookCard = ({ title, author, rating, isWishlist, onToggleWishlist, onReviewClick }: { title: string; author: string; rating: number; isWishlist?: boolean; onToggleWishlist?: () => void; onReviewClick?: () => void }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    {/* [6순위] 책 모양 효과: BookCard/HomeBestseller와 동일한 스타일 */}
    <div
      className="aspect-[3/4] bg-gray-100 rounded-r-md mb-3 flex items-center justify-center text-gray-400 relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 group"
      style={{ boxShadow: '-3px 4px 12px rgba(0,0,0,0.25)' }}
    >
      Book Cover
      {/* 하트 버튼 (마우스 오버 시 표시) */}
      {onToggleWishlist && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
        </button>
      )}
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
      <p className="text-xs text-gray-500">{author}</p>
      {/* [5순위 수정] 노란색 → 보라색(indigo) 별점 */}
      <div className="flex items-center gap-1 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-indigo-500 text-indigo-500' : 'text-gray-200'}`} />
        ))}
      </div>
      <button 
        onClick={onReviewClick}
        className="w-full mt-3 py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg transition-colors border border-indigo-100"
      >
        리뷰 작성하기
      </button>
    </div>
  </div>
);

// --- 3. 리뷰 카드 컴포넌트 ---
const MyReviewCard = ({ title, author, rating, review }: { title: string; author: string; rating: number; review: string }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-5 hover:shadow-md transition-shadow">
    <div
      className="aspect-[3/4] w-20 flex-shrink-0 bg-gray-100 rounded-r-md flex items-center justify-center text-gray-400 relative overflow-hidden"
      style={{ boxShadow: '-3px 4px 12px rgba(0,0,0,0.2)' }}
    >
      Book Cover
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
      <p className="text-xs text-gray-500 mb-2">{author}</p>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-indigo-500 text-indigo-500' : 'text-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
        {review}
      </p>
      <button className="mt-3 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
        전체 보기 &rarr;
      </button>
    </div>
  </div>
);

// --- 메인 서재 페이지 컴포넌트 ---
export default function MyLibrary() {
  const [activeTab, setActiveTab] = useState<'history' | 'wishlist' | 'reviews'>('history');
  const [reviewModalBook, setReviewModalBook] = useState<{ title: string; author: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const [userName, setUserName] = useState<string>('');

  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  // 독서 기록함 상태
  const [historyBooks, setHistoryBooks] = useState<{ title: string; author: string; rating: number }[]>([]);

  const [reviews, setReviews] = useState<{ title: string; author: string; rating: number; review: string }[]>([]);

  // 백엔드에서 내 리뷰 목록을 불러오는 함수
  const fetchMyReviews = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/reviews/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // 백엔드 필드명(content)을 프론트엔드 prop(review)에 맞게 매핑
        setReviews(data.map((r: any) => ({ ...r, review: r.content })));
      }
    } catch (error) {
      console.error("리뷰 목록 로딩 실패:", error);
    }
  };

  // 백엔드에서 사용자 정보를 불러오는 함수
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.name) setUserName(data.name);
      }
    } catch (error) {
      console.error("사용자 정보 로딩 실패:", error);
    }
  };

  // 페이지 로드 시 내 리뷰 목록 불러오기
  useEffect(() => {
    fetchUserInfo();
    fetchMyReviews();
  }, []);

  const closeReviewModal = () => {
    setReviewModalBook(null);
    setReviewRating(0);
    setHoverRating(0);
    setReviewTitle('');
    setReviewContent('');
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const payload = {
        bookTitle: reviewModalBook?.title,
        bookAuthor: reviewModalBook?.author,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('리뷰가 성공적으로 등록되었습니다!');
        closeReviewModal();
        setActiveTab('reviews');
        fetchMyReviews(); // 리뷰 목록 새로고침
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || '리뷰 등록에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('리뷰 등록 중 오류 발생:', error);
      alert(error.message || '서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-1">
      {/* 사이드바 */}
      <Sidebar />

      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* 상단 프로필 헤더 */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {userName ? `${userName}님의 서재` : '나의 서재'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">올해 벌써 24권의 책을 읽으셨네요! 👏</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <PlusCircle className="w-4 h-4" /> 읽은 책 등록
          </button>
        </header>

        {/* ─── [4순위 수정] 레이아웃 재배치 ───
            Before: grid-cols-3 (나란히 3열, 높이 불균형)
            After:  상단 grid-cols-2 (현재읽는책 + 월별통계, min-h 통일)
                    하단 w-full (잔디밭 전체 너비)
        */}

        {/* 상단 2열: 현재 읽는 책 + 월별 독서 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 현재 읽고 있는 책 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[320px] flex flex-col">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
              현재 읽고 있는 책
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </h3>
            {/* 최대 3권만 표시 + 진행률 바 + 더보기 */}
            <div className="space-y-5 flex-1">
              {[
                { title: '불편한 편의점', progress: 65 },
                { title: '파친코', progress: 32 },
                { title: '세이노의 가르침', progress: 80 },
              ].map((book, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div
                    className="w-12 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded-r-sm"
                    style={{ boxShadow: '-2px 3px 8px rgba(0,0,0,0.15)' }}
                  />
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-indigo-600 mb-1">독서중 ({book.progress}%)</p>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1">{book.title}</h4>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full py-2.5 bg-gray-50 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors">
              더보기
            </button>
          </section>

          {/* 월별 독서 통계 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[320px] flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> 월별 독서 통계
            </h3>
            <div className="flex-1 w-full min-h-0">
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
          </section>
        </div>

        {/* 하단: 독서 잔디밭 — 전체 너비 */}
        <ReadingGrass />

        {/* 하단: 독서 기록함 / 위시리스트 탭 */}
        <section className="overflow-hidden">
          <div className="flex gap-6 border-b border-gray-100 mb-6">
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              독서 기록함
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'wishlist' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              위시리스트
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              작성한 리뷰
            </button>
          </div>

          {/* 슬라이딩 컨테이너 */}
          <div className="w-full relative">
            <div 
              className="flex w-[300%] transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTab === 'history' ? 0 : activeTab === 'wishlist' ? 33.3333 : 66.6666}%)` }}
            >
              {/* 1. 독서 기록함 탭 내용 */}
              <div className="w-1/3 pr-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-4">
                  {historyBooks.length > 0 ? (
                    historyBooks.map((book, idx) => (
                      <MyBookCard
                        key={idx}
                        title={book.title}
                        author={book.author}
                        rating={book.rating}
                        isWishlist={isWishlisted(book.title)} // API 연동 전이라 임시로 title을 ID로 사용
                        onToggleWishlist={() => toggleWishlist({
                          itemId: book.title, // API 연동 전이라 임시로 title을 ID로 사용
                          title: book.title,
                          author: book.author,
                          cover: '' // 실제 데이터에서는 커버 이미지 URL 필요
                        })}
                        onReviewClick={() => setReviewModalBook({ title: book.title, author: book.author })}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                      독서 기록함에 담긴 책이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. 위시리스트 탭 내용 */}
              <div className="w-1/3 pr-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-4">
                  {wishlist.length > 0 ? (
                    wishlist.map((book, idx) => (
                      <MyBookCard
                        key={String(book.itemId)}
                        title={book.title}
                        author={book.author}
                        rating={0} // 위시리스트의 책은 별점이 없습니다.
                        isWishlist={true}
                        onToggleWishlist={() => toggleWishlist(book)}
                        onReviewClick={() => setReviewModalBook({ title: book.title, author: book.author })} // 위시리스트 책도 리뷰 작성 가능
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                      위시리스트에 담긴 책이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. 작성한 리뷰 탭 내용 */}
              <div className="w-1/3 pr-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                  {reviews.length > 0 ? (
                    reviews.map((r, idx) => (
                      <MyReviewCard key={idx} title={r.title} author={r.author} rating={r.rating} review={r.review} />
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                      작성한 리뷰가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 리뷰 작성 모달 팝업 */}
      {reviewModalBook && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">새 리뷰 작성</h2>
              <button 
                onClick={closeReviewModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* 책 정보 표시 영역 */}
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-12 h-16 bg-gray-200 rounded shadow-sm flex-shrink-0 overflow-hidden" />
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 mb-0.5">선택된 도서</p>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{reviewModalBook.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{reviewModalBook.author}</p>
                </div>
              </div>

              {/* 입력 폼 영역 */}
              <div className="space-y-4">
                {/* 별점 선택 영역 */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">나의 별점</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <Star
                          key={i}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            starValue <= (hoverRating || reviewRating) ? 'fill-indigo-500 text-indigo-500' : 'text-gray-200'
                          }`}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(starValue)}
                        />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">한 줄 제목</label>
                  <input 
                    type="text" 
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="리뷰의 핵심을 한 줄로 적어주세요." 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">나의 평가</label>
                  <textarea 
                    rows={5} 
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="책을 읽고 느낀 점을 자유롭게 남겨주세요." 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" 
                  />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="pt-2 flex gap-3">
                <button onClick={closeReviewModal} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">취소</button>
                <button onClick={handleSubmitReview} className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">등록하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
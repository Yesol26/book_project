"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. 라우터 임포트

const AuthPage: React.FC = () => {
  const router = useRouter(); // 2. 라우터 훅 초기화
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 백엔드 URL (Express 서버 포트에 맞게 수정하세요)
    const baseUrl = 'http://localhost:4000/api/auth';
    const endpoint = isLogin ? `${baseUrl}/login` : `${baseUrl}/signup`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        if (isLogin) {
          // 3. 로그인 성공 시 처리
          // 백엔드에서 준 토큰을 브라우저에 저장
          localStorage.setItem('token', result.token);
          
          alert("로그인 성공!");
          
          // 4. 메인 페이지(main.tsx 또는 / 경로)로 이동
          router.push('/main'); 
        } else {
          // 회원가입 성공 시
          alert("회원가입이 완료되었습니다! 로그인해 주세요.");
          setIsLogin(true); // 로그인 모드로 전환
        }
      } else {
        // 백엔드에서 보낸 에러 메시지 출력
        alert(`실패: ${result.message}`);
      }
    } catch (err) {
      console.error("통신 에러:", err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-5 shadow-lg shadow-blue-200 text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">독서 클럽</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Name</label>
              <input 
                name="name"
                type="text" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="실명을 입력하세요"
                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition outline-none text-black"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">ID (Email)</label>
            <input 
              name="email"
              type="text" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="아이디 또는 이메일"
              className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Password</label>
            <input 
              name="password"
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition outline-none text-black"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition transform active:scale-[0.97] mt-6">
            {isLogin ? "로그인" : "회원가입 완료"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 font-bold hover:underline"
          >
            {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
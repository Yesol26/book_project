"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || ''
          }));
        }
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      
      // 백엔드로 보낼 데이터 준비
      const payload: any = { name: formData.name };
      
      // 비밀번호 변경을 시도하는 경우
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      } else if (formData.currentPassword || formData.newPassword) {
        alert("비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
        return;
      }

      const res = await fetch(`${apiUrl}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
        
        // Navbar에 프로필이 업데이트되었음을 알리는 이벤트 발송
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        const contentType = res.headers.get("content-type");
        let errorMessage = '오류가 발생했습니다.';
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = `서버 오류 (상태 코드: ${res.status}). 백엔드 API 설정을 확인해주세요.`;
        }
        alert(`업데이트 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-1">
      {/* 좌측 사이드바 */}
      <Sidebar />
      
      {/* 중앙 프로필 설정 영역 */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-2xl font-black text-gray-900">프로필 설정</h1>
          <p className="text-gray-500 text-sm mt-1">개인 정보와 비밀번호를 관리하세요.</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. 프로필 이미지 섹션 */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-8 border-b border-gray-100">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                  <User className="w-10 h-10 group-hover:opacity-50 transition-opacity" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left pt-2">
                <h3 className="text-lg font-bold text-gray-900">프로필 사진</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">JPG, GIF, PNG 파일만 업로드 가능합니다. (최대 5MB)</p>
                <button type="button" className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                  사진 변경
                </button>
              </div>
            </div>

            {/* 2. 기본 정보 폼 */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">이름</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white transition outline-none text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">이메일 (아이디)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 ml-1">가입 시 사용한 이메일은 변경할 수 없습니다.</p>
                </div>
              </div>
            </div>

            {/* 3. 비밀번호 변경 폼 */}
            <div className="space-y-5 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">비밀번호 변경</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">현재 비밀번호</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="현재 비밀번호를 입력해주세요"
                      className="w-full max-w-md pl-11 pr-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white transition outline-none text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">새 비밀번호</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="새로운 비밀번호"
                      className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white transition outline-none text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">새 비밀번호 확인</label>
                    <input 
                      type="password" 
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="비밀번호 다시 입력"
                      className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white transition outline-none text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Save className="w-4 h-4" /> 저장하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
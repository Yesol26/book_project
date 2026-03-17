"use client"; // 이 줄이 반드시 맨 위에 있어야 합니다!

import { usePathname } from 'next/navigation';
import { QueryProvider } from '@/providers/QueryProvider';
import Navbar from '@/components/Navar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // 현재 경로가 "/" (로그인 페이지)이면 Navbar를 숨깁니다.
  const showNavbar = pathname !== '/';

  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <QueryProvider>
          {/* showNavbar가 true일 때만 배너가 나옵니다 */}
          {showNavbar && <Navbar />}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
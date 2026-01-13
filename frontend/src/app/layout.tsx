import { QueryProvider } from '@/providers/QueryProvider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '독서 클럽 - 당신의 독서 여정',
  description: '독서 기록, 모임, 통계를 한 곳에서',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

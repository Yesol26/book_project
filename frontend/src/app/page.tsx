import { redirect } from 'next/navigation';

export default function Home() {
  // 우선 메인 화면 접속 시 바로 도서 검색 페이지로 이동하게끔 임시 처리
  redirect('/search');
}

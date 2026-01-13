export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          📚 독서 클럽
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          당신의 독서 여정을 함께하는 공간
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            로그인
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            회원가입
          </a>
        </div>
      </main>
    </div>
  );
}

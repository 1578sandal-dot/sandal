import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const messages = {
        "auth/user-not-found": "등록되지 않은 이메일입니다.",
        "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
        "auth/invalid-email": "이메일 형식을 확인해주세요.",
        "auth/too-many-requests": "잠시 후 다시 시도해주세요.",
        "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
      };
      setError(messages[err.code] ?? "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sandal-50 to-white flex flex-col items-center justify-center p-6">
      {/* 로고 영역 */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-3">🥪</div>
        <h1 className="text-3xl font-bold text-sandal-700">샌달</h1>
        <p className="text-gray-500 mt-1 text-sm">기업 정기조식 서비스</p>
      </div>

      {/* 로그인 카드 */}
      <div className="card w-full max-w-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">담당자 로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@example.com"
              className="input-field"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="input-field"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          계정이 없으신가요?{" "}
          <a
            href="mailto:ssil1004@gmail.com"
            className="text-sandal-600 hover:underline"
          >
            샌달에 문의하기
          </a>
        </p>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { company, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(isAdmin ? "/admin" : "/")}
        >
          <span className="text-2xl">🥪</span>
          <span className="font-bold text-sandal-700 text-lg">샌달</span>
        </div>

        {/* 회사명 + 로그아웃 */}
        {company && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {isAdmin ? "관리자" : company.name}
            </span>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

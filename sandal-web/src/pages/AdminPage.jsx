import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";

const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];
const formatDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_KO[d.getDay()]})`;
};

export default function AdminPage() {
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setSelected(null);

      // 전체 고객사 목록
      const compSnap = await getDocs(collection(db, "companies"));
      const compList = compSnap.docs
        .filter((d) => d.data().role !== "admin")
        .map((d) => ({ uid: d.id, ...d.data() }));
      setCompanies(compList);

      // 해당 월 식단표 제출 현황
      const planMap = {};
      await Promise.all(
        compList.map(async (comp) => {
          try {
            const snap = await getDocs(
              collection(db, "dietPlans", comp.uid, "months")
            );
            const doc = snap.docs.find((d) => d.id === yearMonth);
            planMap[comp.uid] = doc ? doc.data() : null;
          } catch {
            planMap[comp.uid] = null;
          }
        })
      );
      setPlans(planMap);
      setLoading(false);
    }
    load();
  }, [yearMonth]);

  const [year, month] = yearMonth.split("-").map(Number);
  const prevMonth = () => {
    if (month === 1) setYearMonth(`${year - 1}-12`);
    else setYearMonth(`${year}-${String(month - 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    if (month === 12) setYearMonth(`${year + 1}-01`);
    else setYearMonth(`${year}-${String(month + 1).padStart(2, "0")}`);
  };

  const submitted = companies.filter((c) => plans[c.uid]?.submittedAt);
  const notSubmitted = companies.filter((c) => !plans[c.uid]?.submittedAt);

  const selectedPlan = selected ? plans[selected.uid] : null;
  const selectedDates = selectedPlan
    ? Object.entries(selectedPlan.dates ?? {})
        .filter(([, d]) => d.items?.some((i) => i.menuName))
        .sort(([a], [b]) => a.localeCompare(b))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-sandal-600 to-sandal-500 rounded-2xl p-5 text-white mb-6">
          <p className="text-sandal-100 text-sm mb-1">관리자 페이지</p>
          <h2 className="font-bold text-xl">식단표 제출 현황</h2>
        </div>

        {/* 월 선택 */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl">‹</button>
            <h3 className="font-bold text-gray-900 text-lg">{year}년 {month}월</h3>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl">›</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-sandal-500 rounded-full animate-spin mr-2" />
            불러오는 중...
          </div>
        ) : (
          <>
            {/* 제출 완료 */}
            <div className="card p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-3">
                ✅ 제출 완료 <span className="text-sandal-600">({submitted.length})</span>
              </p>
              {submitted.length === 0 ? (
                <p className="text-sm text-gray-400">아직 제출한 업체가 없습니다</p>
              ) : (
                <div className="space-y-2">
                  {submitted.map((c) => (
                    <button
                      key={c.uid}
                      onClick={() => setSelected(selected?.uid === c.uid ? null : c)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                        selected?.uid === c.uid
                          ? "border-sandal-400 bg-sandal-50"
                          : "border-gray-100 bg-white hover:border-sandal-300"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.contactName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-sandal-100 text-sandal-700 px-2 py-1 rounded-full">
                          {Object.values(plans[c.uid]?.dates ?? {}).filter((d) => d.items?.some((i) => i.menuName)).length}일 입력
                        </span>
                        {plans[c.uid]?.lastResubmittedAt && (
                          <p className="text-xs text-amber-500 mt-1">수정 제출 있음</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 미제출 */}
            <div className="card p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-3">
                ⏳ 미제출 <span className="text-gray-400">({notSubmitted.length})</span>
              </p>
              {notSubmitted.length === 0 ? (
                <p className="text-sm text-gray-400">모든 업체가 제출했습니다</p>
              ) : (
                <div className="space-y-2">
                  {notSubmitted.map((c) => (
                    <div key={c.uid} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white">
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.contactName}</p>
                      </div>
                      <span className="text-xs text-gray-400">미제출</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 업체 식단표 상세 */}
            {selected && (
              <div className="card p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-3">
                  {selected.name} — {year}년 {month}월 식단표
                </p>
                {selectedDates.length === 0 ? (
                  <p className="text-sm text-gray-400">입력된 날짜가 없습니다</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDates.map(([dateStr, dateData]) => (
                      <div key={dateStr} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">{formatDate(dateStr)}</p>
                        <div className="space-y-1">
                          {dateData.items.filter((i) => i.menuName).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {item.menuName}{item.side ? ` + ${item.side}` : ""}
                              </span>
                              <span className="font-semibold text-sandal-700">{item.quantity}개</span>
                            </div>
                          ))}
                        </div>
                        {dateData.note && (
                          <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-2 py-1">
                            메모: {dateData.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          문의: ssil1004@gmail.com
        </p>
      </main>
    </div>
  );
}

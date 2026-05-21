import { useState } from "react";
import Navbar from "../components/Navbar";
import MonthCalendar from "../components/MonthCalendar";
import DayPanel from "../components/DayPanel";
import { useDietPlan, isPastSubmitDeadline } from "../hooks/useDietPlan";
import { useAuth } from "../hooks/useAuth";

export default function CalendarPage() {
  const { company } = useAuth();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resubmitDone, setResubmitDone] = useState(false);

  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;
  const { plan, loading, saving, saveDate, submitPlan } = useDietPlan(yearMonth);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  // 입력된 날짜 수 계산
  const filledDays = Object.values(plan?.dates ?? {}).filter(
    (d) => d.items?.some((i) => i.menuName)
  ).length;

  const isSubmitted = !!plan?.submittedAt;
  const pastDeadline = isPastSubmitDeadline(yearMonth);

  // 마지막 제출 이후 변경된 날짜 계산
  const changedDates = (() => {
    if (!isSubmitted || !plan?.snapshotAtLastSubmit) return [];
    const snapshot = plan.snapshotAtLastSubmit;
    const current = plan.dates ?? {};
    const allKeys = new Set([...Object.keys(snapshot), ...Object.keys(current)]);
    return [...allKeys].filter((dateStr) => {
      const before = JSON.stringify(snapshot[dateStr]?.items ?? []);
      const after = JSON.stringify(current[dateStr]?.items ?? []);
      return before !== after;
    });
  })();

  const handleSave = async (dateStr, items, note, extraDates) => {
    await saveDate(dateStr, items, note);
    if (extraDates?.length) {
      for (const d of extraDates) {
        await saveDate(d, items, note);
      }
    }
    setSelectedDate(null);
    setResubmitDone(false);
  };

  const handleSubmit = async () => {
    if (!window.confirm(`${year}년 ${month}월 식단표를 최종 제출할까요?\n제출 후에는 각 날짜 이틀 전 오후 6시까지만 수정 가능합니다.`)) return;
    await submitPlan();
  };

  const handleResubmit = async () => {
    if (changedDates.length === 0) return;
    const dateList = changedDates.map((d) => d.slice(5)).join(", ");
    if (!window.confirm(`변경된 날짜: ${dateList}\n수정 제출할까요?`)) return;
    await submitPlan(changedDates);
    setResubmitDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* 인사 배너 */}
        <div className="bg-gradient-to-r from-sandal-600 to-sandal-500 rounded-2xl p-5 text-white mb-6">
          <p className="text-sandal-100 text-sm mb-1">안녕하세요 👋</p>
          <h2 className="font-bold text-xl">
            {company?.contactName ?? company?.name ?? "담당자"}님
          </h2>
          <p className="text-sandal-100 text-sm mt-1">
            날짜를 클릭해서 메뉴를 입력하세요
          </p>
        </div>

        {/* 캘린더 카드 */}
        <div className="card p-4 mb-4">
          {/* 월 이동 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
            >‹</button>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">{year}년 {month}월</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {filledDays > 0 ? `${filledDays}일 입력됨` : "아직 입력된 날짜가 없습니다"}
              </p>
            </div>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
            >›</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-sandal-500 rounded-full animate-spin mr-2" />
              불러오는 중...
            </div>
          ) : (
            <MonthCalendar
              year={year}
              month={month}
              plan={plan}
              onDateClick={setSelectedDate}
            />
          )}
        </div>

        {/* 제출 상태 및 버튼 */}
        <div className="card p-4">
          {isSubmitted ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-gray-900">{year}년 {month}월 식단표 제출 완료</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    각 날짜 이틀 전 오후 6시까지 날짜를 클릭해 수정할 수 있습니다
                  </p>
                </div>
              </div>
              {!pastDeadline && (
                resubmitDone && changedDates.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-sandal-700 font-semibold bg-sandal-50 rounded-xl px-4 py-2.5">
                    <span>✅</span> 수정 제출 완료
                  </div>
                ) : (
                  <button
                    onClick={handleResubmit}
                    disabled={saving || changedDates.length === 0}
                    className="btn-primary text-sm px-5 py-2.5 w-full"
                  >
                    {saving
                      ? "처리 중..."
                      : changedDates.length > 0
                      ? `수정 제출 (${changedDates.length}일 변경됨)`
                      : "변경된 내용 없음"}
                  </button>
                )
              )}
            </div>
          ) : pastDeadline ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm text-red-600 font-medium">제출 마감일이 지났습니다. 샌달에 직접 연락해주세요.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">식단표 제출</p>
                  <p className="text-xs text-gray-500 mt-0.5">전월 말까지 제출해주세요</p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={saving || filledDays === 0}
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  {saving ? "처리 중..." : "최종 제출"}
                </button>
              </div>
              {filledDays === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  최소 1일 이상 입력 후 제출 가능합니다
                </p>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          문의: ssil1004@gmail.com
        </p>
      </main>

      {/* 날짜 입력 패널 */}
      {selectedDate && (
        <DayPanel
          dateStr={selectedDate}
          dateData={plan?.dates?.[selectedDate]}
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

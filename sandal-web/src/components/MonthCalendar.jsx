const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthCalendar({ year, month, plan, onDateClick }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const toISO = (d) => `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const getDateStatus = (day) => {
    if (!day) return null;
    const iso = toISO(day);
    const dateData = plan?.dates?.[iso];
    if (!dateData || !dateData.items || dateData.items.length === 0) return "empty";
    return "filled";
  };

  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-2 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const iso = toISO(day);
          const dow = new Date(year, month - 1, day).getDay();
          const isWeekend = dow === 0 || dow === 6;
          const isPast = new Date(year, month - 1, day) < today;
          const isToday = new Date(year, month - 1, day).getTime() === today.getTime();
          const status = getDateStatus(day);
          const dateData = plan?.dates?.[iso];
          const itemCount = dateData?.items?.filter(i => i.menuName).length ?? 0;

          return (
            <button
              key={idx}
              onClick={() => !isWeekend && onDateClick(iso)}
              disabled={isWeekend}
              className={`
                relative flex flex-col items-center justify-start
                rounded-xl p-1 min-h-[64px] transition-all border
                ${isWeekend ? "bg-gray-50 border-transparent cursor-default" : ""}
                ${!isWeekend && !isPast ? "hover:border-sandal-400 cursor-pointer" : ""}
                ${!isWeekend && isPast ? "opacity-50 cursor-default" : ""}
                ${isToday ? "border-sandal-400 bg-sandal-50" : !isWeekend ? "border-gray-100 bg-white" : ""}
                ${status === "filled" && !isWeekend ? "border-sandal-300 bg-sandal-50" : ""}
              `}
            >
              {/* 날짜 숫자 */}
              <span className={`text-sm font-medium mb-1 ${
                dow === 0 ? "text-red-400" :
                dow === 6 ? "text-blue-400" :
                isToday ? "text-sandal-700 font-bold" :
                "text-gray-700"
              }`}>
                {day}
              </span>

              {/* 메뉴 입력 현황 */}
              {!isWeekend && itemCount > 0 && (
                <span className="text-xs bg-sandal-600 text-white rounded-full px-1.5 py-0.5 leading-none">
                  {itemCount}
                </span>
              )}

              {/* 요청사항 있으면 점 표시 */}
              {!isWeekend && dateData?.note && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

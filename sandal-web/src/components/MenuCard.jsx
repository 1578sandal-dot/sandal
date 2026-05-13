import { useState } from "react";
import { canAddSide, SIDE_OPTIONS } from "../lib/menus";

const CATEGORY_EMOJI = {
  "샌드위치": "🥪",
  "베이글": "🥯",
  "유부초밥": "🍱",
  "김밥": "🌯",
  "샐러드": "🥗",
  "컵과일": "🍓",
  "샌드위치+사이드": "🥪",
  "베이글+사이드": "🥯",
  "유부초밥+사이드": "🍱",
  "김밥+사이드": "🌯",
  "기타": "☕",
};

export default function MenuCard({ menu, onOrder }) {
  const [showOrder, setShowOrder] = useState(false);
  const emoji = CATEGORY_EMOJI[menu.category] ?? "🍽️";

  return (
    <>
      <div className="card flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-xl bg-sandal-50 flex items-center justify-center text-xl shrink-0">
          {emoji}
        </div>
        <span className="flex-1 font-medium text-gray-800 text-sm leading-snug">
          {menu.name}
          {canAddSide(menu) && (
            <span className="ml-2 text-xs text-sandal-500 font-normal">+ 사이드 가능</span>
          )}
        </span>
        <button
          onClick={() => setShowOrder(true)}
          className="shrink-0 bg-sandal-600 hover:bg-sandal-700 active:bg-sandal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          주문
        </button>
      </div>

      {showOrder && (
        <OrderModal
          menu={menu}
          onClose={() => setShowOrder(false)}
          onConfirm={(date, qty, side) => {
            onOrder(menu, date, qty, side);
            setShowOrder(false);
          }}
        />
      )}
    </>
  );
}

function OrderModal({ menu, onClose, onConfirm }) {
  const today = new Date();
  const weekdays = [];
  for (let i = 1; i <= 45 && weekdays.length < 20; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) weekdays.push(d);
  }

  const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];
  const formatDate = (d) => `${d.getMonth() + 1}/${d.getDate()}(${DAY_KO[d.getDay()]})`;
  const toISO = (d) => d.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(toISO(weekdays[0]));
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState("없음");

  const hasSide = canAddSide(menu);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        <h2 className="font-bold text-base mb-5">{menu.name}</h2>

        {/* 날짜 선택 */}
        <p className="text-sm font-medium text-gray-700 mb-2">배송 날짜</p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {weekdays.map((d) => {
            const iso = toISO(d);
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`shrink-0 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  selectedDate === iso
                    ? "bg-sandal-600 text-white border-sandal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-sandal-400"
                }`}
              >
                {formatDate(d)}
              </button>
            );
          })}
        </div>

        {/* 사이드 선택 (해당 메뉴만) */}
        {hasSide && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              사이드 추가 <span className="text-gray-400 font-normal">(선택)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {["없음", ...SIDE_OPTIONS].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSide(opt)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                    side === opt
                      ? "bg-sandal-600 text-white border-sandal-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-sandal-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 수량 선택 */}
        <p className="text-sm font-medium text-gray-700 mb-3">수량</p>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-sandal-400 transition-colors"
          >−</button>
          <span className="text-2xl font-bold w-8 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-sandal-400 transition-colors"
          >+</button>
          <input
            type="number"
            min={1}
            max={999}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sandal-400"
          />
          <span className="text-xs text-gray-400">직접입력</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">취소</button>
          <button onClick={() => onConfirm(selectedDate, qty, hasSide ? side : null)} className="btn-primary flex-1">
            주문 신청
          </button>
        </div>
      </div>
    </div>
  );
}

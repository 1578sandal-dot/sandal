import { useState, useEffect } from "react";
import { MENU_ITEMS, SIDE_OPTIONS, canAddSide } from "../lib/menus";
import { isEditable } from "../hooks/useDietPlan";

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const formatDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_KO[d.getDay()]})`;
};

const emptyItem = () => ({ menuName: "", quantity: "", side: "" });

export default function DayPanel({ dateStr, dateData, onSave, onClose, saving }) {
  const [items, setItems] = useState(
    dateData?.items?.length ? dateData.items : [emptyItem()]
  );
  const [note, setNote] = useState(dateData?.note ?? "");
  const editable = isEditable(dateStr);

  useEffect(() => {
    setItems(dateData?.items?.length ? dateData.items : [emptyItem()]);
    setNote(dateData?.note ?? "");
  }, [dateStr]);

  const updateItem = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: value };
        // 메뉴 변경 시 사이드 초기화
        if (field === "menuName") updated.side = "";
        return updated;
      })
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (idx) => {
    if (items.length === 1) {
      setItems([emptyItem()]);
    } else {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSave = () => {
    const validItems = items.filter((i) => i.menuName && i.quantity);
    onSave(dateStr, validItems, note);
  };

  const getMenuObj = (name) => MENU_ITEMS.find((m) => m.name === name);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">{formatDate(dateStr)}</h2>
            {!editable && (
              <p className="text-xs text-red-500 mt-0.5">이틀 전 오후 6시 마감 — 수정 불가</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >✕</button>
        </div>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">

          {/* 메뉴 항목들 */}
          {items.map((item, idx) => {
            const menuObj = getMenuObj(item.menuName);
            const hasSide = menuObj ? canAddSide(menuObj) : false;

            return (
              <div key={idx} className="bg-gray-50 rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-4 shrink-0">{idx + 1}</span>

                  {/* 메뉴 선택 */}
                  <select
                    value={item.menuName}
                    disabled={!editable}
                    onChange={(e) => updateItem(idx, "menuName", e.target.value)}
                    className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sandal-400 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">메뉴 선택</option>
                    {MENU_ITEMS.filter((m) => m.available).map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>

                  {/* 수량 */}
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    value={item.quantity}
                    disabled={!editable}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    placeholder="수량"
                    className="w-16 text-sm border border-gray-200 rounded-xl px-2 py-2 text-center bg-white focus:outline-none focus:ring-2 focus:ring-sandal-400 disabled:bg-gray-100 disabled:text-gray-400"
                  />

                  {/* 삭제 */}
                  {editable && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-sm shrink-0 transition-colors"
                    >✕</button>
                  )}
                </div>

                {/* 사이드 선택 */}
                {hasSide && editable && (
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {["없음", ...SIDE_OPTIONS].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateItem(idx, "side", opt === "없음" ? "" : opt)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          (item.side === "" && opt === "없음") || item.side === opt
                            ? "bg-sandal-600 text-white border-sandal-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-sandal-400"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {hasSide && !editable && item.side && (
                  <p className="text-xs text-gray-500 pl-6">사이드: {item.side}</p>
                )}
              </div>
            );
          })}

          {/* 항목 추가 */}
          {editable && (
            <button
              onClick={addItem}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-sandal-400 hover:text-sandal-500 transition-colors"
            >
              + 메뉴 추가
            </button>
          )}

          {/* 기타 요청사항 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              기타 요청사항
            </label>
            <textarea
              value={note}
              disabled={!editable}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이사항, 알레르기, 추가 요청 등을 입력해주세요"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sandal-400 disabled:bg-gray-100 disabled:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">닫기</button>
          {editable && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

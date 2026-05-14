import { useState, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, FIREBASE_READY } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import MenuCard from "../components/MenuCard";
import OrderToast from "../components/OrderToast";
import { MENU_ITEMS, CATEGORIES } from "../lib/menus";

export default function MenuPage() {
  const { user, company } = useAuth();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [toast, setToast] = useState(null);

  const filteredMenus =
    activeCategory === "전체"
      ? MENU_ITEMS.filter((m) => m.available)
      : MENU_ITEMS.filter((m) => m.available && m.category === activeCategory);

  const handleOrder = useCallback(
    async (menu, date, qty, side) => {
      try {
        if (FIREBASE_READY) {
          await addDoc(collection(db, "orders"), {
            companyId: user.uid,
            companyName: company?.name ?? "",
            contactName: company?.contactName ?? "",
            menuId: menu.id,
            menuName: menu.name,
            side: side ?? null,
            quantity: qty,
            deliveryDate: date,
            status: "pending",
            createdAt: serverTimestamp(),
          });
        } else {
          console.log("주문(데모):", { menu: menu.name, side, date, qty });
        }
        const sideText = side && side !== "없음" ? ` + ${side}` : "";
        setToast(`${menu.name}${sideText} ${qty}개 주문이 신청되었습니다.`);
      } catch (err) {
        console.error("주문 저장 실패:", err);
        setToast("주문 신청 중 오류가 발생했습니다.");
      }
    },
    [user, company]
  );

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
            오늘도 맛있는 조식을 주문해 보세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-sandal-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-sandal-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 메뉴 목록 */}
        {filteredMenus.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">😕</div>
            <p>해당 카테고리의 메뉴가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 mb-1">{filteredMenus.length}개 메뉴</p>
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onOrder={handleOrder} />
            ))}
          </div>
        )}

        {/* 하단 안내 */}
        <p className="text-center text-xs text-gray-400 mt-8 pb-4">
          주문 마감: 전일 오후 3시 / 문의: ssil1004@gmail.com
        </p>
      </main>

      {toast && (
        <OrderToast message={toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

type MenuItem = {
  name: string;
  image?: string;
};

type Category = {
  id: string;
  name: string;
  sub: string;
  desc: string;
  items: MenuItem[];
  tag: string;
  color: string;
  textColor: string;
  border?: boolean;
};

const categories: Category[] = [
  {
    id: "sandwich",
    name: "샌드위치",
    sub: "Sandwich · 20종",
    desc: "직접 개발한 레시피로 매일 새벽 만드는 샌드위치. 풍미·수분·식감을 일정하게 유지하는 공정 표준을 적용합니다.",
    tag: "DAILY FRESH",
    color: "bg-forest",
    textColor: "text-cream",
    items: [
      { name: "클럽샌드위치", image: "/images/클럽샌드위치2피스.jpg" },
      { name: "햄치즈에그샌드위치", image: "/images/햄치즈에그샌드위치2피스.jpg" },
      { name: "참치샌드위치", image: "/images/참치샌드위치2피스.JPG" },
      { name: "크래미샌드위치", image: "/images/크래미샌드위치2피스.jpg" },
      { name: "버터햄치즈샌드위치", image: "/images/버터햄치즈샌드위치2피스.jpg" },
      { name: "감자샌드위치", image: "/images/감자샌드위치2피스.jpg" },
      { name: "햄치즈샌드위치", image: "/images/햄치즈샌드위치2피스.jpg" },
      { name: "무화과호두크림샌드위치", image: "/images/무화과호두크림샌드위치2피스.jpg" },
      { name: "고구마샌드위치", image: "/images/고구마샌드위치2피스.jpg" },
      { name: "누텔라바나나샌드위치", image: "/images/누텔라바나나샌드위치2피스.jpg" },
      { name: "크래미에그샌드위치", image: "/images/크래미에그샌드위치2피스.jpg" },
      { name: "베이컨대파크림샌드위치", image: "/images/베이컨대파샌드위치2피스.jpg" },
      { name: "마카로니샌드위치", image: "/images/마카로니샌드위치2피스.jpg" },
      { name: "블루베리크림샌드위치", image: "/images/블루베리크림샌드위치2피스.jpg" },
      { name: "살사후실리샌드위치", image: "/images/살사후실리샌드위치2피스.jpg" },
      { name: "콘햄치즈에그샌드위치", image: "/images/콘에그샌드위치2피스.jpg" },
      { name: "단호박샌드위치", image: "/images/단호박샌드위치2피스.jpg" },
      { name: "리코타치즈샌드위치", image: "/images/리코타치즈샌드위치2피스.jpg" },
      { name: "불고기샌드위치", image: "/images/불고기샌드위치2피스.jpg" },
      { name: "닭가슴살샌드위치", image: "/images/닭가슴살베이글2피스.jpg" },
    ],
  },
  {
    id: "bagel",
    name: "베이글",
    sub: "Bagel · 6종",
    desc: "쫄깃한 식감의 베이글에 엄선한 속재료를 채웠습니다.",
    tag: "6 VARIETIES",
    color: "bg-pale-sage",
    textColor: "text-ink",
    border: true,
    items: [
      { name: "무화과호두크림베이글", image: "/images/무화과호두크림베이글2피스.jpg" },
      { name: "베이컨대파크림베이글", image: "/images/베이컨대파크림베이글2피스.jpg" },
      { name: "블루베리크림베이글", image: "/images/블루베리크림베이글2피스.jpg" },
      { name: "당근라페베이글", image: "/images/당근라페베이글2피스.jpg" },
      { name: "바질토마토크림베이글", image: "/images/바질토마토크림베이글2피스.jpg" },
      { name: "닭가슴살베이글", image: "/images/닭가슴살베이글2피스.jpg" },
    ],
  },
  {
    id: "gimbap",
    name: "김밥",
    sub: "Gimbap · 13종",
    desc: "매일 새벽 직접 만드는 김밥. 한식이 익숙한 분들의 선택지를 넓혀드립니다.",
    tag: "13 VARIETIES",
    color: "bg-paper",
    textColor: "text-ink",
    border: true,
    items: [
      { name: "일반김밥", image: "/images/일반김밥.jpg" },
      { name: "치즈김밥", image: "/images/치즈김밥.jpg" },
      { name: "참치김밥", image: "/images/참치김밥.jpg" },
      { name: "매운어묵김밥", image: "/images/매운어묵김밥.jpg" },
      { name: "샐러드김밥", image: "/images/샐러드김밥.jpg" },
      { name: "무말랭이김밥", image: "/images/무말랭이김밥.jpg" },
      { name: "너비아니김밥", image: "/images/너비아니김밥.jpg" },
      { name: "계란김밥", image: "/images/계란김밥.jpg" },
      { name: "유부김밥", image: "/images/유부김밥.jpg" },
      { name: "돈까스김밥", image: "/images/돈까스김밥.jpg" },
      { name: "마라김밥", image: "/images/마라김밥.jpg" },
      { name: "오이당근김밥", image: "/images/오이당근김밥.jpg" },
      { name: "양배추당근김밥", image: "/images/양배추당근김밥.jpg" },
    ],
  },
  {
    id: "inari",
    name: "유부초밥",
    sub: "Inari · 7종",
    desc: "담백하고 든든한 유부초밥. 한 끼 식사로도, 간식으로도 충분합니다.",
    tag: "7 VARIETIES",
    color: "bg-paper",
    textColor: "text-ink",
    border: true,
    items: [
      { name: "크래미유부초밥", image: "/images/크래미유부초밥6피스.jpg" },
      { name: "햄유부초밥", image: "/images/햄유부초밥6피스.jpg" },
      { name: "참치유부초밥", image: "/images/참치유부초밥6피스.jpg" },
      { name: "날치알유부초밥", image: "/images/날치알유부초밥6피스.jpg" },
      { name: "김치유부초밥", image: "/images/김치유부초밥6피스.jpg" },
      { name: "유부초밥", image: "/images/유부초밥6피스.jpg" },
    ],
  },
  {
    id: "cupbap",
    name: "컵밥",
    sub: "Cup Rice · 6종",
    desc: "간편하게 즐기는 컵밥. 든든한 한 끼를 빠르게.",
    tag: "6 VARIETIES",
    color: "bg-bark",
    textColor: "text-cream",
    items: [
      { name: "야채볶음컵밥", image: "/images/야채볶음컵밥(대).jpg" },
      { name: "새우볶음컵밥", image: "/images/새우볶음컵밥(대).jpg" },
      { name: "김치볶음컵밥", image: "/images/김치볶음컵밥(대).jpg" },
      { name: "카레볶음컵밥", image: "/images/카레볶음컵밥(대).jpg" },
      { name: "낙지볶음컵밥", image: "/images/낙지볶음컵밥(대).jpg" },
      { name: "소불고기컵밥", image: "/images/소불고기컵밥(대).jpg" },
    ],
  },
  {
    id: "salad",
    name: "샐러드",
    sub: "Salad · 8종",
    desc: "신선한 재료로 만드는 샐러드 8종.",
    tag: "8 VARIETIES",
    color: "bg-pale-sage",
    textColor: "text-ink",
    border: true,
    items: [
      { name: "리코타치즈샐러드", image: "/images/리코타치즈샐러드(대).jpg" },
      { name: "두부버섯샐러드", image: "/images/두부버섯샐러드(대).jpg" },
      { name: "크래미샐러드", image: "/images/크래미샐러드(대).jpg" },
      { name: "단호박샐러드", image: "/images/단호박샐러드(대).jpg" },
      { name: "살사후실리샐러드", image: "/images/살사후실리샐러드(대).jpg" },
      { name: "고구마샐러드", image: "/images/고구마샐러드(대).png" },
      { name: "훈제오리샐러드", image: "/images/훈제오리샐러드.jpg" },
      { name: "훈제연어샐러드", image: "/images/훈제연어샐러드.jpg" },
    ],
  },
  {
    id: "side",
    name: "사이드 · 기타",
    sub: "Sides & More",
    desc: "식사를 완성하는 과일, 음료, 디저트 라인업.",
    tag: "SIDES & DRINKS",
    color: "bg-olive",
    textColor: "text-cream",
    items: [
      { name: "떡산적", image: "/images/떡산적.jpg" },
      { name: "닭강정", image: "/images/닭강정.jpg" },
      { name: "미니돈까스", image: "/images/미니돈까스.jpg" },
      { name: "만두튀김", image: "/images/만두튀김.jpg" },
      { name: "과일 2종", image: "/images/과일2종.jpg" },
      { name: "과일 3종", image: "/images/과일3종.png" },
      { name: "요거트", image: "/images/요거트.png" },
      { name: "단백질쉐이크", image: "/images/단백질쉐이크.png" },
      { name: "구운계란", image: "/images/구운계란.jpg" },
      { name: "하루견과", image: "/images/하루견과.png" },
    ],
  },
];

export default function MenuClient() {
  const [selected, setSelected] = useState<{ name: string; image: string } | null>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
        {categories.map(({ id, name, sub, desc, items, tag, color, textColor, border }) => (
          <div key={id} className={`rounded-2xl overflow-hidden ${color} ${border ? "border border-pale-sage" : ""}`}>
            <div className="p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-72 flex-shrink-0">
                  <div className="text-xs tracking-widest font-mono mb-2 text-gold">{tag}</div>
                  <h2 className={`font-[family-name:var(--font-maruburi)] text-4xl font-semibold mb-1 ${textColor}`}>{name}</h2>
                  <div className={`text-sm mb-4 ${textColor === "text-cream" ? "text-cream/50" : "text-bark/50"}`}>{sub}</div>
                  <p className={`text-sm leading-relaxed break-keep ${textColor === "text-cream" ? "text-cream/70" : "text-bark/60"}`}>{desc}</p>
                </div>
                <div className="flex-1">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full flex-shrink-0 bg-gold" />
                        {item.image ? (
                          <button
                            onClick={() => setSelected({ name: item.name, image: item.image! })}
                            className={`text-sm text-left hover:text-gold transition-colors cursor-pointer ${textColor === "text-cream" ? "text-cream/80" : "text-bark/70"}`}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <span className={`text-sm ${textColor === "text-cream" ? "text-cream/80" : "text-bark/70"}`}>{item.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 팝업 */}
      {selected && (
        <div
          className="fixed inset-0 bg-bark/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-cream rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-maruburi)] text-xl text-ink font-semibold">{selected.name}</span>
              <button
                onClick={() => setSelected(null)}
                className="text-bark/40 hover:text-bark transition-colors text-sm"
              >
                닫기 ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

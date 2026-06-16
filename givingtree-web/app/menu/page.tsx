import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "메뉴 | 더기빙트리",
  description: "더기빙트리의 샌드위치, 베이글, 김밥, 유부초밥, 컵밥, 음료, 디저트 메뉴를 소개합니다.",
};

const categories = [
  {
    id: "sandwich",
    name: "샌드위치",
    sub: "Sandwich · 20종",
    desc: "직접 개발한 레시피로 매일 새벽 만드는 샌드위치. 풍미·수분·식감을 일정하게 유지하는 공정 표준을 적용합니다.",
    items: [
      "클럽샌드위치", "햄치즈에그샌드위치", "참치샌드위치", "크래미샌드위치",
      "버터햄치즈샌드위치", "감자샌드위치", "햄치즈샌드위치", "무화과호두크림샌드위치",
      "고구마샌드위치", "누텔라바나나샌드위치", "크래미에그샌드위치", "베이컨대파크림샌드위치",
      "마카로니샌드위치", "블루베리크림샌드위치", "살사후실리샌드위치", "콘햄치즈에그샌드위치",
      "단호박샌드위치", "리코타치즈샌드위치", "불고기샌드위치", "닭가슴살샌드위치",
    ],
    tag: "DAILY FRESH",
    color: "bg-forest",
    textColor: "text-cream",
  },
  {
    id: "bagel",
    name: "베이글",
    sub: "Bagel · 6종",
    desc: "쫄깃한 식감의 베이글에 엄선한 속재료를 채웠습니다.",
    items: [
      "무화과호두크림베이글", "베이컨대파크림베이글", "블루베리크림베이글",
      "당근라페베이글", "바질토마토크림베이글", "닭가슴살베이글",
    ],
    tag: "6 VARIETIES",
    color: "bg-pale-sage",
    textColor: "text-ink",
    border: true,
  },
  {
    id: "gimbap",
    name: "김밥",
    sub: "Gimbap · 13종",
    desc: "매일 새벽 직접 만드는 김밥. 한식이 익숙한 분들의 선택지를 넓혀드립니다.",
    items: [
      "일반김밥", "치즈김밥", "참치김밥", "매운어묵김밥",
      "샐러드김밥", "무말랭이김밥", "너비아니김밥", "계란김밥",
      "유부김밥", "돈까스김밥", "마라김밥", "오이당근김밥",
      "양배추당근김밥",
    ],
    tag: "13 VARIETIES",
    color: "bg-paper",
    textColor: "text-ink",
    border: true,
  },
  {
    id: "inari",
    name: "유부초밥",
    sub: "Inari · 6종",
    desc: "담백하고 든든한 유부초밥. 한 끼 식사로도, 간식으로도 충분합니다.",
    items: [
      "크래미유부초밥", "햄유부초밥", "참치유부초밥",
      "날치알유부초밥", "김치유부초밥", "유부초밥", "버섯유부초밥",
    ],
    tag: "7 VARIETIES",
    color: "bg-paper",
    textColor: "text-ink",
    border: true,
  },
  {
    id: "cupbap",
    name: "컵밥",
    sub: "Cup Rice",
    desc: "간편하게 즐기는 컵밥. 든든한 한 끼를 빠르게.",
    items: [
      "야채볶음컵밥", "새우볶음컵밥", "김치볶음컵밥",
      "카레볶음컵밥", "낙지볶음컵밥", "소불고기컵밥",
    ],
    tag: "6 VARIETIES",
    color: "bg-bark",
    textColor: "text-cream",
  },
  {
    id: "salad",
    name: "샐러드",
    sub: "Salad · 8종",
    desc: "신선한 재료로 만드는 샐러드 8종.",
    items: [
      "리코타치즈샐러드", "두부버섯샐러드", "크래미샐러드",
      "단호박샐러드", "살사후실리샐러드", "고구마샐러드",
      "훈제오리샐러드", "훈제연어샐러드",
    ],
    tag: "8 VARIETIES",
    color: "bg-pale-sage",
    textColor: "text-ink",
    border: true,
  },
  {
    id: "side",
    name: "사이드 · 기타",
    sub: "Sides & More",
    desc: "식사를 완성하는 과일, 음료, 디저트 라인업.",
    items: [
      "과일",
      "계절 과일컵",
      "음료",
      "간식 · 베이커리",
      "분식",
    ],
    tag: "SIDES & DRINKS",
    color: "bg-olive",
    textColor: "text-cream",
  },
];

export default function MenuPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-ink">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-mono">Menu</p>
          <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl text-cream font-semibold leading-tight break-keep mb-6">
            매일 다른 메뉴를,<br />
            <span className="text-gold italic">매일 같은 품질로.</span>
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl break-keep">
            70가지가 넘는 메뉴를 4주 주기로 자동 로테이션합니다.<br />
            모든 메뉴는 매일 새벽 직접 만들어 당일 배송됩니다.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gold py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 text-bark text-center">
            {[
              { value: "70+", label: "전체 메뉴 수", latin: true },
              { value: "4주", label: "자동 로테이션", latin: false },
              { value: "매일 새벽", label: "직접 생산", latin: false },
              { value: "0회", label: "식단 직접 기획", latin: false },
            ].map(({ value, label, latin }) => (
              <div key={label}>
                <div className={`text-2xl font-semibold ${latin ? "font-[family-name:var(--font-maruburi)]" : "font-[family-name:var(--font-pretendard)]"}`}>{value}</div>
                <div className="text-xs mt-1 text-bark/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu categories */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
          {categories.map(({ id, name, sub, desc, items, tag, color, textColor, border }) => (
            <div key={id} className={`rounded-2xl overflow-hidden ${color} ${border ? "border border-pale-sage" : ""}`}>
              <div className="p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-72 flex-shrink-0">
                    <div className={`text-xs tracking-widest font-mono mb-2 ${textColor === "text-cream" ? "text-gold" : "text-gold"}`}>{tag}</div>
                    <h2 className={`font-[family-name:var(--font-maruburi)] text-4xl font-semibold mb-1 ${textColor}`}>{name}</h2>
                    <div className={`text-sm mb-4 ${textColor === "text-cream" ? "text-cream/50" : "text-bark/50"}`}>{sub}</div>
                    <p className={`text-sm leading-relaxed break-keep ${textColor === "text-cream" ? "text-cream/70" : "text-bark/60"}`}>{desc}</p>
                  </div>
                  <div className="flex-1">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${textColor === "text-cream" ? "bg-gold" : "bg-gold"}`} />
                          <span className={`text-sm ${textColor === "text-cream" ? "text-cream/80" : "text-bark/70"}`}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="bg-pale-sage py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-gold text-xs tracking-widest font-mono mb-4">NOTICE</div>
          <p className="text-bark/70 text-sm leading-relaxed break-keep">
            메뉴는 계절·식재료 수급 상황에 따라 일부 변경될 수 있습니다.<br />
            정확한 메뉴 구성과 알레르기 정보는 문의를 통해 확인해 주세요.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 px-6 py-3 bg-forest text-cream text-sm rounded-full hover:bg-ink transition-colors"
          >
            메뉴 상담 문의
          </Link>
        </div>
      </section>
    </>
  );
}

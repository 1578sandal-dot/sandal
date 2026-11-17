import Image from "next/image";

type MenuItem = {
  name: string;
  image: string;
};

type Category = {
  id: string;
  name: string;
  sub: string;
  desc: string;
  items: MenuItem[];
  tag: string;
};

const categories: Category[] = [
  {
    id: "sandwich",
    name: "샌드위치",
    sub: "Sandwich · 22종",
    desc: "직접 개발한 레시피로 매일 새벽 만드는 샌드위치. 풍미·수분·식감을 일정하게 유지하는 공정 표준을 적용합니다.",
    tag: "DAILY FRESH",
    items: [
      { name: "클럽샌드위치", image: "/images/menu/sandwich-01.jpg" },
      { name: "햄치즈에그샌드위치", image: "/images/menu/sandwich-02.jpg" },
      { name: "참치샌드위치", image: "/images/menu/sandwich-03.jpg" },
      { name: "크래미샌드위치", image: "/images/menu/sandwich-04.jpg" },
      { name: "버터햄치즈샌드위치", image: "/images/menu/sandwich-05.jpg" },
      { name: "감자샌드위치", image: "/images/menu/sandwich-06.jpg" },
      { name: "햄치즈샌드위치", image: "/images/menu/sandwich-07.jpg" },
      { name: "무화과호두크림샌드위치", image: "/images/menu/sandwich-08.jpg" },
      { name: "고구마샌드위치", image: "/images/menu/sandwich-09.jpg" },
      { name: "누텔라바나나샌드위치", image: "/images/menu/sandwich-10.jpg" },
      { name: "크래미에그샌드위치", image: "/images/menu/sandwich-11.jpg" },
      { name: "베이컨대파크림샌드위치", image: "/images/menu/sandwich-12.jpg" },
      { name: "마카로니샌드위치", image: "/images/menu/sandwich-13.jpg" },
      { name: "블루베리크림샌드위치", image: "/images/menu/sandwich-14.jpg" },
      { name: "살사후실리샌드위치", image: "/images/menu/sandwich-15.jpg" },
      { name: "콘에그샌드위치", image: "/images/menu/sandwich-16.jpg" },
      { name: "당근라페콩불고기샌드위치", image: "/images/menu/sandwich-17.jpg" },
      { name: "바질토마토크림샌드위치", image: "/images/menu/sandwich-18.jpg" },
      { name: "단호박샌드위치", image: "/images/menu/sandwich-19.jpg" },
      { name: "리코타치즈샌드위치", image: "/images/menu/sandwich-20.jpg" },
      { name: "불고기샌드위치", image: "/images/menu/sandwich-21.jpg" },
      { name: "닭가슴살샌드위치", image: "/images/menu/sandwich-22.jpg" },
    ],
  },
  {
    id: "wrap",
    name: "또띠아랩",
    sub: "Tortilla Wrap · 4종",
    desc: "한 손에 들고 먹기 좋은 또띠아랩.",
    tag: "4 VARIETIES",
    items: [
      { name: "스파이시에그치킨랩", image: "/images/menu/wrap-01.jpg" },
      { name: "커리치킨랩", image: "/images/menu/wrap-02.jpg" },
      { name: "클래식에그튜나랩", image: "/images/menu/wrap-03.jpg" },
      { name: "햄에그피클랩", image: "/images/menu/wrap-04.jpg" },
    ],
  },
  {
    id: "bagel",
    name: "베이글",
    sub: "Bagel · 6종",
    desc: "쫄깃한 식감의 베이글에 엄선한 속재료를 채웠습니다.",
    tag: "6 VARIETIES",
    items: [
      { name: "무화과호두크림베이글", image: "/images/menu/bagel-01.jpg" },
      { name: "베이컨대파크림베이글", image: "/images/menu/bagel-02.jpg" },
      { name: "블루베리크림베이글", image: "/images/menu/bagel-03.jpg" },
      { name: "당근라페베이글", image: "/images/menu/bagel-04.jpg" },
      { name: "바질토마토크림베이글", image: "/images/menu/bagel-05.jpg" },
      { name: "닭가슴살베이글", image: "/images/menu/bagel-06.jpg" },
    ],
  },
  {
    id: "gimbap",
    name: "김밥",
    sub: "Gimbap · 13종",
    desc: "매일 새벽 직접 만드는 김밥. 한식이 익숙한 분들의 선택지를 넓혀드립니다.",
    tag: "13 VARIETIES",
    items: [
      { name: "일반김밥", image: "/images/menu/gimbap-01.jpg" },
      { name: "치즈김밥", image: "/images/menu/gimbap-02.jpg" },
      { name: "참치김밥", image: "/images/menu/gimbap-03.jpg" },
      { name: "매운어묵김밥", image: "/images/menu/gimbap-04.jpg" },
      { name: "샐러드김밥", image: "/images/menu/gimbap-05.jpg" },
      { name: "무말랭이김밥", image: "/images/menu/gimbap-06.jpg" },
      { name: "너비아니김밥", image: "/images/menu/gimbap-07.jpg" },
      { name: "계란김밥", image: "/images/menu/gimbap-08.jpg" },
      { name: "유부김밥", image: "/images/menu/gimbap-09.jpg" },
      { name: "돈까스김밥", image: "/images/menu/gimbap-10.jpg" },
      { name: "마라김밥", image: "/images/menu/gimbap-11.jpg" },
      { name: "오이당근김밥", image: "/images/menu/gimbap-12.jpg" },
      { name: "양배추당근김밥", image: "/images/menu/gimbap-13.jpg" },
    ],
  },
  {
    id: "inari",
    name: "유부초밥",
    sub: "Inari · 7종",
    desc: "담백하고 든든한 유부초밥. 한 끼 식사로도, 간식으로도 충분합니다.",
    tag: "7 VARIETIES",
    items: [
      { name: "일반유부초밥", image: "/images/menu/inari-01.jpg" },
      { name: "크래미유부초밥", image: "/images/menu/inari-02.jpg" },
      { name: "햄유부초밥", image: "/images/menu/inari-03.jpg" },
      { name: "날치알유부초밥", image: "/images/menu/inari-04.jpg" },
      { name: "김치유부초밥", image: "/images/menu/inari-05.jpg" },
      { name: "비건저당유부초밥", image: "/images/menu/inari-06.jpg" },
      { name: "참치유부초밥", image: "/images/menu/inari-07.jpg" },
    ],
  },
  {
    id: "cupbap",
    name: "컵밥",
    sub: "Cup Rice · 6종",
    desc: "간편하게 즐기는 컵밥. 든든한 한 끼를 빠르게.",
    tag: "6 VARIETIES",
    items: [
      { name: "야채볶음컵밥", image: "/images/menu/cupbap-01.jpg" },
      { name: "새우볶음컵밥", image: "/images/menu/cupbap-02.jpg" },
      { name: "김치볶음컵밥", image: "/images/menu/cupbap-03.jpg" },
      { name: "카레볶음컵밥", image: "/images/menu/cupbap-04.jpg" },
      { name: "낙지볶음컵밥", image: "/images/menu/cupbap-05.jpg" },
      { name: "소불고기컵밥", image: "/images/menu/cupbap-06.jpg" },
    ],
  },
  {
    id: "salad",
    name: "샐러드",
    sub: "Salad · 9종",
    desc: "신선한 재료로 만드는 샐러드 9종.",
    tag: "9 VARIETIES",
    items: [
      { name: "리코타치즈샐러드", image: "/images/menu/salad-01.jpg" },
      { name: "두부버섯샐러드", image: "/images/menu/salad-02.jpg" },
      { name: "크래미샐러드", image: "/images/menu/salad-03.jpg" },
      { name: "닭가슴살샐러드", image: "/images/menu/salad-04.jpg" },
      { name: "단호박샐러드", image: "/images/menu/salad-05.jpg" },
      { name: "살사후실리샐러드", image: "/images/menu/salad-06.jpg" },
      { name: "고구마샐러드", image: "/images/menu/salad-07.jpg" },
      { name: "훈제오리샐러드", image: "/images/menu/salad-08.jpg" },
      { name: "훈제연어샐러드", image: "/images/menu/salad-09.jpg" },
    ],
  },
  {
    id: "side",
    name: "사이드 · 기타",
    sub: "Sides & More",
    desc: "식사를 완성하는 과일, 음료, 디저트 라인업.",
    tag: "SIDES & DRINKS",
    items: [
      { name: "떡산적", image: "/images/menu/side-01.jpg" },
      { name: "닭강정", image: "/images/menu/side-02.jpg" },
      { name: "미니돈까스", image: "/images/menu/side-03.jpg" },
      { name: "만두튀김", image: "/images/menu/side-04.jpg" },
      { name: "과일 2종", image: "/images/menu/side-05.jpg" },
      { name: "과일 3종", image: "/images/menu/side-06.jpg" },
      { name: "요거트", image: "/images/menu/side-07.jpg" },
      { name: "단백질쉐이크", image: "/images/menu/side-08.jpg" },
      { name: "구운계란", image: "/images/menu/side-09.jpg" },
      { name: "하루견과", image: "/images/menu/side-10.jpg" },
    ],
  },
];


export default function MenuClient() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10">
      {/* 카테고리 바로가기 */}
      <nav aria-label="메뉴 카테고리" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map(({ id, name, items }) => (
          <a
            key={id}
            href={`#menu-${id}`}
            className="group bg-surface-subtle border border-line rounded-[var(--radius-lg)] p-3 flex items-center gap-3 hover:border-line-strong transition-colors break-keep"
          >
            <Image src={items[0].image} alt="" width={64} height={64} className="w-14 h-14 rounded-[var(--radius-md)] shrink-0" />
            <span className="min-w-0 text-forest-deep text-[16px] font-bold group-hover:underline">{name}</span>
          </a>
        ))}
      </nav>

      {categories.map(({ id, name, desc, items, tag }) => (
        <section key={id} id={`menu-${id}`} className="scroll-mt-6 pt-14 md:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-4 break-keep">
            <div>
              <p className="text-gold-text text-[13px] font-bold tracking-[0.14em]">{tag}</p>
              <h2 className="mt-1 text-ink text-[28px] md:text-[32px] font-extrabold tracking-[-0.02em]">
                {name} <span className="text-forest-deep text-[18px] md:text-[20px] font-bold align-middle">{items.length}종</span>
              </h2>
            </div>
            <p className="text-ink-body text-[15px] max-w-md">{desc}</p>
          </div>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
            {items.map((item) => (
              <li key={item.name} className="text-center break-keep">
                <div className="bg-surface rounded-[var(--radius-lg)] border border-line overflow-hidden">
                  <Image src={item.image} alt={item.name} width={560} height={560} className="w-full h-auto" />
                </div>
                <p className="mt-2.5 text-ink text-[15px] md:text-[16px] font-bold">{item.name}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

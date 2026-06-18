import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 | 더기빙트리",
  description: "기업 정기조식, 단체 도시락, 김밥·한식 라인, 행사 간식 패키지, 대규모 케이터링 — 더기빙트리의 5가지 B2B 식사 서비스.",
};

const services = [
  {
    num: "01",
    title: "기업 정기조식 구독 서비스",
    subtitle: "Corporate Breakfast Subscription",
    desc: "고객사의 아침 운영을 대신 책임지는 일. 임직원이 더 좋은 하루를 시작하게 만듭니다.",
    detail: "4주 단위 자동 식단 로테이션으로 70가지가 넘는 메뉴를 구성합니다. 같은 메뉴가 반복되지 않고, 고객이 메뉴를 고민하지 않아도 됩니다. 매일 새벽 직접 생산하여 신선도를 보장합니다.",
    tags: ["정기배송", "4주 로테이션", "70+ 메뉴"],
    our: "매일의 식단 고민을 우리가 대신합니다.",
  },
  {
    num: "02",
    title: "단체 도시락 · 샌드위치 박스",
    subtitle: "Group Lunch & Sandwich Box",
    desc: "미팅·세미나·점심 회의의 점심을 책임지는 일.",
    detail: "시스템과 사람의 더블 체크로 오주문·결품·지연을 막습니다. 정확한 수량과 정시 도착이 우리의 약속입니다. 행사 당일 담당자가 다른 일에 집중할 수 있도록 식사는 우리가 맡습니다.",
    tags: ["수량 보장", "정시 배송", "더블 체크"],
    our: "정확한 수량과 시간을 한 치도 어기지 않습니다.",
  },
  {
    num: "03",
    title: "김밥 · 유부초밥 한식 라인",
    subtitle: "Korean Food Line",
    desc: "김밥 11종·유부초밥 6종·컵밥 6종. 한식이 익숙한 분들의 선택지를 넓힙니다.",
    detail: "매일 새벽 직접 생산하는 한식 라인입니다. 재료부터 약속까지, 보이지 않는 곳에서도 같은 기준을 지킵니다. 매일 다른 메뉴를 같은 품질로 만드는 것이 우리의 일입니다.",
    tags: ["김밥 11종", "유부초밥 6종", "컵밥 6종"],
    our: "매일 다른 메뉴를 같은 품질로 만듭니다.",
  },
  {
    num: "04",
    title: "행사 간식 패키지",
    subtitle: "Event Snack Package",
    desc: "학회·세미나·임직원 행사의 담당자 부담을 줄여드립니다.",
    detail: "행사 규모·예산·성격에 맞춰 최적 패키지를 제안합니다. 견적·식단·운영안이 하루 안에 정리되어 고객에게 전달됩니다. 한 사람의 부담을 우리가 가져갑니다.",
    tags: ["맞춤 제안", "당일 견적", "행사 전담"],
    our: "\"한 사람의 부담을 우리가 가져갑니다.\"",
  },
  {
    num: "05",
    title: "대규모 케이터링",
    subtitle: "Large-scale Catering",
    desc: "100인 이상 대형 행사. 정확한 준비와 현장 대응이 핵심.",
    detail: "한 번의 실수가 행사 전체를 흔드는 일입니다. 체계적인 사전 준비와 당일 현장 대응 시스템으로 리스크를 최소화합니다. 우리가 가장 어렵고, 가장 신중하게 접근하는 서비스입니다.",
    tags: ["100인 이상", "현장 대응", "사전 기획"],
    our: "한 번의 실수가 행사 전체를 흔드는 일.",
    dark: true,
  },
];

const principles = [
  { title: "4주 단위 자동 식단 운영", desc: "70가지가 넘는 메뉴를 4주 주기로 자동 로테이션. 같은 메뉴가 반복되지 않게." },
  { title: "정확한 주문 · 정확한 배송", desc: "시스템과 사람의 더블 체크로 오주문·결품·지연을 막습니다." },
  { title: "고객사 맞춤 운영 제안", desc: "예산·인원·행사 성격에 맞춰 최적 패키지를 제안. 하루 안에 정리됩니다." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-ink">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-mono">Services</p>
          <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl text-cream font-semibold leading-tight break-keep mb-8">
            단순히 조식배달을 넘어,<br />
            <span className="text-gold italic">고객의 운영부담을</span><br />
            줄여드립니다.
          </h1>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-forest py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream/20">
            {principles.map(({ title, desc }) => (
              <div key={title} className="px-8 py-6 first:pl-0 last:pr-0">
                <h3 className="font-[family-name:var(--font-maruburi)] text-xl text-gold font-semibold mb-2 break-keep">{title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed break-keep">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service list */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
          {services.map(({ num, title, subtitle, desc, detail, tags, our, dark }) => (
            <div
              key={num}
              className={`rounded-2xl p-10 ${dark ? "bg-bark text-cream" : "bg-paper border border-pale-sage"}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gold text-xs tracking-widest font-mono">{num}</span>
                    <span className={`text-xs tracking-widest ${dark ? "text-cream/40" : "text-bark/40"}`}>{subtitle}</span>
                  </div>
                  <h2 className={`font-[family-name:var(--font-maruburi)] text-3xl font-semibold mb-3 break-keep ${dark ? "text-cream" : "text-ink"}`}>
                    {title}
                  </h2>
                  <p className={`text-base mb-6 break-keep ${dark ? "text-cream/70" : "text-bark/70"}`}>{desc}</p>
                  <p className={`text-sm leading-relaxed break-keep mb-6 ${dark ? "text-cream/60" : "text-bark/60"}`}>{detail}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                      <span key={tag} className={`text-xs px-3 py-1 rounded-full ${dark ? "bg-cream/10 text-cream/70" : "bg-pale-sage text-forest"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`lg:w-72 flex-shrink-0 rounded-xl p-6 ${dark ? "bg-cream/10" : "bg-pale-sage"}`}>
                  <div className="text-xs tracking-widest text-gold font-mono mb-3">우리의 일</div>
                  <p className={`font-[family-name:var(--font-maruburi)] text-lg font-semibold break-keep ${dark ? "text-cream" : "text-ink"}`}>{our}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-maruburi)] text-4xl text-cream font-semibold mb-4 break-keep">
            어떤 서비스가 맞는지<br />함께 찾아드립니다.
          </h2>
          <p className="text-cream/60 mb-8 break-keep">규모와 예산에 맞는 최적 패키지를 제안해 드립니다.</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gold text-bark font-medium rounded-full hover:bg-cream transition-colors"
          >
            무료 견적 문의
          </Link>
        </div>
      </section>
    </>
  );
}

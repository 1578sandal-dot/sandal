import type { Metadata } from "next";
import Link from "next/link";
import { Cta, PageHero, Section } from "@/components/sandal";

export const metadata: Metadata = {
  title: "서비스 | 샌달조식",
  description: "기업 정기조식, 단체 도시락, 김밥·한식 라인, 행사 간식 패키지, 대규모 케이터링 — 샌달조식의 5가지 B2B 식사 서비스.",
};

const services = [
  {
    num: "01",
    title: "기업 정기조식 구독서비스",
    subtitle: "Corporate Breakfast Subscription",
    desc: "고객사의 아침을 책임지는 기업조식 서비스를 제공합니다.\n기업의 활기찬 아침을 열어 더 좋은 하루를 선사합니다.",
    detail: "기업별 운영요일·예산·선호도를 고려해 4주 식단안을 제안드립니다.\n주요 메뉴는 매일 새벽 직접 제조하여 약속된 시간에 전달하고, 사내 지정장소 진열까지 가능합니다.",
    tags: ["정기배송", "4주 식단", "새벽배송·사내진열"],
    our: "매일의 식단 고민을 우리가 대신합니다.",
    href: "/breakfast",
    main: true,
  },
  {
    num: "02",
    title: "단체 도시락 · 샌드위치 박스",
    subtitle: "Group Lunch & Sandwich Box",
    desc: "미팅·세미나·점심 회의의 식사를 책임지는 일.",
    detail: "시스템과 사람의 더블 체크로 오주문·결품·지연을 막습니다. 정확한 수량과 정시 도착이 우리의 약속입니다. 행사 당일 담당자가 다른 일에 집중할 수 있도록 식사는 우리가 맡습니다.",
    tags: ["수량 확인", "정시 배송", "더블 체크"],
    our: "정확한 수량과 시간을 지킵니다.",
  },
  {
    num: "03",
    title: "김밥 · 유부초밥 한식 라인",
    subtitle: "Korean Food Line",
    desc: "김밥 13종·유부초밥 7종·컵밥 6종. 한식이 익숙한 분들의 선택지를 넓힙니다.",
    detail: "매일 새벽 직접 생산하는 한식 라인입니다. 재료부터 약속까지, 보이지 않는 곳에서도 같은 기준을 지킵니다. 매일 다른 메뉴를 같은 품질로 만드는 것이 우리의 일입니다.",
    tags: ["김밥 13종", "유부초밥 7종", "컵밥 6종"],
    our: "매일 다른 메뉴를 같은 품질로 만듭니다.",
  },
  {
    num: "04",
    title: "행사 간식 패키지",
    subtitle: "Event Snack Package",
    desc: "학회·세미나·임직원 행사의 담당자 부담을 줄여드립니다.",
    detail: "행사 규모·예산·성격에 맞춰 패키지를 제안합니다. 견적·식단·운영안을 정리해 전달하고, 한 사람의 부담을 우리가 가져갑니다.",
    tags: ["맞춤 제안", "견적 협의", "행사 전담"],
    our: "한 사람의 부담을 우리가 가져갑니다.",
  },
  {
    num: "05",
    title: "대규모 케이터링",
    subtitle: "Large-scale Catering",
    desc: "대형 행사. 정확한 준비와 현장 대응이 핵심입니다.",
    detail: "한 번의 실수가 행사 전체를 흔드는 일입니다. 체계적인 사전 준비와 당일 현장 대응으로 리스크를 줄입니다. 우리가 가장 신중하게 접근하는 서비스입니다.",
    tags: ["대형 행사", "현장 대응", "사전 기획"],
    our: "한 번의 실수가 행사 전체를 흔드는 일.",
  },
];

const principles = [
  { title: "4주 단위 식단 운영", desc: "다양한 메뉴를 4주 식단으로 구성해, 한 달 동안 지루하지 않게 운영합니다." },
  { title: "정확한 주문 · 정확한 배송", desc: "시스템과 사람의 더블 체크로 오주문·결품·지연을 막습니다." },
  { title: "고객사 맞춤 운영 제안", desc: "예산·인원·행사 성격에 맞춰 구성을 제안하고 협의합니다." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        title={<>단순히 조식배달을 넘어,<br /><em>고객의 운영부담을</em> 줄여드립니다.</>}
      />

      <section className="bg-forest">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-10 grid md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-white/20 break-keep">
          {principles.map(({ title, desc }) => (
            <div key={title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <h2 className="text-logo-yellow text-[20px] font-bold">{title}</h2>
              <p className="mt-2 text-white/85 text-[15px] leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="flex flex-col gap-6">
          {services.map(({ num, title, subtitle, desc, detail, tags, our, href, main }) => (
            <article
              key={num}
              className={`rounded-[var(--radius-xl)] border p-7 md:p-10 break-keep ${main ? "bg-cream border-line-strong" : "bg-surface-subtle border-line"}`}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gold-text text-[15px] font-extrabold">{num}</span>
                    <span className="text-ink-muted text-[13px] tracking-[0.1em] uppercase">{subtitle}</span>
                    {main && <span className="bg-forest-deep text-white text-[13px] font-bold px-2.5 py-1 rounded-[var(--radius-sm)]">대표 서비스</span>}
                  </div>
                  <h2 className="mt-3 text-forest-deep text-[24px] md:text-[28px] font-extrabold">{title}</h2>
                  <p className="mt-3 text-ink text-[17px] leading-7 whitespace-pre-line">{desc}</p>
                  <p className="mt-3 text-ink-body text-[16px] leading-[26px] whitespace-pre-line">{detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="bg-surface border border-line text-forest-deep text-[14px] font-bold rounded-full px-3.5 py-1.5">{tag}</span>
                    ))}
                  </div>
                  {href && (
                    <Link href={href} className="inline-block mt-5 text-forest-deep font-bold text-[16px] hover:underline">기업 정기조식 자세히 보기 →</Link>
                  )}
                </div>
                <div className="lg:w-72 shrink-0 bg-mint rounded-[var(--radius-md)] p-6 self-start">
                  <p className="text-forest-deep text-[13px] font-bold tracking-[0.1em]">우리의 일</p>
                  <p className="mt-2 text-ink text-[18px] leading-7 font-bold">{our}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <Cta caption="규모와 예산에 맞는 구성을 제안해 드립니다.">무료 견적 문의</Cta>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Cta, PageHero, Section, SectionHeading } from "@/components/sandal";

export const metadata: Metadata = {
  title: "회사소개 | 샌달조식",
  description: "2013년부터 10년간 현장에서 버텨온 ㈜더기빙트리의 이야기. 착즙주스에서 시작해 기업 조식 운영 브랜드 샌달조식으로.",
};

const journey = [
  { year: "2013", title: "아주나 · 착즙주스로 첫 출발", desc: "음식을 다루는 일이 가진 무게를 처음 배운 시기" },
  { year: "2015", title: "아주나무 카페 오픈 · 파주 브런치 배달", desc: "매장 운영과 배달을 동시에 — 우리만의 운영 감각이 쌓이기 시작" },
  { year: "2017", title: "광화문 확장 · 도심 기업 고객과의 첫 만남", desc: "기업 임직원의 아침과 오후를 책임지는 일이 시작된 자리" },
  { year: "2021", title: "청년창업사관학교 수료 · 정부지원금 확보", desc: "중소벤처기업진흥공단의 검증 — 외부에서 본 우리의 실행력" },
  { year: "2021", title: "재도전 성공패키지 합격 · 다시 일어선 회사", desc: "힘든 시기를 함께 통과하며 더 단단해진 운영 기반" },
  { year: "2023", title: "샌달(SanDal) 시작 · 상표등록 완료", desc: "우리만의 이름으로 B2B 샌드위치 배달의 새 장을 열다" },
];

const values = [
  { en: "Generosity", ko: "베풂", desc: "받는 것보다 나누는 것이 먼저인 기업." },
  { en: "Integrity", ko: "정직", desc: "재료부터 약속까지, 보이지 않는 곳에서도 같은 기준." },
  { en: "Growth", ko: "성장", desc: "사람과 시스템이 함께 성장하는 조직." },
  { en: "Care", ko: "정성", desc: "손이 한 번 더 가는 일, 그 한 번을 통해 전하는 진심." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title={<>샌달조식은<br /><em>하루아침에 만들어진</em><br />회사가 아닙니다.</>}
        description="착즙주스, 카페, 브런치 배달 — 10년간 현장에서 버티며 만든 회사입니다. 외부에서도, 정부도 우리의 실행력을 인정해 주었습니다."
      />

      <Section>
        <Image
          src="/images/직원오리엔테이션_더기빙트리.jpg"
          alt="샌달조식 직원 오리엔테이션"
          width={1200}
          height={700}
          className="w-full h-[280px] md:h-[440px] object-cover object-top rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]"
        />
        <div className="mt-10 grid md:grid-cols-2 gap-6 break-keep">
          <div className="bg-forest rounded-[var(--radius-xl)] p-8 md:p-10 text-white">
            <p className="text-logo-yellow text-[14px] font-bold tracking-[0.14em]">VISION · 비전</p>
            <h2 className="mt-4 text-[28px] leading-9 md:text-[32px] md:leading-[42px] font-extrabold">좋은 음식이<br />좋은 하루를 만든다.</h2>
            <p className="mt-2 text-white/70 text-[15px]">Good food makes a good day.</p>
            <p className="mt-4 text-white/85 text-[16px] leading-[26px]">좋은 음식으로 사람의 하루를 돌보고, 건강하고 지속 가능한 식탁 문화를 만드는 기업으로.</p>
          </div>
          <div className="bg-cream rounded-[var(--radius-xl)] p-8 md:p-10">
            <p className="text-gold-text text-[14px] font-bold tracking-[0.14em]">MISSION · 미션</p>
            <h2 className="mt-4 text-ink text-[28px] leading-9 md:text-[32px] md:leading-[42px] font-extrabold">정직한 재료로,<br /><span className="text-forest-deep">누군가의 식탁을 정성껏</span> 책임진다.</h2>
            <p className="mt-2 text-ink-muted text-[15px]">Honest food, a table cared for.</p>
            <p className="mt-4 text-ink-body text-[16px] leading-[26px]">식품 제조·정기식 서비스·유통·스마트팜 기반 식재료 사업까지, 뿌리부터 식탁까지 이어지는 정직한 여정.</p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading align="left" eyebrow="OUR JOURNEY" title={<>우리가 <em>걸어온 길.</em></>} />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <ol className="bg-surface border border-line rounded-[var(--radius-xl)] px-6 md:px-8 divide-y divide-line">
            {journey.map(({ year, title, desc }, i) => (
              <li key={i} className="flex gap-5 py-5 break-keep">
                <span className="text-gold-text text-[17px] font-extrabold w-12 shrink-0 tabular-nums">{year}</span>
                <div>
                  <h3 className="text-forest-deep text-[17px] md:text-[18px] font-bold">{title}</h3>
                  <p className="mt-1 text-ink-body text-[15px]">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-5">
            <Image src="/images/아주나무-전체 사진-62680825419.jpg" alt="샌드위치 대량 생산" width={960} height={640} className="w-full h-64 object-cover rounded-[var(--radius-lg)]" />
            <Image src="/images/아주나무-전체 사진-62689612637.jpg" alt="배송 준비" width={960} height={640} className="w-full h-52 object-cover rounded-[var(--radius-lg)]" />
            <div className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] p-6 break-keep">
              <p className="text-forest-deep text-[14px] font-bold">외부의 시선</p>
              <p className="mt-1 text-ink text-[17px] font-bold">정부와 외부 기관이 우리의 사업성을 인정해 준 회사</p>
              <p className="mt-3 text-gold text-[36px] leading-[44px] font-extrabold tracking-[-0.02em]">1.48억원</p>
              <p className="text-ink-muted text-[14px]">누적 정부지원금</p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="BRAND VALUES" title={<>샌달조식이<br /><em>추구하는 가치.</em></>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map(({ en, ko, desc }) => (
            <article key={en} className="bg-surface border border-line rounded-[var(--radius-xl)] p-7 break-keep">
              <p className="text-gold-text text-[13px] font-bold tracking-[0.14em] uppercase">{en}</p>
              <h3 className="mt-2 text-forest-deep text-[28px] font-extrabold">{ko}</h3>
              <p className="mt-3 text-ink-body text-[15px] leading-6">{desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-forest">
        <div className="max-w-3xl mx-auto px-4 md:px-10 py-16 md:py-20 text-center break-keep">
          <blockquote className="text-white text-[22px] leading-9 md:text-[30px] md:leading-[46px] font-bold">
            지난 10년은 현장에서 버텨온 시간이었습니다.<br />
            앞으로의 10년은 함께 시스템을 만들고<br />
            <span className="text-logo-yellow">성장하는 시간입니다.</span>
          </blockquote>
          <p className="mt-6 text-white/70 text-[15px]">— Founder &amp; CEO 이창훈 · The Giving Tree Co., Ltd.</p>
        </div>
      </section>

      <Section>
        <Cta caption="우리 회사도 운영 가능한지 확인해보세요.">도입 상담하기</Cta>
      </Section>
    </>
  );
}

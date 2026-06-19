import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "회사소개 | 더기빙트리",
  description: "2013년부터 10년간 현장에서 버텨온 더기빙트리의 이야기. 착즙주스에서 시작해 기업 식사 운영 전문 회사로.",
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
      {/* Hero */}
      <section className="pt-32 pb-0 bg-cream overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="pb-20">
              <p className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-mono">About Us</p>
              <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl text-ink font-semibold leading-tight break-keep mb-8">
                더기빙트리는<br />
                <span className="text-forest italic">하루아침에 만들어진</span><br />
                회사가 아닙니다.
              </h1>
              <p className="text-bark/60 text-lg leading-relaxed max-w-2xl break-keep">
                착즙주스, 카페, 브런치 배달 — 10년간 현장에서 버티며 만든 회사입니다.<br />
                외부에서도, 정부도 우리의 실행력을 인정해 주었습니다.
              </p>
            </div>
            <div className="relative h-80 lg:h-[480px] rounded-tl-2xl rounded-tr-2xl overflow-hidden">
              <Image
                src="/images/직원오리엔테이션_더기빙트리.jpg"
                alt="더기빙트리 케이터링"
                fill
                className="object-cover object-top"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-forest rounded-2xl p-10">
            <div className="text-gold text-xs tracking-widest mb-4 font-mono">VISION · 비전</div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl text-cream font-semibold leading-tight mb-4 break-keep">
              좋은 음식이<br />좋은 하루를<br />만든다.
            </h2>
            <p className="font-[family-name:var(--font-maruburi)] italic text-gold mb-4">Good food makes a good day.</p>
            <p className="text-cream/60 text-sm leading-relaxed break-keep">
              좋은 음식으로 사람의 하루를 돌보고, 건강하고 지속 가능한 식탁 문화를 만드는 기업으로.
            </p>
          </div>
          <div className="bg-bark rounded-2xl p-10">
            <div className="text-gold text-xs tracking-widest mb-4 font-mono">MISSION · 미션</div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl text-cream font-semibold leading-tight mb-4 break-keep">
              정직한 재료로,<br />누군가의 식탁을<br />정성껏 책임진다.
            </h2>
            <p className="font-[family-name:var(--font-maruburi)] italic text-gold mb-4">Honest food, a table cared for.</p>
            <p className="text-cream/60 text-sm leading-relaxed break-keep">
              식품 제조·정기식 서비스·유통·스마트팜 기반 식재료 사업까지, 뿌리부터 식탁까지 이어지는 정직한 여정.
            </p>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-pale-sage py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-12">
                <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4 font-mono">Our Journey</p>
                <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-ink font-semibold leading-tight break-keep">
                  우리가 걸어온 길.
                </h2>
              </div>
              <div className="flex flex-col gap-0">
                {journey.map(({ year, title, desc }, i) => (
                  <div key={i} className="flex gap-6 py-6 border-b border-pale-sage/80 last:border-0">
                    <div className="font-[family-name:var(--font-maruburi)] text-xl text-gold font-semibold w-14 flex-shrink-0">{year}</div>
                    <div>
                      <h3 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-1 break-keep">{title}</h3>
                      <p className="text-sm text-bark/60 break-keep">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 sticky top-24">
              <div className="relative h-72 rounded-2xl overflow-hidden">
                <Image
                  src="/images/아주나무-전체 사진-62680825419.jpg"
                  alt="샌드위치 대량 생산"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden">
                <Image
                  src="/images/아주나무-전체 사진-62689612637.jpg"
                  alt="배송 준비"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="bg-forest/10 border border-forest/20 rounded-2xl p-6">
                <div className="text-xs text-forest tracking-widest mb-2 font-mono">외부의 시선</div>
                <div className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold break-keep mb-3">정부와 외부 기관이 우리의 사업성을 인정해 준 회사</div>
                <div className="font-[family-name:var(--font-maruburi)] text-3xl text-forest font-semibold">1.48억원</div>
                <div className="text-xs text-bark/50 mt-1">누적 정부지원금</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4 font-mono">Brand Values</p>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-ink font-semibold leading-tight break-keep">
              더기빙트리가<br />추구하는 가치.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ en, ko, desc }) => (
              <div key={en} className="bg-paper border border-pale-sage rounded-2xl p-8">
                <div className="text-xs tracking-widest text-gold font-mono mb-3 uppercase">{en}</div>
                <div className="font-[family-name:var(--font-maruburi)] text-3xl text-forest font-semibold mb-4">{ko}</div>
                <p className="text-sm text-bark/60 leading-relaxed break-keep">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-forest py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-gold text-4xl font-[family-name:var(--font-maruburi)] mb-6">"</div>
          <blockquote className="font-[family-name:var(--font-maruburi)] text-3xl md:text-4xl text-cream font-semibold leading-relaxed break-keep mb-8">
            지난 10년은 현장에서 버텨온 시간이었습니다.<br />
            앞으로의 10년은 함께 시스템을 만들고<br />
            <span className="text-gold italic">성장하는 시간입니다.</span>
          </blockquote>
          <p className="text-cream/40 text-sm">— Founder &amp; CEO 이창훈 · The Giving Tree Co., Ltd.</p>
        </div>
      </section>
    </>
  );
}

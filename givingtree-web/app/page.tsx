import Link from "next/link";
import { Button, CONTACT, Section } from "@/components/sandal";

const stats = [
  { value: "10년+", label: "운영 노하우" },
  { value: "950명+", label: "최대 운영 규모" },
  { value: "300만 개+", label: "샌달 브랜드 누적 판매" },
  { value: "98.7%", label: "기존 고객평가" },
];

const worries = [
  { q: "오늘은 또 뭘 시키지?", a: "기업별 운영요일·예산·선호도를 고려해 4주 식단안을 제안하고 협의합니다." },
  { q: "수량이 모자라면 어떡하지?", a: "약정한 수량을 새벽에 전달하고, 수량 변경은 원칙적으로 최소 2일 전 협의합니다." },
  { q: "주문, 정산, 식수 관리…", a: "견적서·거래명세서·전자세금계산서·월정산까지 함께 처리해 담당자의 부담을 덜어드립니다." },
];

const services = [
  { tag: "대표 서비스", title: "기업 정기조식 구독", desc: "4주 식단, 새벽배송, 사내진열까지 기업의 아침을 운영합니다.", href: "/breakfast", main: true },
  { tag: "단체 주문", title: "단체 도시락·샌드위치 박스", desc: "미팅·세미나·회의 식사를 약속한 수량과 시간에 맞춰 준비합니다.", href: "/services" },
  { tag: "한식 라인", title: "김밥·유부초밥 한식 라인", desc: "김밥 13종·유부초밥 7종·컵밥 6종을 같은 기준으로 만듭니다.", href: "/menu" },
  { tag: "행사", title: "행사 간식 패키지", desc: "학회·세미나·임직원 행사의 간식 준비 부담을 덜어드립니다.", href: "/services" },
  { tag: "행사", title: "대규모 케이터링", desc: "대규모 행사의 준비와 현장 진열까지 협의합니다.", href: "/services" },
];

export default function HomePage() {
  return (
    <>
      {/* 히어로 */}
      <section className="bg-surface">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="break-keep">
            <span className="inline-block bg-mint text-forest-deep text-[14px] font-bold rounded-full px-4 py-1.5">기업 조식 정기운영 전문</span>
            <h1 className="mt-5 text-ink text-[40px] leading-[50px] md:text-[56px] md:leading-[68px] font-extrabold tracking-[-0.02em]">
              기업 조식은<br />
              <span className="text-forest-deep">샌달조식</span>
            </h1>
            <p className="mt-5 text-ink-body text-[17px] leading-7 md:text-[19px] md:leading-8">
              정기조식부터 단체 도시락, 김밥·유부초밥, 행사 간식까지.<br className="hidden md:block" />
              4주 식단과 새벽배송으로 기업의 아침을 운영합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="md">무료 견적 받기</Button>
              <Button href="/menu" variant="secondary" size="md">메뉴 보기</Button>
            </div>
          </div>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sandal-logo-green.svg" alt="샌달조식 로고" width={400} height={347} className="w-full max-w-[240px] md:max-w-[400px] h-auto" />
          </div>
        </div>
      </section>

      {/* 숫자 띠 */}
      <section className="bg-forest">
        <dl className="max-w-5xl mx-auto px-4 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-logo-yellow text-[30px] leading-9 md:text-[40px] md:leading-[48px] font-extrabold tracking-[-0.02em]">{s.value}</dd>
              <dd className="mt-1 text-white/85 text-[14px] md:text-[16px]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 담당자 고민 */}
      <Section>
        <h2 className="text-ink text-[28px] leading-9 md:text-[34px] md:leading-[44px] font-extrabold tracking-[-0.02em] break-keep">
          담당자님의 아침 고민,<br />
          <span className="text-forest-deep">샌달조식이 덜어드립니다</span>
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {worries.map((w, i) => (
            <article key={w.q} className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] p-7 break-keep">
              <p className="text-gold-text text-[15px] font-extrabold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-forest-deep text-[20px] leading-7 font-bold">&ldquo;{w.q}&rdquo;</h3>
              <p className="mt-2 text-ink-body text-[16px] leading-[26px]">{w.a}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 서비스 */}
      <Section tone="muted">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="text-ink text-[28px] leading-9 md:text-[34px] md:leading-[44px] font-extrabold tracking-[-0.02em]">
            <span className="text-forest-deep">샌달조식</span> 서비스
          </h2>
          <Link href="/menu" className="text-forest-deep font-bold text-[15px] hover:underline">전체 메뉴 보기 →</Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className={`group rounded-[var(--radius-xl)] p-6 border break-keep flex flex-col transition-colors ${
                s.main ? "bg-forest border-forest text-white" : "bg-surface border-line hover:border-line-strong"
              }`}
            >
              <span className={`self-start text-[13px] font-bold rounded-[var(--radius-sm)] px-2.5 py-1 ${s.main ? "bg-logo-yellow text-ink" : "bg-mint text-forest-deep"}`}>{s.tag}</span>
              <h3 className={`mt-4 text-[19px] leading-7 font-bold ${s.main ? "text-white" : "text-forest-deep"}`}>{s.title}</h3>
              <p className={`mt-2 text-[15px] leading-6 flex-1 ${s.main ? "text-white/85" : "text-ink-body"}`}>{s.desc}</p>
              <span className={`mt-4 text-[14px] font-bold ${s.main ? "text-white" : "text-forest-deep"} group-hover:underline`}>자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 상담 띠 */}
      <section className="bg-forest text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-14 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 break-keep">
          <div>
            <h2 className="text-[28px] leading-9 md:text-[34px] md:leading-[44px] font-extrabold tracking-[-0.02em]">
              귀사의 아침,<br />
              샌달조식이 책임집니다
            </h2>
            <p className="mt-3 text-white/85 text-[16px] md:text-[17px]">인원·지역·예산·운영조건을 알려주시면 우리 회사에 맞는 운영 가능 여부부터 안내드립니다.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <Link href="/contact" className="h-[52px] px-7 inline-flex items-center rounded-[var(--radius-md)] bg-surface text-forest-deep font-bold text-[17px] hover:bg-mint transition-colors">
              무료 견적 문의
            </Link>
            <a href={CONTACT.tel} className="text-white text-[22px] md:text-[24px] font-extrabold">전화 {CONTACT.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}

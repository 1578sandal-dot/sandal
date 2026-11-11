import type { Metadata } from "next";
import Image from "next/image";
import { Button, Chip, Closing, CONTACT, Cta, Section, SectionHeading, StatGroup } from "@/components/sandal";

export const metadata: Metadata = {
  title: "기업 정기조식 | 샌달조식",
  description: "4주 식단, 주요 메뉴 직접 제조, 새벽배송, 사내진열까지. 샌달조식 기업 정기조식 운영 방식과 예산별 구성, 운영조건을 확인하세요.",
};

const img = (name: string) => `/images/sandal/${name}.jpg`;

const direct = [
  { label: "DIRECT 01", title: "주요 원재료 직접 확인 및 구매 관리", desc: "신선한 식재료의 선별부터 검수와 구매까지, 샌달조식이 원천부터 직접 관리합니다.", src: "direct-1" },
  { label: "DIRECT 02", title: "주요 메뉴 직접 제조 및 포장", desc: "자체 위생 생산 시설에서 메인 메뉴를 직접 조리하고, 품질 유지를 위해 꼼꼼하게 포장합니다.", src: "direct-2", highlight: true },
  { label: "DIRECT 03", title: "새벽배송으로 아침을 전달", desc: "준비한 조식을 약속된 시간에 전달해, 임직원이 아침에 바로 이용할 수 있도록 합니다.", src: "direct-3" },
  { label: "DIRECT 04", title: "사내 지정 장소 진열", desc: "사전에 약속된 위치에 조식을 진열하여 별도의 세팅없이 직원들이 바로 이용할 수 있도록 합니다.", src: "direct-4" },
];

const caseFacts = [
  { label: "조직 규모", value: "약 950명 대상" },
  { label: "운영 주기", value: "주 3회 정기운영" },
  { label: "운영 기간", value: "2년 이상 지속운영" },
  { label: "협의 사항", value: "4주 식단 협의" },
];

const reviews = [
  { tag: "실제 메뉴 후기", text: "원래 아침 잠이 많아서 매일 빈속으로 출근하고 점심 전까지 당 떨어져서 힘들었거든요. 회사 조식 시작하고 나서는 아침 걱정 싹 사라졌습니다. 편의점 삼각김밥이랑 비교가 안 되게 신선하고, 샌드위치 속도 꽉 차 있어서 든든해요. 야근한 다음 날 아침에 먹으면 진짜 살 것 같아요." },
  { tag: "실제 운영 후기", text: "솔직히 이직하고 나서 제일 만족스러운 복지가 이 조식이에요... 주변 친구들한테 매일 아침 메뉴 사진 찍어서 자랑합니다ㅋㅋ 월요일엔 베이글, 화요일엔 샌드위치, 수요일엔 밥류 이런 식으로 밸런스를 딱 맞춰주니까 출근길 발걸음이 한결 가벼워집니다. 계속 유지됐으면 좋겠어요!" },
  { tag: "실제 현장 후기", text: "4주 식단을 제안해주고 실제 메뉴도 먼저 확인할 수 있어 도입 결정이 편했고, 견적·정산 서류까지 함께 처리할 수 있어 담당자로서 운영 부담이 많이 줄었습니다." },
  { tag: "실제 현장 후기", text: "어제는 샌드위치라 가볍게 먹기 좋았는데 오늘은 베이글에 유부초밥까지 챙겨주셔서 든든하네요! 내일 식단표 보니까 김밥이랑 샐러드 조합이던데 매일 메뉴가 안 겹치고 다르게 나오니까 몇 달째 먹어도 전혀 안 질려요. 퀄리티 최고입니다." },
  { tag: "실제 현장 후기", text: "아침 메뉴에 과일이나 신선한 채소 샐러드가 자주 포함돼 있어서 마음에 들어요. 혼자 살다 보면 과일 챙겨 먹기 진짜 힘든데, 계절 과일이 컵에 정갈하게 담겨 나오니까 건강 챙기는 기분입니다. 포장도 하나씩 깔끔하게 되어 있어서 자리에서 냄새 걱정 없이 먹기 딱 좋아요." },
];

const menuCategories = [
  "샌드위치 22종", "또띠아랩 4종", "베이글 6종", "김밥 13종", "유부초밥 7종", "과일 3종",
  "샐러드 9종", "컵밥 6종", "사이드 4종", "베이커리 4종", "제과 9종",
];

const plans = [
  { name: "PLAN A", title: "간편 단품형", src: "plan-a", note: "단품 선택 운영 예시", items: "샌드위치 1P / 유부초밥 4P / 컵밥 / 김밥 반줄 중 택1, 요일별 변경", desc: "가볍고 간편한 실속 조식 구성을 원하는 기업에 추천합니다." },
  { name: "PLAN B", title: "메인 + 사이드", src: "plan-b", note: "구성: 메인에 사이드가 추가된 구성", items: "샌드위치 + 컵과일 / 유부 + 사이드 / 베이글 + 샐러드 / 랩 + 유부초밥 등", desc: "영양 밸런스와 포만감을 고려한 샌달조식 베스트 추천 구성입니다.", recommended: true },
  { name: "PLAN C", title: "메인 + 과일 + 사이드", src: "plan-c", note: "구성: 프리미엄 풀패키지 구성", items: "김밥 + 샐러드 + 마들렌 / 샌드 + 과일 + 유부초밥 / 베이글 + 음료 + 스콘 등", desc: "최고의 만족도와 풍성한 구성을 원하는 기업을 위한 프리미엄 플랜입니다." },
];

const compare = [
  { item: "01 운영 경험", general: "업체별 운영 이력 상이", sandal: "10년+ 축적된 기업 조식 운영 경험" },
  { item: "02 주요 메뉴 제조", general: "제조·공급 방식 업체별 상이", sandal: "주요 메뉴 직접 제조·포장 관리" },
  { item: "03 메뉴 선택폭", general: "업체별 메뉴 범위 상이", sandal: "샌드위치·김밥·유부·컵밥·샐러드 등 다양한 메뉴 운영" },
  { item: "04 4주 식단", general: "식단 운영 방식 업체별 상이", sandal: "4주 식단 제안 및 고객사 희망메뉴 협의" },
  { item: "05 배송·사내진열", general: "배송·진열 방식 업체별 상이", sandal: "새벽배송 및 사내 지정장소 진열 협의" },
  { item: "06 기업정산·도입상담", general: "정산·도입절차 업체별 상이", sandal: "견적·기업정산·무료시식 가능 여부·방문미팅 협의" },
];

const faqs = [
  { q: "최소 주문금액과 최소인원은 어떻게 되나요?", a: "1회 100,000원 이상부터 상담 가능합니다. 고정 최소인원은 없습니다.", highlight: true },
  { q: "어디까지 배송되나요?", a: "현재 서울 중심으로 운영하며, 일부 서울 외곽지역은 협의 후 가능합니다." },
  { q: "몇 시에 배송되나요?", a: "일반적으로 새벽 3~6시 사이 운영하며, 정확한 시간은 기업별 약정시간으로 협의합니다." },
  { q: "수량 변경도 가능한가요?", a: "메뉴 및 주문조건에 따라 달라질 수 있으며, 원칙적으로 최소 2일 전 협의를 권장합니다." },
  { q: "4주 식단은 어떻게 정하나요?", a: "샌달조식이 추천 식단안을 제안하거나, 고객사 희망메뉴를 반영해 함께 조정할 수 있습니다." },
  { q: "사내 진열도 가능한가요?", a: "기업별 지정장소와 운영환경을 확인해 진열 방식을 협의합니다." },
  { q: "무료 시식은 누구나 가능한가요?", a: "정기조식 도입을 검토하는 기업의 규모·지역·예산·도입계획을 확인한 뒤 무료 시식 가능 여부를 안내드립니다.", highlight: true },
  { q: "기업 정산은 어떻게 하나요?", a: "견적서, 거래명세서, 전자세금계산서, 법인카드, 월정산 등을 지원합니다." },
  { q: "일요일이나 공휴일도 운영하나요?", a: "일요일 및 법정공휴일은 운영하지 않습니다." },
  { q: "도입 전에 방문미팅도 가능한가요?", a: "필요 시 일정 협의 후 방문미팅을 진행할 수 있습니다." },
];

const conditions = [
  { item: "최소 주문금액", value: "1회 100,000원 이상" },
  { item: "최소 인원", value: "고정 최소인원 없음" },
  { item: "배송지역", value: "서울 중심", sub: "경기·인천 및 수도권 일부 조건 협의" },
  { item: "배송시간", value: "일반적으로 새벽 3~6시", sub: "기업별 약정시간 협의" },
  { item: "예산별 구성", value: "A / B / C 구성 협의" },
  { item: "4주 식단", value: "추천 식단 및 메뉴 협의" },
  { item: "배송·진열 방식", value: "기업별 운영조건에 따라", sub: "사내 지정장소 진열 또는 배송박스 전달·회수 방식 협의" },
  { item: "기업정산", value: "견적서 / 거래명세서 / 전자세금계산서", sub: "법인카드 / 월정산 지원" },
  { item: "무료시식", value: "규모·지역·예산·도입계획 확인 후", sub: "무료 시식 가능 여부 안내" },
  { item: "방문미팅", value: "필요 시 일정 협의 가능" },
];

function Photo({ src, alt, w, h, className = "" }: { src: string; alt: string; w: number; h: number; className?: string }) {
  return <Image src={img(src)} alt={alt} width={w} height={h} className={`w-full h-auto rounded-[var(--radius-lg)] ${className}`} />;
}

export default function BreakfastPage() {
  return (
    <>
      {/* 01 표지 */}
      <section className="bg-surface pt-12 pb-16 md:pt-20 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-12 items-center">
            <div className="break-keep">
              <p className="text-gold-text text-[15px] font-bold tracking-[0.14em] mb-5">대기업 및 공공기관 조식 운영 전문</p>
              <h1 className="text-ink text-[36px] leading-[46px] md:text-[48px] md:leading-[60px] font-extrabold tracking-[-0.02em]">
                기업 조식,<br />
                <span className="text-forest-deep">단순 배달이 아니라 운영</span>입니다
              </h1>
              <p className="mt-6 text-ink-body text-[17px] leading-7 md:text-[19px] md:leading-8">
                10년 노하우로 식단 구성부터{" "}
                <strong className="text-ink font-bold underline decoration-gold decoration-[3px] underline-offset-[6px]">주요 메뉴 직접 제조</strong>,
                새벽배송, 사내진열까지 완벽하게 책임집니다.
              </p>
            </div>
            <Photo src="hero" alt="사내에 진열된 샌달조식 샌드위치와 도시락" w={780} h={439} className="shadow-[var(--shadow-card)]" />
          </div>
          <div className="mt-12">
            <StatGroup items={[
              { value: "10년+", label: "운영 노하우" },
              { value: "950명+", label: "최대 운영 규모" },
              { value: "DIRECT", label: "직영 운영 시스템" },
            ]} />
          </div>
          <Cta caption="기업별 맞춤 식단 및 견적">도입 상담하기</Cta>
        </div>
      </section>

      {/* 03 DIRECT 4단계 */}
      <Section tone="cream">
        <SectionHeading
          title={<>기업의 아침을 남에게 맡기지 않고,<br /><em>주요 과정을 직접 관리</em>합니다.</>}
          description="주요 원재료 확인·구매 관리부터 메뉴 제조·포장, 배송·사내진열까지 기업 조식의 전 과정을 직접 운영합니다."
        />
        <div className="grid sm:grid-cols-2 gap-6">
          {direct.map((d) => (
            <article key={d.label} className={`overflow-hidden rounded-[var(--radius-xl)] border ${d.highlight ? "bg-forest border-forest text-white" : "bg-surface border-line"}`}>
              <Image src={img(d.src)} alt={d.title} width={760} height={760} className="w-full aspect-[4/3] object-cover" />
              <div className="p-7 md:p-8 break-keep">
                <p className={`text-[14px] font-bold tracking-[0.1em] ${d.highlight ? "text-logo-yellow" : "text-gold-text"}`}>{d.label}</p>
                <h3 className={`mt-2 text-[20px] leading-7 font-bold ${d.highlight ? "text-white" : "text-forest-deep"}`}>{d.title}</h3>
                <p className={`mt-2 text-[16px] leading-[26px] ${d.highlight ? "text-white/85" : "text-ink-body"}`}>{d.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 bg-surface border border-line rounded-[var(--radius-md)] py-5 px-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-forest-deep font-bold text-[15px] md:text-[17px]">
          {["식재료 관리", "메뉴 직접 제조", "새벽 배송", "사내 맞춤 진열"].map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {i > 0 && <span className="text-gold-text" aria-hidden>→</span>}
              {s}
            </span>
          ))}
        </div>
        <Closing>메뉴 구성부터 원재료수급 · 제조 · 배송 · 진열까지,<br />모든 과정을 직접 관리합니다.</Closing>
      </Section>

      {/* 04 10년 */}
      <Section>
        <SectionHeading
          eyebrow="10 YEARS OF OPERATION"
          title={<>10년의 차이는<br /><em>반복 운영에서 쌓인 기준</em>입니다.</>}
          description="10년 이상 축적된 단체주문 대량납품 운영 경험"
        />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { tag: "PAST", title: "기업 단체주문·대량 납품 경험", src: "past", desc: "샌달조식은 기업·기관 대상 대량 납품까지 문제없이 소화하며 10년 이상 반복 운영 경험 노하우를 축적한 튼튼한 기업입니다.", tone: "bg-cream" },
            { tag: "PRESENT", title: "기업 정기조식·사내진열 운영", src: "present", desc: "현재는 4주 식단, 새벽배송, 사내 지정장소 진열까지 기업별 조건에 맞춰 운영합니다.", tone: "bg-surface-muted" },
          ].map((c) => (
            <article key={c.tag} className={`${c.tone} rounded-[var(--radius-xl)] p-6 md:p-8 break-keep`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-surface rounded-full px-4 py-1.5 text-[14px] font-extrabold text-forest-deep tracking-wide">{c.tag}</span>
                <h3 className="text-[19px] md:text-[20px] font-bold text-ink">{c.title}</h3>
              </div>
              <Photo src={c.src} alt={c.title} w={696} h={360} />
              <p className="mt-5 text-ink-body text-[16px] leading-[26px]">{c.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 05 고객사·근거 */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="REAL CORPORATE PROOF"
          title={<>다양한 기업과 기관의 아침을<br /><em>실제로 운영</em>해 왔습니다.</>}
          description="한 번의 납품 이력이 아니라, 다양한 기업 현장에서 축적된 실제 운영 경험을 확인하세요."
        />
        <div className="bg-surface rounded-[var(--radius-xl)] border border-line p-6 md:p-10">
          <Image src={img("client-logos")} alt="샌달조식 이용 고객사 로고" width={820} height={1085} className="w-full max-w-2xl mx-auto h-auto" />
        </div>
        <div className="mt-8">
          <StatGroup items={[
            { value: "300만 개+", label: "샌달 브랜드 누적 판매" },
            { value: "98.7%", label: "기존 고객평가" },
          ]} />
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-4">
          <figure className="col-span-2 md:col-span-1">
            <Photo src="proof-menu" alt="실제 기업 조식 메뉴" w={780} h={439} className="md:h-full md:object-cover" />
          </figure>
          <Photo src="proof-display" alt="실제 정기조식 사내진열" w={378} h={672} />
          <Photo src="proof-delivery" alt="조식 납품 예" w={378} h={672} />
        </div>
        <div className="mt-8 bg-forest rounded-[var(--radius-xl)] p-7 md:p-10 text-white break-keep">
          <p className="text-logo-yellow text-[15px] font-bold">대표 정기운영 사례</p>
          <h3 className="mt-2 text-[24px] leading-8 md:text-[28px] md:leading-9 font-extrabold">약 950명 규모 조직 대상<br />2년+ 기업 정기조식 운영 사례</h3>
          <dl className="mt-7 grid grid-cols-2 gap-3 md:gap-4">
            {caseFacts.map((f) => (
              <div key={f.label} className="bg-white/10 rounded-[var(--radius-md)] p-4 md:p-5">
                <dt className="text-white/70 text-[14px]">{f.label}</dt>
                <dd className="mt-1 text-[17px] md:text-[19px] font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Cta caption="우리 회사도 운영 가능한지 확인해보세요.">기업 규모·지역 상담하기</Cta>
      </Section>

      {/* 07 후기 */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="REAL CLIENT EXPERIENCE"
          title={<>실제 기업 담당자들의<br /><em>생생한 이용 후기</em></>}
          description={<>광고 문구보다, 실제 이용기업의 경험을 확인하세요.</>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <article key={i} className="bg-surface rounded-[var(--radius-xl)] border border-line overflow-hidden break-keep">
              <Image src={img(`review-${i + 1}`)} alt={r.tag} width={770} height={580} className="w-full aspect-[4/3] object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-[14px]">
                  <span className="bg-mint text-forest-deep font-bold px-2.5 py-1 rounded-[var(--radius-sm)]">{r.tag}</span>
                  <span className="text-gold" aria-label="별점 5점">★★★★★</span>
                </div>
                <p className="mt-3 text-ink-body text-[16px] leading-[26px]">&ldquo;{r.text}&rdquo;</p>
              </div>
            </article>
          ))}
        </div>
        <Cta caption="실제 이용기업 후기를 확인하셨다면, 우리 회사도 도입 가능 여부를 상담해보세요.">기업 무료 시식 가능 여부 확인하기</Cta>
      </Section>

      {/* 08 신뢰 자료 */}
      <Section>
        <SectionHeading
          eyebrow="OFFICIAL TRUST PROOF"
          title={<>운영 경험뿐 아니라,<br /><em>확인 가능한 자료</em>로 신뢰를 더합니다.</>}
          description="공급업체 검토 시 필수적인 실제 가입·등록 자료입니다."
        />
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {[
            { src: "cert-insurance", title: "생산물배상책임보험", desc: "기업 조식 운영 시 확인 가능한 보험가입 자료" },
            { src: "cert-trademark", title: "지식재산권 등록", desc: "보유 지식재산권의 실제 등록자료" },
          ].map((c) => (
            <article key={c.src} className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] p-5 md:p-8 text-center break-keep">
              <Image src={img(c.src)} alt={c.title} width={304} height={436} className="w-full max-w-[260px] mx-auto h-auto border border-line" />
              <h3 className="mt-5 text-[18px] md:text-[20px] font-bold text-forest-deep">{c.title}</h3>
              <p className="mt-1 text-ink-body text-[15px] md:text-[16px]">{c.desc}</p>
            </article>
          ))}
        </div>
        <Closing>매일 반복되는 조식이기에,<br />운영 경험과 신뢰 기반을 함께 봅니다.</Closing>
      </Section>

      {/* 09 운영파트너 */}
      <Section tone="muted">
        <SectionHeading
          align="left"
          eyebrow="OPERATING PARTNER"
          title={<>단순한 조식 납품업체가 아닌,<br /><em>&lsquo;운영파트너&rsquo;</em>가 되어드립니다.</>}
        />
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="break-keep">
            <div className="text-ink-body text-[17px] leading-8 space-y-5">
              <p>기업 조식을 오래 운영하면서 알게 된 것은 좋은 메뉴 하나만으로는 매일의 아침이 만족될 수 없다는 것이었습니다.</p>
              <p>메뉴가 달라야 하고, 시간도 맞아야 하고, 담당자가 바뀌어도 같은 기준으로 이어져야 했습니다.</p>
              <p>좋은 기업 조식은 한 번 맛있는 것이 아니라, 매일 안정적으로 이어지는 것입니다.</p>
              <p className="text-forest-deep font-bold">샌달조식은 그 반복되는 아침을 책임집니다.</p>
            </div>
          </div>
          <Photo src="partner" alt="샌달조식 케이터링 진열" w={860} h={479} className="shadow-[var(--shadow-card)]" />
        </div>
      </Section>

      {/* 10 메뉴 */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="MENU VARIETY"
          title={<><em>샌드위치만 있는</em><br />조식이 아닙니다.</>}
          description="메뉴가 많다는 것보다 중요한 건, 한 달 동안 지루하지 않게 운영할 수 있다는 것입니다."
        />
        <Photo src="menu-mosaic" alt="샌달조식 메뉴 모음" w={860} h={599} className="shadow-[var(--shadow-card)]" />
        <ol className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {menuCategories.map((m, i) => (
            <li key={m} className="bg-surface border border-line rounded-[var(--radius-md)] px-4 py-4 flex items-baseline gap-3">
              <span className="text-gold-text font-extrabold text-[15px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-forest-deep font-bold text-[16px]">{m}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 bg-forest rounded-[var(--radius-xl)] p-8 md:p-10 text-center text-white break-keep">
          <span className="inline-block bg-surface text-forest-deep text-[14px] font-bold rounded-full px-4 py-1.5">건강한 선택</span>
          <h3 className="mt-4 text-[24px] md:text-[28px] font-extrabold">건강하게 즐기는 조식</h3>
          <p className="mt-3 text-white/85 text-[16px] md:text-[17px] leading-7">식단 취향에 맞춰 고를 수 있는<br />비건·저당 라인도 함께 준비했습니다.</p>
        </div>
        <Closing>메뉴가 많기 위한 다양성이 아니라,<br />한 달 동안 반복해도 지루하지 않기 위한 선택폭입니다.</Closing>
        <div className="mt-8 flex justify-center">
          <Button href="/menu" variant="secondary" size="md">전체 메뉴 보기</Button>
        </div>
      </Section>

      {/* 12 4주 식단 */}
      <Section>
        <SectionHeading
          eyebrow="4-WEEK MENU PLAN"
          title={<>다양하게 만든 메뉴를,<br /><em>한 달 동안 지루하지 않게.</em></>}
          description="기업별 운영요일·예산·선호도를 고려해 4주 식단안을 제안하고 협의합니다."
        />
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center">
          <figure className="bg-surface border border-line rounded-[var(--radius-xl)] p-4 md:p-6 shadow-[var(--shadow-card)]">
            <figcaption className="text-ink font-extrabold text-[18px] mb-3">실제 식단표</figcaption>
            <Image src={img("diet-table")} alt="샌달조식 실제 4주 식단표 예시" width={740} height={991} className="w-full h-auto" />
          </figure>
          <div className="break-keep">
            <div className="flex flex-wrap gap-3">
              {["추천 식단안 제안", "고객사 희망메뉴 협의", "선호·기피 메뉴 조정", "예산별 구성 협의", "운영요일별 조정"].map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
            <p className="mt-8 text-forest-deep text-[20px] md:text-[24px] leading-9 font-bold">
              매주 메뉴를 처음부터 다시 고민하는<br />담당자의 부담을 덜어드립니다.
            </p>
          </div>
        </div>
      </Section>

      {/* 13 예산별 운영안 */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="BUDGET FIT"
          title={<>예산을 메뉴에 맞추는 것이 아니라,<br /><em>기업의 예산에 맞춰</em> 조식을 협의합니다.</>}
          description="우리 회사 예산이면 어떤 아침이 가능할까요?"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article key={p.name} className={`relative bg-surface rounded-[var(--radius-xl)] overflow-hidden border ${p.recommended ? "border-gold border-2" : "border-line"} break-keep flex flex-col`}>
              <div className="relative">
                <Image src={img(p.src)} alt={`${p.name} ${p.title} 구성 예시`} width={770} height={586} className="w-full aspect-[4/3] object-cover" />
                <span className="absolute top-4 left-4 bg-forest-deep text-white text-[14px] font-extrabold px-3 py-1.5 rounded-[var(--radius-sm)]">{p.name}</span>
                {p.recommended && (
                  <span className="absolute top-4 right-4 bg-gold text-white text-[13px] font-bold tracking-wide px-3 py-1.5 rounded-full">RECOMMENDED</span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[22px] font-extrabold text-ink">{p.title}</h3>
                <p className="text-gold-text text-[15px] font-bold mt-1">기업 조건별 맞춤견적</p>
                <div className="mt-4 bg-surface-subtle border border-line rounded-[var(--radius-md)] p-4">
                  <p className="text-ink-muted text-[14px]">{p.note}</p>
                  <p className="mt-1 text-ink font-bold text-[15px] leading-6">{p.items}</p>
                </div>
                <p className="mt-4 text-ink-body text-[15px] leading-6">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-ink-muted text-[14px] break-keep">※ 실제 구성과 단가는 인원·지역·운영요일·주당 횟수 등에 따라 협의됩니다.</p>
        <Cta caption="우리 회사 예산에 맞는 구성을 확인해보세요.">예산별 맞춤 견적 상담하기</Cta>
      </Section>

      {/* 16 비교표 */}
      <Section>
        <SectionHeading
          eyebrow="WHY SANDAL BREAKFAST"
          title={<>기업 조식,<br /><em>가격만 비교</em>하고 계신가요?</>}
          description="가격이 비슷해도 누가 만들고, 어떻게 운영하는지는 다를 수 있습니다."
        />
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-5 mb-2">
            <div className="bg-surface-muted text-ink-muted rounded-[var(--radius-md)] py-4 text-center font-bold text-[15px] md:text-[18px]">일반 기업조식 서비스</div>
            <div className="bg-forest text-white rounded-[var(--radius-md)] py-4 text-center font-bold text-[15px] md:text-[18px]">샌달조식</div>
          </div>
          {compare.map((c) => (
            <div key={c.item} className="mt-5">
              <p className="text-center text-gold-text font-bold text-[15px] md:text-[17px] mb-2">{c.item}</p>
              <div className="grid grid-cols-2 gap-3 md:gap-5 break-keep">
                <div className="bg-surface-muted border border-line text-ink-muted rounded-[var(--radius-md)] p-4 md:p-5 text-center text-[15px] md:text-[16px] flex items-center justify-center">{c.general}</div>
                <div className="bg-surface-subtle border border-line-strong text-forest-deep rounded-[var(--radius-md)] p-4 md:p-5 text-center font-bold text-[15px] md:text-[16px] flex items-center justify-center">{c.sandal}</div>
              </div>
            </div>
          ))}
        </div>
        <Closing>단순 배송이 아니라,<br />한 달의 기업 아침을 운영하는 방식의 차이.</Closing>
      </Section>

      {/* 15 FAQ */}
      <Section tone="muted" id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title={<>기업 담당자가<br /><em>가장 많이 묻는 질문.</em></>}
          description="도입 전 궁금한 운영조건을 빠르게 확인하세요."
        />
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((f) => (
            <article key={f.q} className={`${f.highlight ? "bg-cream" : "bg-surface"} border border-line rounded-[var(--radius-xl)] p-6 md:p-8 break-keep`}>
              <h3 className="text-forest-deep text-[18px] md:text-[20px] leading-7 font-bold">Q. {f.q}</h3>
              <p className="mt-3 text-ink-body text-[16px] leading-[26px]">{f.a}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 18 운영조건 */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow="BEFORE YOU START"
          title={<>우리 회사 도입 전,<br /><em>이것만 확인하세요.</em></>}
          description="기업 조식 정기구독에 필요한 핵심 운영조건을 한눈에 정리했습니다."
        />
        <div className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] px-6 md:px-12 py-4">
          <dl className="divide-y divide-line">
            {conditions.map((c, i) => (
              <div key={c.item} className="py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-6 break-keep">
                <dt className="text-ink-body text-[16px] md:text-[18px] shrink-0">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {c.item}
                </dt>
                <dd className="md:text-right">
                  <div className="text-forest-deep font-bold text-[16px] md:text-[18px]">{c.value}</div>
                  {c.sub && <div className="text-ink-muted text-[14px] mt-0.5">{c.sub}</div>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="mt-5 text-ink-muted text-[14px] space-y-1">
          <li>• 수량 변경: 원칙적으로 최소 2일 전 협의 권장</li>
          <li>• 휴무 안내: 일요일 및 법정공휴일 미운영</li>
        </ul>
      </Section>

      {/* 19 최종 상담 */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="READY TO START?"
          title={<>우리 회사 조식,<br /><em>실제 메뉴와 운영안</em>을<br />확인한 뒤 결정하세요.</>}
          description="인원·지역·예산·운영조건을 알려주시면 우리 회사에 맞는 운영 가능 여부부터 안내드립니다."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {["10년+ 기업 조식 운영 경험", "4주 식단 협의", "새벽배송·사내진열 협의"].map((c) => (
            <Chip key={c} variant="outline">{c}</Chip>
          ))}
        </div>
        <div className="mt-10 max-w-2xl mx-auto bg-surface border border-line rounded-[var(--radius-xl)] p-8 md:p-12 text-center">
          <p className="text-ink-muted text-[17px]">상담 전화번호</p>
          <a href={CONTACT.tel} className="block mt-2 text-forest-deep text-[48px] leading-[56px] md:text-[64px] md:leading-[72px] font-extrabold tracking-[-0.02em]">{CONTACT.phone}</a>
          <div className="mt-6 pt-6 border-t border-line text-ink-body text-[16px]">
            <p>이메일 문의: {CONTACT.email}</p>
            <p className="mt-1 font-bold text-ink">{CONTACT.operator}</p>
          </div>
        </div>
        <Closing>매일 반복되는 아침 준비는 줄이고,<br />직원에게는 기다려지는 조식을</Closing>
        <Cta caption="무료 시식·맞춤 견적·방문미팅 상담 가능" href={CONTACT.tel}>전화 상담 문의 · {CONTACT.phone}</Cta>
      </Section>
    </>
  );
}

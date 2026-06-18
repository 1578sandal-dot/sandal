import Link from "next/link";

const services = [
  { num: "01", title: "기업 정기조식\n구독 서비스", desc: "고객사의 아침 운영을 대신 책임지는 일. 매일의 식단 고민을 우리가 대신합니다." },
  { num: "02", title: "단체 도시락·\n샌드위치 박스", desc: "미팅·세미나·점심 회의의 점심을 책임집니다. 정확한 수량과 시간을 한 치도 어기지 않습니다." },
  { num: "03", title: "김밥·유부초밥\n한식 라인", desc: "김밥 11종·유부초밥 6종·컵밥 6종. 매일 다른 메뉴를 같은 품질로 만듭니다." },
  { num: "04", title: "행사 간식\n패키지", desc: "학회·세미나·임직원 행사의 담당자 부담을 줄여드립니다." },
  { num: "05", title: "대규모\n케이터링", desc: "100인 이상 대형 행사. 정확한 준비와 현장 대응이 핵심입니다.", highlight: true },
];

const stats = [
  { value: "99%", label: "정시 배송률" },
  { value: "100%", label: "직접 생산" },
  { value: "10년", label: "현장 경험" },
  { value: "70+", label: "메뉴 풀" },
];

const promises = [
  { num: "01", title: "주문 하나를 가볍게 보지 않는다", desc: "단 한 건의 오주문도 누군가의 끼니에는 큰 사고. 모든 주문은 더블 체크합니다." },
  { num: "02", title: "오늘 나가는 음식은 오늘의 기준으로", desc: "전날 만든 음식은 출고하지 않습니다. 매일 새벽 우리 손으로 직접 만듭니다." },
  { num: "03", title: "고객의 출근 시간보다 먼저 준비된다", desc: "정시 배송률 99% — 고객이 도착하기 전에 모든 것이 끝나 있어야 합니다." },
  { num: "04", title: "문제는 숨기지 않고 빠르게 공유한다", desc: "실수는 누구나 합니다. 숨기면 사고가 되고, 공유하면 학습이 됩니다." },
  { num: "05", title: "같은 실수를 반복하지 않는다", desc: "매주 운영 회고로 어제의 실수가 내일 반복되지 않게 합니다." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-ink pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/20 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-6 font-[family-name:var(--font-maruburi)] italic">
              Good food makes a good day.
            </p>
            <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl lg:text-7xl text-cream font-semibold leading-tight mb-6 break-keep">
              좋은 음식이<br />
              <span className="text-gold italic">좋은 하루를</span><br />
              만든다.
            </h1>
            <p className="text-cream/60 text-lg leading-relaxed mb-10 break-keep">
              더기빙트리는 기업의 식사 운영을 책임지는 B2B 푸드 서비스입니다.<br />
              정확한 주문, 정확한 생산, 정확한 배송 — 10년의 약속.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gold text-bark font-medium rounded-full hover:bg-cream transition-colors text-center"
              >
                견적 문의하기
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 border border-cream/30 text-cream rounded-full hover:border-cream/60 transition-colors text-center"
              >
                서비스 보기
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-cream/5 border border-cream/10 rounded-2xl p-8 text-center">
                <div className="font-[family-name:var(--font-maruburi)] text-4xl text-gold font-semibold mb-2">
                  {value}
                </div>
                <div className="text-cream/50 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">Why The Giving Tree</p>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-ink font-semibold leading-tight break-keep mb-6">
              단순히 조식배달을 넘어,<br />
              <span className="text-forest italic">고객의 운영부담을 줄여드립니다.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", q: '"오늘은 또 뭘 시키지?"', sub: "매일의 식단 고민", ans: "그 고민을 우리가 대신합니다." },
              { num: "02", q: '"수량이 모자라면 어떡하지?"', sub: "행사 담당자의 부담", ans: "시간과 수량 — 절대 어기지 않습니다." },
              { num: "03", q: '"주문, 정산, 식수 관리…"', sub: "행정·정산의 무게", ans: "행정 부담까지 함께 줄입니다." },
            ].map(({ num, q, sub, ans }) => (
              <div key={num} className="bg-paper border border-pale-sage rounded-2xl p-8">
                <div className="text-gold text-xs tracking-widest mb-3 font-mono">{num}</div>
                <div className="text-xs text-bark/50 mb-2">{sub}</div>
                <h3 className="font-[family-name:var(--font-maruburi)] text-xl text-ink font-semibold mb-4 break-keep">{q}</h3>
                <div className="h-px bg-pale-sage mb-4" />
                <p className="text-xs text-forest font-medium tracking-wide">{ans}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-pale-sage py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">Services</p>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-ink font-semibold leading-tight break-keep">
              다섯 가지 서비스,<br />하나의 약속.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ num, title, desc, highlight }) => (
              <div
                key={num}
                className={`rounded-2xl p-8 ${highlight ? "bg-forest text-cream" : "bg-paper border border-pale-sage"}`}
              >
                <div className="text-gold text-xs tracking-widest font-mono mb-4">{num}</div>
                <h3 className={`font-[family-name:var(--font-maruburi)] text-2xl font-semibold mb-3 whitespace-pre-line leading-snug ${highlight ? "text-cream" : "text-ink"}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed break-keep ${highlight ? "text-cream/70" : "text-bark/60"}`}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 text-forest text-sm font-medium hover:text-ink transition-colors">
              전체 서비스 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">Our Promise</p>
            <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-ink font-semibold leading-tight break-keep">
              우리가 매일 지키는<br />
              <span className="text-forest italic">5가지 약속.</span>
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-pale-sage">
            {promises.map(({ num, title, desc }) => (
              <div key={num} className="py-8 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
                <div className="text-gold text-xs tracking-widest font-mono flex-shrink-0 pt-1">{num}</div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-maruburi)] text-xl text-ink font-semibold mb-2 break-keep">{title}</h3>
                  <p className="text-sm text-bark/60 leading-relaxed break-keep">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-forest py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-[family-name:var(--font-maruburi)] italic text-gold text-lg mb-4">
            Honest food, a table cared for.
          </p>
          <h2 className="font-[family-name:var(--font-maruburi)] text-4xl md:text-5xl text-cream font-semibold mb-6 break-keep leading-tight">
            귀사의 식사 운영,<br />더기빙트리가 책임집니다.
          </h2>
          <p className="text-cream/60 mb-10 break-keep leading-relaxed">
            예산·인원·행사 성격에 맞춰 최적 패키지를 제안합니다.<br />
            견적·식단·운영안이 하루 안에 정리됩니다.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gold text-bark font-medium rounded-full hover:bg-cream transition-colors text-lg"
          >
            무료 견적 문의
          </Link>
        </div>
      </section>
    </>
  );
}

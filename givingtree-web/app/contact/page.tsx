import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기 | 더기빙트리",
  description: "기업 식사 서비스 견적 및 상담 문의. 예산·인원·행사 성격에 맞춰 최적 패키지를 제안해 드립니다.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-ink">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-mono">Contact</p>
          <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl text-cream font-semibold leading-tight break-keep mb-6">
            견적·식단·운영안,<br />
            <span className="text-gold italic">하루 안에 정리됩니다.</span>
          </h1>
          <p className="text-cream/60 text-lg max-w-xl break-keep">
            예산·인원·행사 성격에 맞춰 최적 패키지를 제안합니다.<br />
            부담 없이 문의해 주세요.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-cream py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-forest rounded-2xl p-8 text-cream">
              <div className="text-gold text-xs tracking-widest font-mono mb-6">CONTACT INFO</div>
              <ul className="flex flex-col gap-5">
                <li>
                  <div className="text-xs text-cream/40 mb-1">전화</div>
                  <div className="font-[family-name:var(--font-maruburi)] text-xl">+82 10 2202 1309</div>
                </li>
                <li>
                  <div className="text-xs text-cream/40 mb-1">이메일</div>
                  <div className="text-sm">admin@thegivingtree.co.kr</div>
                </li>
                <li>
                  <div className="text-xs text-cream/40 mb-1">주소</div>
                  <div className="text-sm leading-relaxed">경기도 파주시 하우고개길 106-3</div>
                </li>
                <li>
                  <div className="text-xs text-cream/40 mb-1">운영시간</div>
                  <div className="text-sm">평일 09:00 — 18:00</div>
                </li>
              </ul>
            </div>

            <div className="bg-paper border border-pale-sage rounded-2xl p-8">
              <div className="text-gold text-xs tracking-widest font-mono mb-4">PROCESS</div>
              <div className="flex flex-col gap-4">
                {[
                  { step: "01", label: "문의 접수", desc: "양식 작성 후 제출" },
                  { step: "02", label: "상담 연락", desc: "영업일 기준 24시간 내" },
                  { step: "03", label: "견적 제안", desc: "맞춤 패키지 + 식단 제안" },
                  { step: "04", label: "서비스 시작", desc: "계약 후 최단 일정으로" },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="text-gold text-xs font-mono flex-shrink-0 pt-1">{step}</div>
                    <div>
                      <div className="text-sm font-medium text-ink">{label}</div>
                      <div className="text-xs text-bark/50">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

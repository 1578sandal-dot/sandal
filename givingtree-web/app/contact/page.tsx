import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { CONTACT, PageHero, Section } from "@/components/sandal";

export const metadata: Metadata = {
  title: "문의하기 | 샌달조식",
  description: "기업 조식 견적 및 상담 문의. 인원·지역·예산·운영조건을 알려주시면 운영 가능 여부부터 안내드립니다. 상담 전화 1522-4633.",
};

const steps = [
  { step: "01", label: "문의 접수", desc: "양식 작성 후 제출" },
  { step: "02", label: "상담 연락", desc: "영업일 기준 24시간 내" },
  { step: "03", label: "견적 제안", desc: "맞춤 구성 + 4주 식단 제안" },
  { step: "04", label: "서비스 시작", desc: "계약 후 협의한 일정으로" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title={<>견적·식단·운영안,<br /><em>하루 안에 정리됩니다.</em></>}
        description="인원·지역·예산·운영조건을 알려주시면 우리 회사에 맞는 운영 가능 여부부터 안내드립니다."
      />

      <Section>
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 min-w-0">
            <ContactForm />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6 break-keep">
            <div className="bg-forest rounded-[var(--radius-xl)] p-7 md:p-8 text-white">
              <p className="text-white/70 text-[15px]">상담 전화번호</p>
              <a href={CONTACT.tel} className="block mt-1 text-[36px] leading-[44px] font-extrabold tracking-[-0.02em]">{CONTACT.phone}</a>
              <ul className="mt-6 pt-6 border-t border-white/20 flex flex-col gap-4 text-[15px]">
                <li>
                  <p className="text-white/60 text-[13px]">이메일</p>
                  <p>{CONTACT.email}</p>
                </li>
                <li>
                  <p className="text-white/60 text-[13px]">주소</p>
                  <p>경기도 파주시 하우고개길 106-3</p>
                </li>
                <li>
                  <p className="text-white/60 text-[13px]">운영시간</p>
                  <p>평일 09:00 — 18:00</p>
                </li>
              </ul>
              <p className="mt-6 text-white font-bold text-[15px]">{CONTACT.operator}</p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] p-7 md:p-8">
              <p className="text-gold-text text-[14px] font-bold tracking-[0.14em]">PROCESS</p>
              <ol className="mt-4 flex flex-col gap-4">
                {steps.map(({ step, label, desc }) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="text-gold-text text-[15px] font-extrabold tabular-nums">{step}</span>
                    <div>
                      <p className="text-forest-deep text-[16px] font-bold">{label}</p>
                      <p className="text-ink-body text-[14px]">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

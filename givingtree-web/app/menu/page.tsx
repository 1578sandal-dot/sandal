import type { Metadata } from "next";
import MenuClient from "@/components/MenuClient";
import { Button, PageHero } from "@/components/sandal";

export const metadata: Metadata = {
  title: "메뉴 | 샌달조식",
  description: "샌달조식의 샌드위치, 베이글, 김밥, 유부초밥, 컵밥, 샐러드, 사이드 메뉴를 소개합니다. 다양한 메뉴를 4주 식단으로 운영합니다.",
};

const facts = [
  { value: "11개", label: "메뉴 카테고리" },
  { value: "4주", label: "식단 운영" },
  { value: "새벽", label: "주요 메뉴 직접 제조" },
];

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="MENU"
        title={<>매일 다른 메뉴를,<br /><em>매일 같은 품질로.</em></>}
        description="다양한 메뉴를 4주 식단으로 운영합니다. 주요 메뉴는 매일 새벽 직접 만들어 당일 전달합니다. 메뉴 이름에 마우스를 올리거나 누르면 사진을 볼 수 있습니다."
      />

      <section className="bg-forest">
        <dl className="max-w-5xl mx-auto px-4 md:px-10 py-8 grid grid-cols-3 text-center">
          {facts.map(({ value, label }) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="text-logo-yellow text-[26px] md:text-[34px] font-extrabold tracking-[-0.02em]">{value}</dd>
              <dd className="mt-1 text-white/85 text-[14px] md:text-[16px]">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <MenuClient />
      </section>

      <section className="bg-surface-muted">
        <div className="max-w-3xl mx-auto px-4 md:px-10 py-14 text-center break-keep">
          <p className="text-gold-text text-[15px] font-bold tracking-[0.14em]">NOTICE</p>
          <p className="mt-4 text-ink-body text-[16px] leading-7">
            메뉴는 계절·식재료 수급 상황에 따라 일부 변경될 수 있습니다.<br />
            정확한 메뉴 구성과 알레르기 정보는 문의를 통해 확인해 주세요.
          </p>
          <div className="mt-6">
            <Button href="/contact" variant="secondary" size="md">메뉴 상담 문의</Button>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import MenuClient from "@/components/MenuClient";

export const metadata: Metadata = {
  title: "메뉴 | 더기빙트리",
  description: "더기빙트리의 샌드위치, 베이글, 김밥, 유부초밥, 컵밥, 음료, 디저트 메뉴를 소개합니다.",
};

export default function MenuPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-ink">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-6 font-mono">Menu</p>
          <h1 className="font-[family-name:var(--font-maruburi)] text-5xl md:text-6xl text-cream font-semibold leading-tight break-keep mb-6">
            매일 다른 메뉴를,<br />
            <span className="text-gold italic">매일 같은 품질로.</span>
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl break-keep">
            70가지가 넘는 메뉴를 4주 주기로 자동 로테이션합니다.<br />
            모든 메뉴는 매일 새벽 직접 만들어 당일 배송됩니다.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gold py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 text-bark text-center">
            {[
              { value: "70+", label: "전체 메뉴 수", latin: true },
              { value: "4주", label: "자동 로테이션", latin: false },
              { value: "매일 새벽", label: "직접 생산", latin: false },
              { value: "0회", label: "식단 직접 기획", latin: false },
            ].map(({ value, label, latin }) => (
              <div key={label}>
                <div className={`text-2xl font-semibold ${latin ? "font-[family-name:var(--font-maruburi)]" : "font-[family-name:var(--font-pretendard)]"}`}>{value}</div>
                <div className="text-xs mt-1 text-bark/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu categories */}
      <section className="bg-cream py-24">
        <MenuClient />
      </section>

      {/* Note */}
      <section className="bg-pale-sage py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-gold text-xs tracking-widest font-mono mb-4">NOTICE</div>
          <p className="text-bark/70 text-sm leading-relaxed break-keep">
            메뉴는 계절·식재료 수급 상황에 따라 일부 변경될 수 있습니다.<br />
            정확한 메뉴 구성과 알레르기 정보는 문의를 통해 확인해 주세요.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 px-6 py-3 bg-forest text-cream text-sm rounded-full hover:bg-ink transition-colors"
          >
            메뉴 상담 문의
          </Link>
        </div>
      </section>
    </>
  );
}

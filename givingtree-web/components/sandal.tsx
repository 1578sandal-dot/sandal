// 샌달조식 BI 컴포넌트 (BRAND.md 8장)
import Link from "next/link";
import type { ReactNode } from "react";

export const CONTACT = {
  phone: "1522-4633",
  tel: "tel:15224633",
  email: "admin@thegivingtree.co.kr",
  operator: "㈜더기빙트리 운영 샌달조식",
};

const tones = {
  surface: "bg-surface",
  cream: "bg-cream",
  muted: "bg-surface-muted",
} as const;

export function Section({
  tone = "surface",
  id,
  children,
}: {
  tone?: keyof typeof tones;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${tones[tone]} py-16 md:py-20`}>
      <div className="max-w-5xl mx-auto px-4 md:px-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={`mb-10 md:mb-12 break-keep ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-gold-text text-[15px] leading-5 font-bold tracking-[0.14em] uppercase mb-4">{eyebrow}</p>
      )}
      <h2 className="text-ink text-[30px] leading-[40px] md:text-[44px] md:leading-[56px] font-extrabold tracking-[-0.02em] [&_em]:not-italic [&_em]:text-forest-deep">
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-ink-body text-[17px] leading-7 md:text-[19px] md:leading-8 ${center ? "max-w-2xl mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Closing({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 text-center text-forest-deep text-[19px] leading-8 md:text-[22px] md:leading-9 font-bold break-keep">
      {children}
    </p>
  );
}

export function Button({
  href,
  variant = "primary",
  size = "lg",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
  children: ReactNode;
}) {
  const v =
    variant === "primary"
      ? "bg-forest text-white hover:bg-forest-deep"
      : "bg-surface text-forest-deep border-2 border-forest hover:bg-mint";
  const s =
    size === "lg"
      ? "h-[72px] text-[20px] md:text-[22px] rounded-[var(--radius-lg)] w-full max-w-[680px]"
      : "h-[52px] text-[17px] rounded-[var(--radius-md)] px-6";
  return (
    <Link href={href} className={`inline-flex items-center justify-center font-bold transition-colors ${v} ${s}`}>
      {children}
    </Link>
  );
}

export function Cta({ caption, href = "/contact", children }: { caption: string; href?: string; children: ReactNode }) {
  return (
    <div className="mt-14 flex flex-col items-center text-center gap-4 break-keep">
      <p className="text-ink-body text-[17px] md:text-[19px]">{caption}</p>
      <Button href={href}>{children}</Button>
    </div>
  );
}

export function Chip({ variant = "solid", children }: { variant?: "solid" | "outline"; children: ReactNode }) {
  const v =
    variant === "solid"
      ? "bg-forest-deep text-white"
      : "bg-surface text-forest-deep border border-line";
  return <span className={`inline-flex items-center rounded-full px-5 py-2.5 text-[15px] md:text-[17px] font-bold ${v}`}>{children}</span>;
}

export function StatGroup({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="bg-surface-subtle border border-line rounded-[var(--radius-xl)] py-7 grid divide-x divide-line" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(({ value, label }) => (
        <div key={label} className="text-center px-2">
          <div className="text-gold text-[28px] leading-9 md:text-[44px] md:leading-[56px] font-extrabold tracking-[-0.02em]">{value}</div>
          <div className="mt-1 text-ink-muted text-[14px] md:text-[17px]">{label}</div>
        </div>
      ))}
    </div>
  );
}

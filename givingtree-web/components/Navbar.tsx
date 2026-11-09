"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CONTACT } from "@/components/sandal";

const navLinks = [
  { href: "/about", label: "회사소개" },
  { href: "/services", label: "서비스" },
  { href: "/menu", label: "메뉴" },
  { href: "/#faq", label: "자주 묻는 질문" },
  { href: "/contact", label: "문의하기" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-line">
      <div className="max-w-5xl mx-auto px-4 md:px-10 h-28 flex items-center justify-between">
        {/* 로고: BI 최소 가로 96px */}
        <Link href="/" className="shrink-0" aria-label="샌달조식 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sandal-logo-green.svg" alt="샌달조식" width={96} height={83} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[16px] transition-colors ${
                pathname === href ? "text-forest-deep font-bold" : "text-ink-body hover:text-forest-deep"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={CONTACT.tel}
            className="h-11 px-5 inline-flex items-center rounded-[var(--radius-md)] border-2 border-forest text-forest-deep font-bold text-[15px] hover:bg-mint transition-colors"
          >
            상담 {CONTACT.phone}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`w-6 h-0.5 bg-ink transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-line px-4 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[16px] py-1 ${pathname === href ? "text-forest-deep font-bold" : "text-ink-body"}`}
            >
              {label}
            </Link>
          ))}
          <a href={CONTACT.tel} className="text-forest-deep font-bold text-[16px] py-1">상담 전화 {CONTACT.phone}</a>
        </div>
      )}
    </header>
  );
}

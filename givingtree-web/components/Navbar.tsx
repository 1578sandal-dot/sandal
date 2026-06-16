"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/about", label: "회사소개" },
  { href: "/services", label: "서비스" },
  { href: "/menu", label: "메뉴" },
  { href: "/contact", label: "문의하기" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-pale-sage">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/더기빙트리로고.svg" alt="더기빙트리 로고" width={36} height={33} className="flex-shrink-0" />
          <div>
            <div className="font-[family-name:var(--font-maruburi)] text-xl font-semibold text-forest leading-none">The Giving Tree</div>
            <div className="text-[10px] tracking-widest text-olive mt-0.5">더기빙트리</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === href
                  ? "text-forest font-medium"
                  : "text-bark/70 hover:text-forest"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`w-5 h-0.5 bg-bark transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-bark transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-bark transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-pale-sage px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-1 ${pathname === href ? "text-forest font-medium" : "text-bark/70"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";

const BLOG_URL = "https://blog.naver.com/sandal_josik";
const HIDE_KEY = "sandal-blog-popup-hide-until";

// 첫 화면 블로그 안내 팝업. '오늘 하루 보지 않기'는 이 브라우저에서 자정까지 숨김
export default function BlogPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let hidden = false;
    try {
      hidden = Number(localStorage.getItem(HIDE_KEY) ?? 0) > Date.now();
    } catch {}
    if (hidden) return;
    // 첫 화면이 그려진 뒤 살짝 늦게 띄움
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hideToday = () => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    try {
      localStorage.setItem(HIDE_KEY, String(midnight.getTime()));
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-popup-title"
        className="w-full max-w-[400px] bg-surface rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 pt-8 pb-7 text-center break-keep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sandal-logo-green.svg" alt="" width={96} height={83} className="mx-auto" />
          <p className="mt-5 text-gold-text text-[14px] font-bold tracking-[0.14em]">OFFICIAL BLOG</p>
          <h2 id="blog-popup-title" className="mt-2 text-ink text-[22px] leading-8 font-extrabold">
            <span className="text-forest-deep">샌달조식 공식 블로그</span>에서<br />
            샌달조식의 다양한 소식을 접해보세요!
          </h2>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 h-[52px] w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-forest text-white font-bold text-[17px] hover:bg-forest-deep transition-colors"
          >
            블로그 보러가기
          </a>
        </div>
        <div className="flex border-t border-line text-[15px]">
          <button onClick={hideToday} className="flex-1 py-3.5 text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors">
            오늘 하루 보지 않기
          </button>
          <button onClick={() => setOpen(false)} className="flex-1 py-3.5 border-l border-line text-ink-body font-bold hover:bg-surface-subtle transition-colors">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="font-[family-name:var(--font-maruburi)] text-2xl text-cream font-semibold mb-1">
              The Giving Tree
            </div>
            <div className="text-xs tracking-widest text-cream/40 mb-4">더기빙트리</div>
            <p className="text-sm leading-relaxed text-cream/60 break-keep">
              정직한 재료로,<br />
              누군가의 식탁을 정성껏 책임집니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-semibold tracking-widest text-gold mb-4 uppercase">Menu</div>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "/about", label: "회사소개" },
                { href: "/services", label: "서비스" },
                { href: "/menu", label: "메뉴" },
                { href: "/contact", label: "문의하기" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs font-semibold tracking-widest text-gold mb-4 uppercase">Contact</div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <span className="text-cream/40 text-xs">전화</span>
                <div>+82 10 2202 1309</div>
              </li>
              <li>
                <span className="text-cream/40 text-xs">이메일</span>
                <div>admin@thegivingtree.co.kr</div>
              </li>
              <li>
                <span className="text-cream/40 text-xs">주소</span>
                <div>경기도 파주시 하우고개길 106-3</div>
              </li>
              <li className="pt-1">
                <span className="text-cream/40 text-xs">사업자등록번호</span>
                <div>204-87-03371</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col gap-2 text-xs text-cream/30">
          <p className="break-keep">
            (주)더기빙트리 (대표: 이창훈) &nbsp;|&nbsp; 경기도 파주시 하우고개길 106-3 &nbsp;|&nbsp; 사업자등록번호 : 204-87-03371
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span>Copyright © 2026 The Giving Tree, Co., Ltd. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

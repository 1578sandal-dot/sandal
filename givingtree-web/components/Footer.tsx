import Link from "next/link";
import { CONTACT } from "@/components/sandal";

const links = [
  { href: "/about", label: "회사소개" },
  { href: "/services", label: "서비스" },
  { href: "/menu", label: "메뉴" },
  { href: "/contact", label: "문의하기" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/75">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="text-white text-[22px] font-extrabold">샌달조식</div>
            <p className="mt-3 text-[15px] leading-6 break-keep">
              기업 조식, 단순 배달이 아니라 운영입니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-[14px] font-bold tracking-[0.14em] text-white mb-4">MENU</div>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[14px] font-bold tracking-[0.14em] text-white mb-4">CONTACT</div>
            <ul className="flex flex-col gap-2 text-[15px]">
              <li>
                상담 전화 <a href={CONTACT.tel} className="text-white font-bold">{CONTACT.phone}</a>
              </li>
              <li>{CONTACT.email}</li>
              <li>{CONTACT.operator}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col gap-2 text-[13px] text-white/55">
          <p className="break-keep">
            (주)더기빙트리 (대표: 이창훈) &nbsp;|&nbsp; 경기도 파주시 하우고개길 106-3 &nbsp;|&nbsp; 사업자등록번호 : 204-87-03371
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span>Copyright © 2026 The Giving Tree Co., Ltd. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "샌달조식 | 기업 정기 조식 서비스",
  description: "기업 조식, 단순 배달이 아니라 운영입니다. 4주 식단, 주요 메뉴 직접 제조, 새벽배송, 사내진열까지 ㈜더기빙트리 운영 샌달조식이 책임집니다.",
  keywords: "샌달조식, 기업조식, 정기조식, 기업 조식 배달, 사내 조식, 새벽배송, 4주 식단, 더기빙트리",
  icons: { icon: "/brand/sandal-profile.png" },
  openGraph: {
    title: "샌달조식 | 기업 정기 조식 서비스",
    description: "기업 조식, 단순 배달이 아니라 운영입니다.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-E085T9VMT3" />
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const maruburi = localFont({
  src: [
    { path: "../public/fonts/MaruBuriOTF/MaruBuri-ExtraLight.otf", weight: "200" },
    { path: "../public/fonts/MaruBuriOTF/MaruBuri-Light.otf", weight: "300" },
    { path: "../public/fonts/MaruBuriOTF/MaruBuri-Regular.otf", weight: "400" },
    { path: "../public/fonts/MaruBuriOTF/MaruBuri-SemiBold.otf", weight: "600" },
    { path: "../public/fonts/MaruBuriOTF/MaruBuri-Bold.otf", weight: "700" },
  ],
  variable: "--font-maruburi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "더기빙트리 | 기업 식사 운영 서비스",
  description: "정직한 재료로, 누군가의 식탁을 정성껏 책임집니다. 기업 정기조식, 단체 도시락, 케이터링 전문 B2B 푸드 서비스.",
  keywords: "더기빙트리, 기업조식, 단체도시락, 샌드위치배달, B2B 케이터링, 파주",
  openGraph: {
    title: "더기빙트리 | 기업 식사 운영 서비스",
    description: "정직한 재료로, 누군가의 식탁을 정성껏 책임집니다.",
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
    <html lang="ko" className={`${cormorant.variable} ${pretendard.variable} ${maruburi.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-bark">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

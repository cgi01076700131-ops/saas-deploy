import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'CloudNote - AI 기반 지능형 클라우드 노트',
    template: '%s | CloudNote',
  },
  description: '흩어진 생각의 파편들을 AI가 자동으로 분류하고 구조화된 인사이트로 변환해주는 프리미엄 클라우드 노트 서비스입니다.',
  keywords: ['CloudNote', '클라우드노트', 'AI노트', '메모앱', '지식관리', '스마트태그'],
  authors: [{ name: 'CloudNote Team' }],
  openGraph: {
    title: 'CloudNote - 당신의 아이디어를 클라우드에',
    description: 'AI 글쓰기 어시스턴트와 자동 요약 기능으로 더 생산적인 기록을 시작하세요.',
    url: baseUrl,
    siteName: 'CloudNote',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CloudNote 서비스 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudNote - AI 기반 지능형 클라우드 노트',
    description: 'AI가 알아서 정리해주는 당신의 두 번째 뇌, CloudNote.',
    images: ['/og-image.png'],
  },
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col pt-20">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

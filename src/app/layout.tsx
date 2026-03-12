import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * Pretendard Variable — self-hosted
 * 폰트 파일은 public/fonts/ 에 위치.
 * 다운로드: https://github.com/orioncactus/pretendard/releases
 * → PretendardVariable.woff2 (dynamic subset 권장)
 */
const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Village Hall — Wind & Flow',
    template: '%s | Wind & Flow',
  },
  description:
    '관계 인구와 지역을 잇는 네트워크 스테이트. 첫 번째 소도: 달뜨는마을, 인제 신월리.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://windandflow.xyz'
  ),
  openGraph: {
    siteName: 'Wind & Flow',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex min-h-screen flex-col bg-wf-warm text-wf-text antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

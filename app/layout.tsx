// app/layout.tsx

import type { Metadata, Viewport } from 'next'; // 👈 Viewport 타입을 import합니다.
import "./globals.css";

// 1. Metadata (SEO 관련 정보)
// 여기에는 이제 viewport 설정이 없습니다.
export const metadata: Metadata = {
  title: "PingPaid",
  description: "Ping Your Message to the World!",
};

// 2. Viewport (화면 제어 관련 정보) - ‼️ 이렇게 완전히 분리해야 합니다.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // 👈 아이폰 Safe Area를 위한 핵심 값
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
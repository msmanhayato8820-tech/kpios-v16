import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KPIOS v16 | アネストシステム経営ダッシュボード',
  description: '2035年売上100億円を目指すデータドリブン経営ダッシュボード',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

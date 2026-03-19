import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ForgeAPI',
  description: 'Build, publish, and monetize APIs in one platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-slate-950 text-slate-100">
          <header className="border-b border-slate-900/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <Link href="/" className="text-lg font-semibold tracking-wide">
                ForgeAPI
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-300">
                <Link href="/marketplace" className="hover:text-slate-100">
                  Marketplace
                </Link>
                <Link href="/seller" className="hover:text-slate-100">
                  Seller Dashboard
                </Link>
                <Link href="/consumer" className="hover:text-slate-100">
                  Consumer Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

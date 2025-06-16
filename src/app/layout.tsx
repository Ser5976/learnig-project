import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/sections/footer/componets/footer';
import Header from '@/components/sections/header/componets/header';
import Sidebar from '@/components/sections/sidebar/componets/sidebar';
import Providers from '@/lib/provider/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Learning Project',
  description: 'A project for learning Next.js and React',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="grid grid-cols-[1fr_4fr]  h-screen p-4">
            <Sidebar />
            <section className="">{children}</section>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

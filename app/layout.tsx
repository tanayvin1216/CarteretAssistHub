import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { getServerLocale } from '@/lib/i18n/server';

const fraunces = Fraunces({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Carteret Assist Hub · A county-wide directory of help',
  description:
    'A directory of the non-profits, committees, and volunteers serving Carteret County, North Carolina. Find help across 13 sectors of local need.',
  keywords: [
    'Carteret County',
    'North Carolina',
    'non-profit',
    'volunteer',
    'community service',
    'food pantry',
    'housing',
    'health',
    'youth',
    'seniors',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased text-body-text">
        <LocaleProvider initialLocale={locale}>
          {children}
          <Toaster position="top-right" richColors />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

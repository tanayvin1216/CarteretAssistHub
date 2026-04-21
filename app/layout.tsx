import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { getServerLocale } from '@/lib/i18n/server';

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
  title: 'Carteret Assist Hub · Community help in Carteret County, NC',
  description:
    'A directory of local non-profits in Carteret County, NC. Find help with food, housing, health, childcare, and more — or sign up to volunteer.',
  keywords: [
    'Carteret County',
    'North Carolina',
    'non-profit',
    'volunteer',
    'community service',
    'food pantry',
    'housing',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LocaleProvider initialLocale={locale}>
          {children}
          <Toaster position="top-right" richColors />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

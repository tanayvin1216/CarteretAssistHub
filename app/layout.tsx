import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import { getServerLocale } from '@/lib/i18n/server';
import { createClient } from '@/lib/supabase/server';
import { buildOverrides, buildSettings, getSiteContent } from '@/lib/siteContent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
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
  const supabase = await createClient();
  const content = await getSiteContent(supabase);
  const overrides = buildOverrides(content);
  const settings = buildSettings(content);
  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LocaleProvider initialLocale={locale} overrides={overrides}>
          <SiteSettingsProvider settings={settings}>
            {children}
            <Toaster position="top-right" richColors />
          </SiteSettingsProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

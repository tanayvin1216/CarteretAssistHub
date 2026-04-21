'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/LocaleContext';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative mt-32 bg-ink text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="sector-numeral text-xs text-ivory/50 tracking-[0.2em] uppercase mb-4">
            Carteret County · NC
          </p>
          <h3 className="font-display text-3xl md:text-4xl leading-[1.1] text-ivory max-w-md">
            Carteret <span className="italic text-sector-food">Assist</span> Hub.
          </h3>
          <p className="mt-6 text-sm text-ivory/70 max-w-md leading-relaxed">
            {t('footer.mission')}
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/50 mb-4">
            {t('footer.quickLinks')}
          </p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/sectors" className="hover:text-sector-arts transition-colors">{t('nav.directory')}</Link></li>
            <li><Link href="/get-help" className="hover:text-sector-arts transition-colors">{t('nav.getHelp')}</Link></li>
            <li><Link href="/volunteer" className="hover:text-sector-arts transition-colors">{t('nav.volunteer')}</Link></li>
            <li><Link href="/about" className="hover:text-sector-arts transition-colors">{t('nav.about')}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/50 mb-4">
            {t('nav.signIn')}
          </p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/portal/login" className="hover:text-sector-arts transition-colors">{t('nav.signInOrg')}</Link></li>
            <li><Link href="/admin/login" className="hover:text-sector-arts transition-colors">{t('nav.signInAdmin')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ivory/50">
          <p>{t('footer.copyright')}</p>
          <p>
            A sister site of{' '}
            <a
              href="https://github.com/tanayvin1216/FoodAssist_V2"
              className="underline hover:text-ivory"
              target="_blank"
              rel="noreferrer"
            >
              Food Assist
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

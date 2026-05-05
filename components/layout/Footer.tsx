'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/LocaleContext';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 bg-sand border-t border-divider">
      <div className="container-readable py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-baseline gap-0.5 mb-4">
            <span className="text-2xl font-extrabold tracking-tight text-ink leading-none">Assist</span>
            <span className="text-2xl font-extrabold tracking-tight text-primary leading-none">Hub</span>
            <span className="text-[9px] font-semibold text-muted-text tracking-widest ml-1.5 uppercase">NC</span>
          </div>
          <p className="text-sm text-body-text leading-relaxed max-w-sm">
            {t('footer.mission')}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">
            {t('footer.quickLinks')}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sectors" className="text-body-text hover:text-primary">{t('nav.directory')}</Link></li>
            <li><Link href="/get-help" className="text-body-text hover:text-primary">{t('nav.getHelp')}</Link></li>
            <li><Link href="/volunteer" className="text-body-text hover:text-primary">{t('nav.volunteer')}</Link></li>
            <li><Link href="/about" className="text-body-text hover:text-primary">{t('nav.about')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">
            {t('nav.signIn')}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/portal/login" className="text-body-text hover:text-primary">{t('nav.signInOrg')}</Link></li>
            <li><Link href="/admin/login" className="text-body-text hover:text-primary">{t('nav.signInAdmin')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-divider">
        <div className="container-readable py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-text">
          <p>{t('footer.copyright')}</p>
          <p>
            A sister site of{' '}
            <a
              href="https://food-assist-v2.vercel.app/"
              className="underline hover:text-primary"
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

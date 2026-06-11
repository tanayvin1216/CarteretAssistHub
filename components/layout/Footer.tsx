'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function Footer() {
  const { t } = useTranslation();
  const { sisterSiteUrl } = useSiteSettings();
  const contactEmail = t('footer.contactEmail');
  return (
    <footer className="mt-24 bg-sand border-t border-divider">
      <div className="container-readable py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5 mb-4">
            <span aria-hidden className="w-2 h-2 rounded-full bg-seafoam-deep" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[22px] text-ink tracking-tight">Assist Hub</span>
              <span className="text-[9px] font-semibold text-muted-text tracking-[0.22em] uppercase mt-1">
                Carteret County · NC
              </span>
            </span>
          </div>
          <p className="text-sm text-body-text leading-relaxed max-w-sm">
            {t('footer.mission')}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">
            {t('footer.quickLinks')}
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sectors" className="text-body-text hover:text-primary">{t('nav.directory')}</Link></li>
            <li><Link href="/get-help" className="text-body-text hover:text-primary">{t('nav.getHelp')}</Link></li>
            <li><Link href="/volunteer" className="text-body-text hover:text-primary">{t('nav.volunteer')}</Link></li>
            <li><Link href="/allies" className="text-body-text hover:text-primary">{t('nav.allies')}</Link></li>
            <li><Link href="/about" className="text-body-text hover:text-primary">{t('nav.about')}</Link></li>
            <li><Link href="/portal/login" className="text-body-text hover:text-primary">{t('nav.signInOrg')}</Link></li>
            <li><Link href="/admin/login" className="text-body-text hover:text-primary">{t('nav.signInAdmin')}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">
            {t('footer.contact')}
          </p>
          <p className="text-sm text-body-text leading-relaxed mb-3">
            {t('footer.contactLede')}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 break-all"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {contactEmail}
          </a>
        </div>
      </div>

      <div className="border-t border-divider">
        <div className="container-readable py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-text">
          <p>{t('footer.copyright')}</p>
          <p>
            A sister site of{' '}
            <a
              href={sisterSiteUrl}
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

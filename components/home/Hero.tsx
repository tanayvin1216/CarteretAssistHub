'use client';

import Link from 'next/link';
import { Heart, HandHeart, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface Props {
  sectorCount: number;
  orgCount: number;
  townCount: number;
}

export function Hero({ orgCount }: Props) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-sand/60 to-background">
      <div className="container-readable pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 text-primary-600 px-3 py-1 text-xs font-semibold mb-6">
            {t('hero.kicker')}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight text-ink leading-[1.1] mb-5">
            {t('hero.headline')}
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl mb-8">
            {t('hero.lede')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/get-help"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors shadow-sm"
            >
              <Heart className="h-4 w-4" />
              {t('hero.ctaHelp')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors"
            >
              <HandHeart className="h-4 w-4" />
              {t('hero.ctaVolunteer')}
            </Link>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-6 md:gap-12 max-w-xl border-t border-divider pt-8">
          <div>
            <dd className="text-2xl md:text-3xl font-bold text-ink tabular-nums">13</dd>
            <dt className="text-xs md:text-sm text-muted-text mt-0.5">{t('hero.stat.sectors')}</dt>
          </div>
          <div>
            <dd className="text-2xl md:text-3xl font-bold text-ink tabular-nums">{orgCount}</dd>
            <dt className="text-xs md:text-sm text-muted-text mt-0.5">{t('hero.stat.orgs')}</dt>
          </div>
          <div>
            <dd className="text-2xl md:text-3xl font-bold text-ink tabular-nums">EN/ES</dd>
            <dt className="text-xs md:text-sm text-muted-text mt-0.5">bilingual support</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HandHeart } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface Props {
  sectorCount: number;
  orgCount: number;
  townCount: number;
}

/**
 * Full-bleed coastal hero: the photograph carries the page under a single
 * flat ink scrim — no gradient washes. Editorial left-aligned composition:
 * kicker with a seafoam tide-rule, display-serif headline, lede, two calm
 * CTAs, and a hairline-ruled stats band anchoring the bottom.
 */
export function Hero({ sectorCount, orgCount, townCount }: Props) {
  const { t } = useTranslation();
  const { heroImageUrl } = useSiteSettings();

  const stats = [
    { value: sectorCount, label: t('hero.stat.sectors') },
    { value: orgCount, label: t('hero.stat.orgs') },
    { value: townCount, label: t('hero.stat.towns') },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src={heroImageUrl}
        alt="Carteret County, North Carolina — coastal view"
        fill
        priority
        sizes="100vw"
        unoptimized={heroImageUrl.startsWith('http')}
        className="object-cover object-center -z-10"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/55 -z-10" />

      <div className="container-readable pt-20 md:pt-28 pb-10 md:pb-14">
        {/* Kicker with tide-rule */}
        <p className="flex items-center gap-3 text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-white/85 mb-6 md:mb-8">
          <span aria-hidden className="h-px w-10 bg-seafoam" />
          {t('hero.kicker')}
        </p>

        <h1 className="font-display text-white text-4xl sm:text-5xl md:text-[4.25rem] leading-[1.05] tracking-tight max-w-3xl">
          {t('hero.headline')}
        </h1>

        <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mt-6 md:mt-8">
          {t('hero.lede')}
        </p>

        <div className="flex items-center gap-3 mt-9 flex-wrap">
          <Link
            href="/get-help"
            className="inline-flex items-center gap-2.5 h-12 px-6 bg-seafoam hover:bg-seafoam-deep text-ink text-[15px] font-semibold rounded-lg transition-colors group"
          >
            {t('hero.ctaHelp')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2.5 h-12 px-6 border border-white/40 hover:border-white/70 hover:bg-white/10 text-white text-[15px] font-semibold rounded-lg transition-colors"
          >
            <HandHeart className="h-4 w-4" />
            {t('hero.ctaVolunteer')}
          </Link>
        </div>

        {/* Stats band */}
        <div className="mt-14 md:mt-20 pt-7 border-t border-white/25 flex flex-wrap gap-x-12 gap-y-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl md:text-4xl text-white tabular-nums leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

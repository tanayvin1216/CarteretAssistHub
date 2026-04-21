'use client';

import Link from 'next/link';
import { ArrowUpRight, Heart, HandHeart } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface Props {
  sectorCount: number;
  orgCount: number;
  townCount: number;
}

export function Hero({ sectorCount, orgCount, townCount }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* editorial rule-line motif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-rule/40" />
        <div className="absolute top-[180px] left-0 right-0 h-px bg-rule/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Kicker */}
          <div className="col-span-12 md:col-span-7 mb-8 md:mb-12">
            <div className="flex items-baseline gap-3">
              <span className="sector-numeral text-sm text-sector-food">◆</span>
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted-text">
                {t('hero.kicker')}
              </p>
            </div>
          </div>

          {/* Headline — asymmetric, oversize serif */}
          <h1 className="col-span-12 md:col-span-10 font-display text-[2.75rem] sm:text-6xl md:text-[5.5rem] leading-[0.95] tracking-[-0.02em] text-ink mb-10 md:mb-14">
            {t('hero.headline')}
          </h1>

          {/* Lede + CTAs */}
          <div className="col-span-12 md:col-span-6 md:col-start-1">
            <p className="text-base md:text-[1.05rem] text-body-text leading-[1.7] max-w-xl">
              {t('hero.lede')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/get-help"
                className="inline-flex items-center justify-between gap-6 h-12 pl-5 pr-4 bg-ink text-ivory text-sm font-medium tracking-wide rounded-sm hover:bg-navy transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {t('hero.ctaHelp')}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-between gap-6 h-12 pl-5 pr-4 border border-ink/30 text-ink text-sm font-medium tracking-wide rounded-sm hover:border-ink hover:bg-ink/5 transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <HandHeart className="h-4 w-4" />
                  {t('hero.ctaVolunteer')}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>

          {/* Stats column — right-aligned, asymmetric */}
          <div className="col-span-12 md:col-span-4 md:col-start-9 mt-4 md:mt-0">
            <dl className="space-y-5 border-t border-rule/60 pt-6">
              <Stat numeral="13" label={t('hero.stat.sectors')} />
              <Stat numeral={String(orgCount)} label={t('hero.stat.orgs')} note={orgCount === 0 ? '—' : undefined} />
              <Stat numeral={String(townCount)} label={t('hero.stat.towns')} note={townCount === 0 ? '—' : undefined} />
            </dl>
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-rule">
              · index · {sectorCount} sectors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ numeral, label, note }: { numeral: string; label: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-muted-text tracking-wide">{label}</dt>
      <dd className="font-display text-3xl md:text-4xl text-ink tabular-nums leading-none">
        {note ?? numeral}
      </dd>
    </div>
  );
}

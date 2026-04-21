'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HandHeart } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface Props {
  sectorCount: number;
  orgCount: number;
  townCount: number;
}

/**
 * Modern editorial hero: floating centered heading with large bold type,
 * followed by a row of circular image panels flanked by solid teal shapes.
 * Inspired by CapEQ's landing — geometric, confident, generous whitespace.
 */
export function Hero({ orgCount }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-sand">
      {/* Top: centered title block */}
      <div className="relative z-10 container-readable pt-14 md:pt-20 pb-12 md:pb-16 text-center">
        <p className="text-xs md:text-[13px] font-semibold uppercase tracking-[0.2em] text-muted-text mb-5">
          {t('hero.kicker')}
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-extrabold tracking-tight text-ink leading-[0.98] max-w-5xl mx-auto">
          {t('hero.headline')}
        </h1>
        <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl mx-auto mt-6 md:mt-8">
          {t('hero.lede')}
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 md:mt-10 flex-wrap">
          <Link
            href="/get-help"
            className="inline-flex items-center gap-2 h-12 pl-5 pr-2 bg-ink text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors group"
          >
            <span className="px-1">{t('hero.ctaHelp')}</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 h-12 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-full hover:bg-sand-deep transition-colors"
          >
            <HandHeart className="h-4 w-4" />
            {t('hero.ctaVolunteer')}
          </Link>
        </div>
      </div>

      {/* Image + teal-shape composition */}
      <div className="relative">
        {/* Left teal half-circle */}
        <div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-32 md:w-56 h-[calc(100%-3rem)] bg-primary-100 rounded-r-full hidden sm:block"
        />
        {/* Right teal half-circle */}
        <div
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-32 md:w-56 h-[calc(100%-3rem)] bg-primary rounded-l-full hidden sm:block"
        />

        <div className="relative z-10 container-readable pb-16 md:pb-24">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* Primary circular image */}
            <div className="relative w-[min(90vw,620px)] aspect-square max-w-[620px] rounded-full overflow-hidden shadow-[0_20px_60px_-20px_rgba(28,31,38,0.25)] ring-[6px] ring-surface">
              <Image
                src="/carteret.avif"
                alt="Carteret County"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 620px"
                className="object-cover"
              />
              {/* Soft inner vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Optional secondary circular stat card (desktop only, to balance) */}
            <div className="hidden lg:flex flex-col items-center justify-center w-64 aspect-square rounded-full bg-primary text-white p-8 text-center shadow-[0_20px_60px_-20px_rgba(15,118,110,0.5)] ring-[6px] ring-surface">
              <p className="text-5xl font-extrabold tabular-nums leading-none">{orgCount}</p>
              <p className="text-xs font-semibold uppercase tracking-widest mt-3 text-white/80">
                local non-profits
              </p>
              <div className="w-10 h-px bg-white/30 my-4" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                13 sectors
              </p>
              <p className="text-xs text-white/60 mt-1">Carteret County · NC</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

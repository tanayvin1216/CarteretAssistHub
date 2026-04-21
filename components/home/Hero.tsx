'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HandHeart, MapPin } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface Props {
  sectorCount: number;
  orgCount: number;
  townCount: number;
}

/**
 * Hero: clean warm text block at the top, then a wide landscape photo of
 * Carteret presented as a featured panel — big soft corners, a subtle
 * offset sand-deep layer peeking out behind for depth. The photo is the
 * visual hero; the text stays crisp and readable.
 */
export function Hero({ orgCount }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative bg-sand">
      {/* Text block */}
      <div className="container-readable pt-14 md:pt-20 pb-10 md:pb-14 text-center">
        <p className="text-xs md:text-[13px] font-semibold uppercase tracking-[0.2em] text-muted-text mb-5">
          {t('hero.kicker')}
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-[4.5rem] font-extrabold tracking-tight text-ink leading-[0.98] max-w-4xl mx-auto">
          {t('hero.headline')}
        </h1>
        <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl mx-auto mt-6 md:mt-8">
          {t('hero.lede')}
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link
            href="/get-help"
            className="inline-flex items-center gap-2 h-12 pl-5 pr-2 bg-ink text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors group shadow-sm"
          >
            <span className="px-1">{t('hero.ctaHelp')}</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 h-12 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-full hover:bg-sand-deep transition-colors shadow-sm"
          >
            <HandHeart className="h-4 w-4" />
            {t('hero.ctaVolunteer')}
          </Link>
        </div>
      </div>

      {/* Featured image panel with offset layer */}
      <div className="container-readable pb-16 md:pb-24">
        <div className="relative">
          {/* Offset teal panel peeking behind image (depth cue) */}
          <div
            aria-hidden
            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-2/3 md:w-1/2 h-2/3 md:h-1/2 bg-primary-100 rounded-3xl -z-0"
          />

          {/* Main image card */}
          <div className="relative overflow-hidden rounded-3xl aspect-[16/9] md:aspect-[21/9] shadow-[0_20px_60px_-25px_rgba(28,31,38,0.35)] ring-1 ring-divider">
            <Image
              src="/carteret.avif"
              alt="Carteret County, North Carolina — coastal view"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center"
            />

            {/* Caption pill — bottom-left */}
            <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6">
              <span className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-ink shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Carteret County · North Carolina
              </span>
            </div>

            {/* Stats pill — bottom-right (desktop only, understated) */}
            <div className="hidden md:flex absolute right-6 bottom-6 items-center gap-5 h-12 px-5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-ink tabular-nums">13</span>
                <span className="text-[11px] uppercase tracking-wider text-muted-text">sectors</span>
              </div>
              <span className="w-px h-4 bg-divider" aria-hidden />
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-ink tabular-nums">{orgCount}</span>
                <span className="text-[11px] uppercase tracking-wider text-muted-text">orgs</span>
              </div>
              <span className="w-px h-4 bg-divider" aria-hidden />
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-primary tabular-nums">EN · ES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

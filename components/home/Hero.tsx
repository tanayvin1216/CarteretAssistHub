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
 * Hero with a calm Carteret beach backdrop.
 * The image sits behind the content at full section coverage. A soft warm
 * overlay (sand-cream 70–80%) keeps the image atmospheric rather than loud,
 * so the text remains the focal point. No bubbles, no geometry.
 */
export function Hero({ orgCount }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/carteret.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover object-center -z-10"
      />
      {/* Soft warm overlay — calms the image, keeps dark text readable */}
      <div aria-hidden className="absolute inset-0 bg-canvas/75 -z-10" />
      {/* Gentle vignette from top to help header blend into image */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-canvas to-transparent -z-10"
      />
      {/* Gentle transition at bottom into the next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent -z-10"
      />

      <div className="relative container-readable pt-20 md:pt-28 pb-24 md:pb-36 text-center">
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
            className="inline-flex items-center gap-2 h-12 pl-5 pr-2 bg-ink text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors group shadow-sm"
          >
            <span className="px-1">{t('hero.ctaHelp')}</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 h-12 px-5 bg-surface/90 backdrop-blur-sm border border-divider text-ink text-sm font-semibold rounded-full hover:bg-surface transition-colors shadow-sm"
          >
            <HandHeart className="h-4 w-4" />
            {t('hero.ctaVolunteer')}
          </Link>
        </div>

        {/* Small stats row — calm, text-only, no circles */}
        <div className="mt-14 md:mt-20 flex items-center justify-center gap-8 md:gap-14 flex-wrap text-center">
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-ink tabular-nums leading-none">13</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-text mt-1.5">
              {t('hero.stat.sectors')}
            </p>
          </div>
          <span className="hidden md:inline-block w-px h-6 bg-divider" aria-hidden />
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-ink tabular-nums leading-none">{orgCount}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-text mt-1.5">
              {t('hero.stat.orgs')}
            </p>
          </div>
          <span className="hidden md:inline-block w-px h-6 bg-divider" aria-hidden />
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-ink tabular-nums leading-none">EN · ES</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-text mt-1.5">
              bilingual
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

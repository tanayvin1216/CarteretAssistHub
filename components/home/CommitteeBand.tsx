'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

/**
 * Committee provenance band — between the dual CTA and the footer. Gives the
 * hub its political/organizational context. Left column is intentionally wide
 * (9/12) so the pull-quote style serif copy has visual presence rather than
 * disappearing as a centered strip.
 */
export function CommitteeBand() {
  const { t } = useTranslation();
  return (
    <section className="relative bg-parchment/50 border-y border-rule/40">
      {/* Large decorative numeral in the background, editorial touch */}
      <div
        aria-hidden
        className="absolute -left-4 -bottom-12 font-display text-[18rem] leading-none text-ink/[0.04] select-none hidden md:block"
      >
        13
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24 grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 md:col-span-9">
          <p className="sector-numeral text-xs tracking-[0.28em] uppercase text-sector-food mb-6">
            · est. 2026 · Carteret County Committee
          </p>
          <p className="font-display text-3xl md:text-[2.5rem] leading-[1.15] tracking-[-0.01em] text-ink max-w-3xl">
            A project of the{' '}
            <span className="italic">Carteret County Community Service Committee</span> —
            organized with the county Democratic Party and a growing network of local
            non-profit partners who share one ambition: make help easier to find and
            easier to give.
          </p>
          <div className="mt-8 flex items-center gap-8 text-xs uppercase tracking-[0.22em] text-muted-text">
            <span>
              <span className="font-display text-xl text-ink tabular-nums mr-2">13</span>
              subcommittees
            </span>
            <span className="w-px h-3 bg-rule" />
            <span>Carteret · Beaufort · Morehead City · Newport</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3 flex md:items-end md:justify-end">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink border-b border-ink pb-0.5 hover:border-sector-food hover:text-sector-food transition-colors"
          >
            {t('nav.about')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

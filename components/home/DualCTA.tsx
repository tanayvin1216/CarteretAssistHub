'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

/**
 * A two-panel editorial CTA band. Left: "I need help." Right: "I want to help."
 * Asymmetric — the two halves carry different aesthetic weights. No uniform
 * side-by-side cards.
 */
export function DualCTA() {
  const { t } = useTranslation();
  return (
    <section className="relative bg-ivory-deep">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid grid-cols-12 gap-6 md:gap-10">
        <Link
          href="/get-help"
          className="col-span-12 md:col-span-7 group relative overflow-hidden bg-ink text-ivory p-10 md:p-14 rounded-sm transition-transform hover:-translate-y-1"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/50 mb-8">
            · 01 · Need
          </p>
          <h3 className="font-display text-4xl md:text-[3.25rem] leading-[1.02] tracking-[-0.015em] mb-6">
            I&apos;m looking for <span className="italic text-sector-food">help</span>.
          </h3>
          <p className="text-sm md:text-base text-ivory/75 max-w-md leading-relaxed">
            Food, housing, health, child care, shelter, recovery — pick a category and we&apos;ll show
            you every Carteret County non-profit that can help.
          </p>
          <div className="mt-12 inline-flex items-center gap-2 text-sm font-medium border-b border-ivory/50 pb-1 group-hover:border-sector-food group-hover:text-sector-food transition-colors">
            {t('hero.ctaHelp')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </div>

          {/* decorative numeral */}
          <div
            aria-hidden
            className="absolute -right-6 -bottom-10 font-display text-[16rem] leading-none text-ivory/5 select-none"
          >
            01
          </div>
        </Link>

        <Link
          href="/volunteer"
          className="col-span-12 md:col-span-5 group relative overflow-hidden bg-background border border-ink/20 p-10 md:p-14 rounded-sm transition-all hover:-translate-y-1 hover:border-sector-food"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-text mb-8">
            · 02 · Offer
          </p>
          <h3 className="font-display text-4xl md:text-[2.75rem] leading-[1.05] tracking-[-0.015em] text-ink mb-6">
            I want to <span className="italic text-sector-environment">help</span>.
          </h3>
          <p className="text-sm md:text-base text-body-text max-w-md leading-relaxed">
            Browse open volunteer roles across all 13 sectors. Apply to a specific role or send a
            general application and we&apos;ll match you with an organization.
          </p>
          <div className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-ink border-b border-ink pb-1 group-hover:border-sector-food group-hover:text-sector-food transition-colors">
            {t('hero.ctaVolunteer')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </div>

          <div
            aria-hidden
            className="absolute -right-4 -bottom-8 font-display text-[12rem] leading-none text-ink/[0.035] select-none"
          >
            02
          </div>
        </Link>
      </div>
    </section>
  );
}

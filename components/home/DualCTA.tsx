'use client';

import Link from 'next/link';
import { Heart, HandHeart, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

export function DualCTA() {
  const { t } = useTranslation();
  return (
    <section className="bg-sand">
      <div className="container-readable py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Link
            href="/get-help"
            className="group bg-surface rounded-2xl p-7 md:p-9 border border-divider hover:border-primary hover:shadow-sm transition-all"
          >
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-100 text-primary-600 mb-5">
              <Heart className="h-5 w-5" />
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-ink mb-2">
              I&apos;m looking for help
            </h3>
            <p className="text-sm md:text-base text-body-text leading-relaxed mb-5">
              Food, housing, health, childcare, shelter, recovery. Pick a category and we&apos;ll
              show you every local non-profit that can help.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
              {t('hero.ctaHelp')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/volunteer"
            className="group bg-surface rounded-2xl p-7 md:p-9 border border-divider hover:border-primary hover:shadow-sm transition-all"
          >
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-warm-100 text-warm-600 mb-5">
              <HandHeart className="h-5 w-5" />
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-ink mb-2">
              I want to volunteer
            </h3>
            <p className="text-sm md:text-base text-body-text leading-relaxed mb-5">
              Browse open roles across all 13 sectors. Apply to a specific role or send a general
              application and we&apos;ll match you.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
              {t('hero.ctaVolunteer')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

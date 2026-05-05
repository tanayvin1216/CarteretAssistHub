'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

export function CommitteeBand() {
  const { t } = useTranslation();
  return (
    <section className="bg-background border-t border-divider">
      <div className="container-readable py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
            About the hub
          </p>
          <p className="text-lg md:text-xl text-ink font-medium leading-snug">
            A project of the{' '}
            <span className="text-primary">
              Carteret County Democratic Party — Community Service Committee
            </span>
            , in partnership with local non-profit partners.
          </p>
        </div>
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

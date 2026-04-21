'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/LocaleContext';

export function CommitteeBand() {
  const { t } = useTranslation();
  return (
    <section className="bg-parchment/40 border-y border-rule/40">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-3">
            About the hub
          </p>
          <p className="font-display text-2xl md:text-3xl leading-[1.2] tracking-[-0.01em] text-ink">
            A project of the <span className="italic">Carteret County Community Service Committee</span> —
            organized with the county Democratic Party and local non-profit partners.
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink border-b border-ink pb-0.5 hover:border-sector-food hover:text-sector-food transition-colors"
          >
            {t('nav.about')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

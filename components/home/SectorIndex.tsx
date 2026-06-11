'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import type { Sector } from '@/types/database';
import { SECTORS } from '@/lib/sectors';

interface Props {
  sectors: Sector[];
  orgCountsBySector: Record<string, number>;
  needCountsBySector: Record<string, number>;
}

export function SectorIndex({ sectors, orgCountsBySector, needCountsBySector }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  const rows = SECTORS.map((meta) => {
    const db = sectors.find((s) => s.slug === meta.slug);
    return {
      slug: meta.slug,
      name: locale === 'es' ? (db?.name_es ?? meta.nameEs) : (db?.name ?? meta.name),
      description:
        locale === 'es'
          ? (db?.short_description_es ?? meta.shortDescriptionEs)
          : (db?.short_description ?? meta.shortDescription),
      accent: db?.accent_color ?? meta.accentHex,
      status: db?.status ?? 'forming',
      orgCount: orgCountsBySector[meta.slug] ?? 0,
      needCount: needCountsBySector[meta.slug] ?? 0,
    };
  });

  return (
    <section id="sectors" className="bg-background">
      <div className="container-readable py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-4">
            <span aria-hidden className="h-px w-8 bg-seafoam-deep" />
            {t('nav.directory')}
          </p>
          <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-ink mb-4">
            {t('sectors.sectionTitle')}
          </h2>
          <p className="text-base text-body-text leading-relaxed">
            {t('sectors.sectionLede')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {rows.map((row, index) => (
            <Link
              key={row.slug}
              href={`/sectors/${row.slug}`}
              className="group bg-surface border border-divider rounded-xl p-6 hover:border-primary-600/35 hover:shadow-[0_8px_24px_-16px_rgba(28,31,38,0.25)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-muted-text tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: row.accent }}
                    aria-hidden
                  />
                </span>
                {row.status === 'active' && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-600 bg-seafoam-tint px-2 py-1 rounded-md">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-display text-[1.35rem] leading-snug text-ink mb-2 group-hover:text-primary-600 transition-colors">
                {row.name}
              </h3>
              <p className="text-sm text-body-text leading-relaxed line-clamp-2 mb-5">
                {row.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-divider">
                <p className="text-xs text-muted-text">
                  <span className="font-semibold text-ink tabular-nums">{row.orgCount}</span> orgs
                  <span className="mx-1.5 text-rule">·</span>
                  <span className="font-semibold text-ink tabular-nums">{row.needCount}</span> roles
                </p>
                <ArrowRight className="h-4 w-4 text-muted-text group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

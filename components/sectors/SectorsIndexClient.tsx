'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { SECTORS } from '@/lib/sectors';
import type { Sector } from '@/types/database';

export function SectorsIndexClient({
  sectors,
  orgCounts,
  needCounts,
}: {
  sectors: Sector[];
  orgCounts: Record<string, number>;
  needCounts: Record<string, number>;
}) {
  const { t } = useTranslation();
  const locale = useLocale();

  const rows = SECTORS.map((meta) => {
    const db = sectors.find((s) => s.slug === meta.slug);
    return {
      slug: meta.slug,
      numeral: db?.numeral ?? meta.numeral,
      name: locale === 'es' ? (db?.name_es ?? meta.nameEs) : (db?.name ?? meta.name),
      description: locale === 'es'
        ? (db?.short_description_es ?? meta.shortDescriptionEs)
        : (db?.short_description ?? meta.shortDescription),
      accent: db?.accent_color ?? meta.accentHex,
      status: db?.status ?? 'forming',
      orgCount: orgCounts[meta.slug] ?? 0,
      needCount: needCounts[meta.slug] ?? 0,
    };
  });

  return (
    <div>
      <section className="border-b border-rule/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-4">
              {t('sectors.overlineLabel')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink">
              {t('sectors.sectionTitle')}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 md:mt-20">
            <p className="text-base text-body-text leading-[1.7] max-w-sm">
              {t('sectors.sectionLede')}
            </p>
          </div>
        </div>
      </section>

      <section>
        <ol className="mx-auto max-w-6xl px-6">
          {rows.map((row) => (
            <li key={row.slug} className="group border-b border-rule/50">
              <Link
                href={`/sectors/${row.slug}`}
                className="grid grid-cols-12 gap-6 items-baseline py-8 md:py-10 transition-colors"
              >
                <div className="col-span-12 md:col-span-2 flex items-center gap-3">
                  <span
                    className="inline-block w-3 h-3 rounded-[1px]"
                    style={{ backgroundColor: row.accent }}
                  />
                  <span className="sector-numeral text-sm text-rule tabular-nums">
                    {row.numeral}
                  </span>
                  <span
                    className="ml-auto text-[9px] uppercase tracking-[0.22em] text-muted-text px-2 py-0.5 rounded-sm border border-rule/50"
                    style={row.status === 'active' ? { color: row.accent, borderColor: row.accent } : {}}
                  >
                    {row.status === 'active' ? t('sectors.active') :
                     row.status === 'archived' ? t('sectors.archived') :
                     t('sectors.forming')}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h2
                    className="font-display text-3xl md:text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-ink transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = row.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    {row.name}
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <p className="text-sm text-body-text leading-[1.6] max-w-xs">{row.description}</p>
                </div>
                <div className="col-span-12 md:col-span-2 flex items-baseline justify-between md:justify-end gap-4 md:gap-6">
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <p className="font-display text-lg text-ink tabular-nums leading-none">
                      {row.orgCount} / {row.needCount}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-text">
                      orgs / roles
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-rule shrink-0 transition-transform group-hover:rotate-45"
                    style={{ color: row.accent }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

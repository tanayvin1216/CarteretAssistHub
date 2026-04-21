'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      name: locale === 'es' ? (db?.name_es ?? meta.nameEs) : (db?.name ?? meta.name),
      description:
        locale === 'es'
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
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            {t('sectors.sectionTitle')}
          </h1>
          <p className="text-base text-body-text leading-relaxed max-w-2xl">
            {t('sectors.sectionLede')}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((row) => (
              <Link
                key={row.slug}
                href={`/sectors/${row.slug}`}
                className="group bg-surface border border-divider rounded-xl p-5 hover:border-ink/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: row.accent }}
                  />
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      row.status === 'active'
                        ? 'text-primary-600 bg-primary-100'
                        : 'text-muted-text bg-sand'
                    }`}
                  >
                    {row.status === 'active' ? t('sectors.active') : row.status === 'archived' ? t('sectors.archived') : t('sectors.forming')}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-ink mb-1.5 group-hover:text-primary transition-colors">
                  {row.name}
                </h2>
                <p className="text-sm text-body-text leading-relaxed line-clamp-2 mb-4">
                  {row.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-divider">
                  <p className="text-xs text-muted-text">
                    <span className="font-semibold text-ink tabular-nums">{row.orgCount}</span> orgs
                    <span className="mx-1.5 text-rule">·</span>
                    <span className="font-semibold text-ink tabular-nums">{row.needCount}</span> roles
                  </p>
                  <ArrowRight className="h-4 w-4 text-muted-text group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

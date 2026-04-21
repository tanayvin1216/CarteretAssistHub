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
      <div className="container-readable py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">
            {t('sectors.sectionTitle')}
          </h2>
          <p className="text-base text-body-text leading-relaxed">
            {t('sectors.sectionLede')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                  aria-hidden
                />
                {row.status === 'active' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-[17px] font-semibold text-ink mb-1.5 group-hover:text-primary transition-colors">
                {row.name}
              </h3>
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
  );
}

'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import type { Sector } from '@/types/database';
import { SECTORS, sectorBySlug } from '@/lib/sectors';

interface Props {
  sectors: Sector[];
  orgCountsBySector: Record<string, number>;
  needCountsBySector: Record<string, number>;
}

/**
 * Thirteen sectors presented as an editorial index — numbered list rather
 * than uniform cards. Each row is a hoverable link that opens the sector
 * page. The palette is what does the visual work: each sector has a distinct
 * accent color used for the numeral and the underline on hover.
 *
 * If the DB has fewer sectors than SECTORS (local copy), we fall back to the
 * local copy so the homepage never looks broken mid-seeding.
 */
export function SectorIndex({ sectors, orgCountsBySector, needCountsBySector }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  // Merge: use DB row if present, else local SECTORS meta for display.
  const rows = SECTORS.map((meta) => {
    const db = sectors.find((s) => s.slug === meta.slug);
    return {
      slug: meta.slug,
      numeral: db?.numeral ?? meta.numeral,
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

  const statusLabel = (status: string) =>
    status === 'active' ? t('sectors.active') :
    status === 'archived' ? t('sectors.archived') :
    t('sectors.forming');

  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-text mb-3">
              {t('sectors.overlineLabel')}
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-[-0.01em] text-ink">
              {t('sectors.sectionTitle')}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 md:mt-16">
            <p className="text-sm md:text-base text-body-text leading-[1.7] max-w-md">
              {t('sectors.sectionLede')}
            </p>
          </div>
        </div>

        {/* Editorial numbered list */}
        <ol className="border-t border-rule/60">
          {rows.map((row) => {
            const sector = sectorBySlug(row.slug)!;
            return (
              <li
                key={row.slug}
                className="group relative border-b border-rule/60 transition-colors"
              >
                <Link
                  href={`/sectors/${row.slug}`}
                  className="grid grid-cols-12 gap-4 md:gap-6 items-baseline py-6 md:py-7 px-1 md:px-2 transition-all"
                >
                  {/* Numeral + accent square */}
                  <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-[1px] shrink-0"
                      style={{ backgroundColor: row.accent }}
                      aria-hidden
                    />
                    <span className="sector-numeral text-[13px] md:text-sm text-rule tabular-nums">
                      {row.numeral}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="col-span-10 md:col-span-4">
                    <h3
                      className="font-display text-xl md:text-[1.75rem] text-ink tracking-[-0.01em] leading-tight transition-colors group-hover:italic"
                      style={{ ['--hover-color' as string]: row.accent }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = row.accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {row.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="hidden md:block col-span-4">
                    <p className="text-sm text-body-text leading-[1.6]">{row.description}</p>
                  </div>

                  {/* Counts + arrow */}
                  <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-6">
                    <div className="flex items-baseline gap-4 text-[11px] uppercase tracking-[0.15em] text-muted-text">
                      <span>
                        <span className="font-display text-base text-ink tabular-nums mr-1.5">
                          {row.orgCount}
                        </span>
                        orgs
                      </span>
                      <span className="w-px h-3 bg-rule" aria-hidden />
                      <span>
                        <span className="font-display text-base text-ink tabular-nums mr-1.5">
                          {row.needCount}
                        </span>
                        roles
                      </span>
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-rule transition-transform group-hover:rotate-45"
                      style={{ color: row.accent }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.25em] text-rule">
            · 13 of 13 ·
          </p>
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink border-b border-ink pb-0.5 hover:border-sector-food hover:text-sector-food transition-colors"
          >
            {t('sectors.viewAll')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

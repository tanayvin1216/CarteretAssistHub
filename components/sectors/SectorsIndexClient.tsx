'use client';

import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
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
  const directoryPdfHref = locale === 'es' ? '/directory.pdf?lang=es' : '/directory.pdf';

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
        <div className="container-readable py-14 md:py-20">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-4">
            <span aria-hidden className="h-px w-8 bg-seafoam-deep" />
            {t('nav.directory')}
          </p>
          <h1 className="font-display text-4xl md:text-[3.5rem] leading-[1.08] text-ink mb-5">
            {t('sectors.sectionTitle')}
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
            {t('sectors.sectionLede')}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable py-8 md:py-12">
          <ol className="divide-y divide-divider">
            {rows.map((row, index) => (
              <li key={row.slug}>
                <Link
                  href={`/sectors/${row.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-6 md:py-8 px-3 -mx-3 rounded-xl hover:bg-sand/50 transition-colors duration-200"
                >
                  <span className="flex items-center gap-4 sm:gap-5 min-w-0 sm:flex-1">
                    <span className="font-mono text-sm text-muted-text tabular-nums w-6 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: row.accent }}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-3">
                        <span className="font-display text-xl md:text-[1.6rem] leading-snug text-ink group-hover:text-primary-600 transition-colors">
                          {row.name}
                        </span>
                        <span
                          className={`hidden md:inline-block text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-md ${
                            row.status === 'active'
                              ? 'text-primary-600 bg-seafoam-tint'
                              : 'text-muted-text bg-sand'
                          }`}
                        >
                          {row.status === 'active'
                            ? t('sectors.active')
                            : row.status === 'archived'
                              ? t('sectors.archived')
                              : t('sectors.forming')}
                        </span>
                      </span>
                      <span className="hidden sm:block text-sm text-muted-text leading-relaxed line-clamp-1 mt-1">
                        {row.description}
                      </span>
                    </span>
                  </span>

                  <span className="flex items-center gap-8 sm:gap-10 pl-10 sm:pl-0 shrink-0">
                    <span>
                      <span className="block font-display text-xl md:text-2xl text-ink tabular-nums leading-none">
                        {row.orgCount}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-text mt-1.5">
                        {t('sectors.orgsCount')}
                      </span>
                    </span>
                    <span>
                      <span className="block font-display text-xl md:text-2xl text-ink tabular-nums leading-none">
                        {row.needCount}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-text mt-1.5">
                        {t('sectors.volunteerNeedsCount')}
                      </span>
                    </span>
                    <ArrowRight className="hidden sm:block h-5 w-5 text-muted-text group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable pb-16 md:pb-24">
          <div className="bg-sand border border-divider rounded-2xl p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-7">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-3">
                {t('pdf.link')}
              </p>
              <h2 className="font-display text-2xl md:text-[2rem] leading-tight text-ink mb-3">
                {t('pdf.title')}
              </h2>
              <p className="text-sm md:text-base text-body-text leading-relaxed max-w-xl">
                {t('pdf.lede')}
              </p>
              <p className="text-xs text-muted-text mt-3">{t('pdf.note')}</p>
            </div>
            <a
              href={directoryPdfHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 shrink-0 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              {t('pdf.cta')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Phone, Search, X } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { SECTORS } from '@/lib/sectors';
import type { Sector } from '@/types/database';

type OrgLite = {
  id: string;
  name: string;
  town: string;
  sector_slug: string | null;
  spanish_available: boolean;
  phone: string;
  website: string | null;
  additional_sector_slugs: string[];
};

interface Props {
  sectors: Sector[];
  organizations: OrgLite[];
}

export function GetHelpClient({ sectors, organizations }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [spanishOnly, setSpanishOnly] = useState(false);

  const rows = useMemo(
    () =>
      SECTORS.map((meta) => {
        const db = sectors.find((s) => s.slug === meta.slug);
        const count = organizations.filter(
          (o) => o.sector_slug === meta.slug || (o.additional_sector_slugs ?? []).includes(meta.slug),
        ).length;
        return {
          slug: meta.slug,
          name: locale === 'es' ? (db?.name_es ?? meta.nameEs) : (db?.name ?? meta.name),
          description:
            locale === 'es'
              ? (db?.short_description_es ?? meta.shortDescriptionEs)
              : (db?.short_description ?? meta.shortDescription),
          accent: db?.accent_color ?? meta.accentHex,
          count,
        };
      }),
    [sectors, organizations, locale],
  );

  const filtered = useMemo(() => {
    let out = organizations;
    if (selectedSlug && selectedSlug !== '_all_') {
      out = out.filter(
        (o) => o.sector_slug === selectedSlug || (o.additional_sector_slugs ?? []).includes(selectedSlug),
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((o) => o.name.toLowerCase().includes(q) || o.town.toLowerCase().includes(q));
    }
    if (spanishOnly) {
      out = out.filter((o) => o.spanish_available);
    }
    return out;
  }, [organizations, selectedSlug, query, spanishOnly]);

  const selectedMeta = selectedSlug && selectedSlug !== '_all_' ? rows.find((r) => r.slug === selectedSlug) : null;

  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-14 md:py-20">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-4">
            <span aria-hidden className="h-px w-8 bg-seafoam-deep" />
            {t('nav.getHelp')}
          </p>
          <h1 className="font-display text-4xl md:text-[3.5rem] leading-[1.08] text-ink mb-5">
            {t('getHelp.title')}
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
            {t('getHelp.lede')}
          </p>
        </div>
      </section>

      {!selectedSlug && (
        <section className="bg-background">
          <div className="container-readable py-10 md:py-14">
            <p className="text-sm font-semibold text-ink mb-5">{t('getHelp.pickCategory')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {rows.map((row) => (
                <button
                  key={row.slug}
                  onClick={() => setSelectedSlug(row.slug)}
                  className="group text-left bg-surface border border-divider rounded-xl p-5 hover:border-primary-600/35 hover:shadow-[0_8px_24px_-16px_rgba(28,31,38,0.25)] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: row.accent }}
                    />
                    <span className="font-mono text-xs text-muted-text tabular-nums">
                      {row.count}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.05rem] text-ink leading-snug mb-1.5 group-hover:text-primary-600 transition-colors">
                    {row.name}
                  </h3>
                  <p className="text-xs text-muted-text leading-relaxed line-clamp-2">
                    {row.description}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedSlug('_all_')}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {t('getHelp.seeAll')}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* The sectors above list partner organizations. Services that
                belong to no sector — clinics, apartments, transportation —
                live in the resource directory, so point there too. */}
            <div className="mt-10 bg-sand border border-divider rounded-xl p-6 md:p-8">
              <h2 className="font-display text-xl md:text-2xl text-ink leading-snug mb-2">
                {t('getHelp.resourcesTitle')}
              </h2>
              <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-5">
                {t('getHelp.resourcesLede')}
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 h-10 px-4 bg-seafoam hover:bg-seafoam-deep text-ink text-[13.5px] font-semibold rounded-lg transition-colors group"
              >
                {t('getHelp.resourcesCta')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {selectedSlug && (
        <section className="bg-background">
          <div className="container-readable py-8 md:py-12">
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <button
                onClick={() => {
                  setSelectedSlug(null);
                  setQuery('');
                  setSpanishOnly(false);
                }}
                className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-ink"
              >
                <X className="h-3.5 w-3.5" /> Reset
              </button>
              {selectedMeta && (
                <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md bg-ink text-surface">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: selectedMeta.accent }}
                    aria-hidden
                  />
                  {selectedMeta.name}
                </span>
              )}
              {selectedSlug === '_all_' && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-ink text-surface">
                  All sectors
                </span>
              )}
              <label className="ml-auto flex items-center gap-2 text-sm text-body-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={spanishOnly}
                  onChange={(e) => setSpanishOnly(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Spanish available
              </label>
            </div>

            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name or town…"
                className="w-full h-11 pl-10 pr-4 bg-surface border border-divider rounded-lg text-sm text-ink placeholder:text-muted-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            <p className="text-sm text-muted-text mb-4">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>

            {filtered.length === 0 ? (
              <div className="bg-sand border border-divider rounded-xl p-10 text-center">
                <p className="text-sm text-body-text">No organizations match that filter yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((org) => {
                  const sectorMeta = SECTORS.find((s) => s.slug === org.sector_slug);
                  return (
                    <Link
                      key={org.id}
                      href={`/organizations/${org.id}`}
                      className="group bg-surface border border-divider rounded-xl p-5 hover:border-primary-600/35 hover:shadow-[0_8px_24px_-16px_rgba(28,31,38,0.25)] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-[1.1rem] text-ink leading-snug group-hover:text-primary-600 transition-colors">
                          {org.name}
                        </h3>
                        {org.spanish_available && (
                          <span className="shrink-0 text-[10px] font-semibold text-primary-600 bg-seafoam-tint px-2 py-1 rounded-md">
                            ES
                          </span>
                        )}
                      </div>
                      {sectorMeta && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-text mb-3">
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: sectorMeta.accentHex }}
                          />
                          {sectorMeta.name}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-text pt-3 border-t border-divider">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {org.town}
                        </span>
                        {org.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {org.phone}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

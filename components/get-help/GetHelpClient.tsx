'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, MapPin, Phone, Globe, Search, X } from 'lucide-react';
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
          (o) =>
            o.sector_slug === meta.slug ||
            (o.additional_sector_slugs ?? []).includes(meta.slug),
        ).length;
        return {
          slug: meta.slug,
          numeral: meta.numeral,
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
    if (selectedSlug) {
      out = out.filter(
        (o) =>
          o.sector_slug === selectedSlug ||
          (o.additional_sector_slugs ?? []).includes(selectedSlug),
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.town.toLowerCase().includes(q),
      );
    }
    if (spanishOnly) {
      out = out.filter((o) => o.spanish_available);
    }
    return out;
  }, [organizations, selectedSlug, query, spanishOnly]);

  const selectedMeta = selectedSlug ? rows.find((r) => r.slug === selectedSlug) : null;

  return (
    <div>
      <section className="bg-ivory border-b border-rule/40">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-3">
              · {t('nav.getHelp')} ·
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink">
              {t('getHelp.title')}
            </h1>
            <p className="mt-6 text-base md:text-lg text-body-text leading-[1.65] max-w-xl">
              {t('getHelp.lede')}
            </p>
          </div>
        </div>
      </section>

      {/* Sector picker */}
      {!selectedSlug && (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-8">
              {t('getHelp.pickCategory')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {rows.map((row) => (
                <button
                  key={row.slug}
                  onClick={() => setSelectedSlug(row.slug)}
                  className="group relative text-left p-6 bg-card border border-rule/40 rounded-sm hover:-translate-y-0.5 transition-all"
                  style={{ ['--accent' as string]: row.accent }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: row.accent }}
                    />
                    <span className="sector-numeral text-[10px] text-rule tabular-nums">
                      {row.numeral}
                    </span>
                  </div>
                  <h3
                    className="font-display text-lg md:text-xl text-ink leading-tight mb-2 transition-colors group-hover:italic"
                    onMouseEnter={(e) => (e.currentTarget.style.color = row.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    {row.name}
                  </h3>
                  <p className="text-xs text-muted-text leading-relaxed line-clamp-2">
                    {row.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-rule/30 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-text">
                      {row.count} {row.count === 1 ? 'org' : 'orgs'}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-rule transition-transform group-hover:rotate-45"
                      style={{ color: row.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => setSelectedSlug('_all_')}
                className="text-sm font-medium text-ink border-b border-ink pb-0.5 hover:border-sector-food hover:text-sector-food transition-colors"
              >
                {t('getHelp.seeAll')} →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {selectedSlug && (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <button
                onClick={() => {
                  setSelectedSlug(null);
                  setQuery('');
                  setSpanishOnly(false);
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3 text-xs uppercase tracking-wider text-muted-text hover:text-ink transition-colors"
              >
                <X className="h-3 w-3" /> Reset
              </button>
              {selectedMeta && (
                <span
                  className="text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                  style={{ backgroundColor: selectedMeta.accent, color: 'var(--color-ivory)' }}
                >
                  {selectedMeta.name}
                </span>
              )}
              {selectedSlug === '_all_' && (
                <span className="text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-ink text-ivory">
                  All sectors
                </span>
              )}
              <div className="flex-1" />
              <label className="flex items-center gap-2 text-xs text-muted-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={spanishOnly}
                  onChange={(e) => setSpanishOnly(e.target.checked)}
                  className="h-3.5 w-3.5 accent-ink"
                />
                Spanish-speaking only
              </label>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rule" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by organization name or town…"
                className="w-full h-12 pl-11 pr-4 bg-card border border-rule/60 rounded-full text-sm text-ink placeholder:text-muted-text focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-4">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-rule rounded-sm p-10 text-center">
                <p className="text-sm text-muted-text">No organizations match that filter yet.</p>
              </div>
            ) : (
              <ol className="border-t border-rule/40">
                {filtered.map((org, idx) => {
                  const sectorMeta = SECTORS.find((s) => s.slug === org.sector_slug);
                  return (
                    <li key={org.id} className="border-b border-rule/40 group">
                      <Link
                        href={`/organizations/${org.id}`}
                        className="grid grid-cols-12 gap-4 items-baseline py-6"
                      >
                        <span className="col-span-2 md:col-span-1 sector-numeral text-xs text-rule tabular-nums">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="col-span-10 md:col-span-5">
                          <h3 className="font-display text-xl md:text-2xl text-ink group-hover:italic transition-all leading-tight">
                            {org.name}
                          </h3>
                          {sectorMeta && (
                            <p
                              className="text-[10px] uppercase tracking-[0.18em] mt-1"
                              style={{ color: sectorMeta.accentHex }}
                            >
                              {sectorMeta.name}
                            </p>
                          )}
                        </div>
                        <div className="col-span-12 md:col-span-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-body-text">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-rule" />
                            {org.town}
                          </span>
                          {org.phone && (
                            <span className="flex items-center gap-1.5 text-muted-text">
                              <Phone className="h-3.5 w-3.5 text-rule" />
                              {org.phone}
                            </span>
                          )}
                        </div>
                        <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                          {org.spanish_available && (
                            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-text border border-rule/60 rounded-sm px-1.5 py-0.5">
                              ES
                            </span>
                          )}
                          <ArrowUpRight className="h-4 w-4 text-rule transition-transform group-hover:rotate-45" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

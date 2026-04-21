'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { SECTORS, sectorBySlug } from '@/lib/sectors';
import type { Sector, VolunteerNeed, Organization } from '@/types/database';

type NeedWithOrg = VolunteerNeed & {
  organization?: Pick<Organization, 'id' | 'name' | 'town'> | null;
};

interface Props {
  needs: NeedWithOrg[];
  sectors: Sector[];
}

export function VolunteerBrowse({ needs, sectors }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [filterSector, setFilterSector] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filterSector) return needs;
    return needs.filter((n) => n.sector_slug === filterSector);
  }, [needs, filterSector]);

  return (
    <div>
      <section className="bg-ivory border-b border-rule/40">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-3">
              · {t('nav.volunteer')} ·
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink">
              {t('volunteer.title')}
            </h1>
            <p className="mt-6 text-base md:text-lg text-body-text leading-[1.65] max-w-xl">
              {t('volunteer.lede')}
            </p>
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-10 md:mt-14">
            <Link
              href="/volunteer/apply"
              className="inline-flex items-center gap-2 h-11 px-5 bg-ink text-ivory text-sm font-medium rounded-full hover:bg-navy transition-colors"
            >
              {t('volunteer.applyGeneral')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-4">
            {t('volunteer.filterBySector')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSector(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filterSector === null
                  ? 'bg-ink text-ivory border-ink'
                  : 'border-rule/50 text-muted-text hover:border-ink hover:text-ink'
              }`}
            >
              All ({needs.length})
            </button>
            {SECTORS.map((s) => {
              const count = needs.filter((n) => n.sector_slug === s.slug).length;
              if (count === 0) return null;
              const active = filterSector === s.slug;
              return (
                <button
                  key={s.slug}
                  onClick={() => setFilterSector(s.slug)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                  style={
                    active
                      ? { backgroundColor: s.accentHex, color: 'var(--color-ivory)', borderColor: s.accentHex }
                      : { borderColor: 'var(--color-rule)' }
                  }
                >
                  {s.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          {filtered.length === 0 ? (
            <div className="border border-dashed border-rule rounded-sm p-12 text-center">
              <p className="font-display text-2xl text-ink mb-2">{t('volunteer.empty')}</p>
              <p className="text-sm text-muted-text">{t('volunteer.emptyBody')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((need) => {
                const sector = need.sector_slug ? sectorBySlug(need.sector_slug) : null;
                const accent = sector?.accentHex ?? '#1E3A5F';
                return (
                  <article
                    key={need.id}
                    className="group bg-card border border-rule/40 p-7 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="flex items-center justify-between mb-4">
                      {sector && (
                        <span
                          className="text-[10px] uppercase tracking-[0.22em]"
                          style={{ color: accent }}
                        >
                          · {sector.numeral} · {sector.name}
                        </span>
                      )}
                      {need.time_commitment && (
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-text flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {need.time_commitment}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl text-ink leading-tight mb-3 group-hover:italic transition-all">
                      {locale === 'es' && need.title_es ? need.title_es : need.title}
                    </h2>
                    <p className="text-sm text-body-text leading-relaxed line-clamp-3 mb-5">
                      {locale === 'es' && need.description_es ? need.description_es : need.description}
                    </p>

                    {need.organization && (
                      <div className="text-xs text-muted-text mb-5 pb-5 border-b border-rule/30 flex items-center gap-3">
                        <span className="font-medium text-ink">{need.organization.name}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {need.organization.town}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      {need.organization && (
                        <Link
                          href={`/organizations/${need.organization.id}`}
                          className="text-xs text-muted-text hover:text-ink transition-colors"
                        >
                          {t('volunteer.viewOrg')} →
                        </Link>
                      )}
                      <Link
                        href={`/volunteer/apply?need=${need.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium border-b pb-0.5 ml-auto"
                        style={{ color: accent, borderColor: accent }}
                      >
                        {t('volunteer.apply')}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

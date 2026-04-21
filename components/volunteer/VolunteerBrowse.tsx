'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
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

export function VolunteerBrowse({ needs }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [filterSector, setFilterSector] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filterSector) return needs;
    return needs.filter((n) => n.sector_slug === filterSector);
  }, [needs, filterSector]);

  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-12 md:py-16 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
              {t('volunteer.title')}
            </h1>
            <p className="text-base text-body-text leading-relaxed">
              {t('volunteer.lede')}
            </p>
          </div>
          <Link
            href="/volunteer/apply"
            className="inline-flex items-center gap-2 h-11 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors shadow-sm"
          >
            {t('volunteer.applyGeneral')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-background border-b border-divider">
        <div className="container-readable py-5">
          <p className="text-xs font-semibold text-muted-text uppercase tracking-wide mb-3">
            {t('volunteer.filterBySector')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSector(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filterSector === null
                  ? 'bg-ink text-white border-ink'
                  : 'border-divider text-muted-text hover:border-ink hover:text-ink bg-surface'
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                    active ? 'text-white border-transparent' : 'border-divider text-body-text hover:border-ink hover:text-ink bg-surface'
                  }`}
                  style={active ? { backgroundColor: s.accentHex } : {}}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: active ? 'white' : s.accentHex }}
                  />
                  {s.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable py-10 md:py-12">
          {filtered.length === 0 ? (
            <div className="bg-sand border border-divider rounded-xl p-12 text-center">
              <p className="text-lg font-semibold text-ink mb-2">{t('volunteer.empty')}</p>
              <p className="text-sm text-body-text">{t('volunteer.emptyBody')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((need) => {
                const sector = need.sector_slug ? sectorBySlug(need.sector_slug) : null;
                return (
                  <article
                    key={need.id}
                    className="bg-surface border border-divider rounded-xl p-6 hover:border-ink/30 hover:shadow-sm transition-all flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {sector && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-text">
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: sector.accentHex }}
                          />
                          {sector.name}
                        </span>
                      )}
                      {need.time_commitment && (
                        <span className="text-xs text-muted-text flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {need.time_commitment}
                        </span>
                      )}
                    </div>
                    <h2 className="font-semibold text-ink text-lg leading-snug mb-2">
                      {locale === 'es' && need.title_es ? need.title_es : need.title}
                    </h2>
                    <p className="text-sm text-body-text leading-relaxed line-clamp-3 mb-4 flex-1">
                      {locale === 'es' && need.description_es ? need.description_es : need.description}
                    </p>

                    {need.organization && (
                      <div className="text-xs text-muted-text mb-4 pb-4 border-b border-divider flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-ink">{need.organization.name}</span>
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
                          className="text-xs text-muted-text hover:text-primary transition-colors"
                        >
                          {t('volunteer.viewOrg')} →
                        </Link>
                      )}
                      <Link
                        href={`/volunteer/apply?need=${need.id}`}
                        className="ml-auto inline-flex items-center gap-1.5 h-9 px-3.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors"
                      >
                        {t('volunteer.apply')}
                        <ArrowRight className="h-3.5 w-3.5" />
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

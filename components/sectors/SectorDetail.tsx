'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import type {
  Sector,
  SubcommitteeLead,
  SectorActivity,
  Organization,
  VolunteerNeed,
} from '@/types/database';
import type { SectorMeta } from '@/lib/sectors';

interface Props {
  meta: SectorMeta;
  sector: Sector | null;
  leads: SubcommitteeLead[];
  activities: SectorActivity[];
  organizations: Organization[];
  needs: VolunteerNeed[];
}

export function SectorDetail({ meta, sector, leads, activities, organizations, needs }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  const name = locale === 'es' ? (sector?.name_es ?? meta.nameEs) : (sector?.name ?? meta.name);
  const description =
    locale === 'es'
      ? (sector?.description_es ?? sector?.short_description_es ?? meta.shortDescriptionEs)
      : (sector?.description ?? sector?.short_description ?? meta.shortDescription);
  const accent = sector?.accent_color ?? meta.accentHex;
  const status = sector?.status ?? 'forming';

  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-10 md:py-14">
          <Link
            href="/sectors"
            className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('sectors.backToDirectory')}
          </Link>

          <div className="flex items-start gap-3 mb-4">
            <span
              className="inline-block w-3 h-3 rounded-full mt-3"
              style={{ backgroundColor: accent }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    status === 'active'
                      ? 'text-primary-600 bg-primary-100'
                      : 'text-muted-text bg-surface border border-divider'
                  }`}
                >
                  {status === 'active' ? t('sectors.active') : status === 'archived' ? t('sectors.archived') : t('sectors.forming')}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
                {name}
              </h1>
              <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-10 max-w-lg border-t border-divider pt-6">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-ink tabular-nums">{organizations.length}</p>
              <p className="text-xs text-muted-text mt-0.5">{t('sectors.orgsCount')}</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-ink tabular-nums">{needs.length}</p>
              <p className="text-xs text-muted-text mt-0.5">{t('sectors.volunteerNeedsCount')}</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-ink tabular-nums">{leads.length}</p>
              <p className="text-xs text-muted-text mt-0.5">{t('sectors.leads')}</p>
            </div>
          </div>
        </div>
      </section>

      {leads.length > 0 && (
        <section className="bg-background border-b border-divider">
          <div className="container-readable py-12">
            <div className="flex items-center gap-2 mb-6">
              <UserCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-ink">{t('sectors.leads')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-surface border border-divider rounded-lg p-5">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-2">
                    {lead.role === 'lead' ? 'Subcommittee Lead' : lead.role === 'co-lead' ? 'Co-Lead' : 'Member'}
                  </p>
                  <p className="font-semibold text-ink text-[17px] leading-tight mb-1">
                    {lead.name}
                  </p>
                  {lead.affiliation && (
                    <p className="text-sm text-muted-text mb-3">{lead.affiliation}</p>
                  )}
                  {lead.bio && (
                    <p className="text-sm text-body-text leading-relaxed mb-4">{lead.bio}</p>
                  )}
                  <div className="flex flex-col gap-1.5 text-xs">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 text-body-text hover:text-primary transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 text-body-text hover:text-primary transition-colors"
                      >
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background border-b border-divider">
        <div className="container-readable py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-semibold text-ink">
              {organizations.length > 0
                ? `${organizations.length} ${organizations.length === 1 ? 'organization' : 'organizations'}`
                : t('sectors.noOrgs')}
            </h2>
          </div>

          {organizations.length === 0 ? (
            <div className="bg-sand border border-divider rounded-xl p-8 text-center max-w-xl">
              <p className="text-sm text-body-text leading-relaxed">
                {t('sectors.noOrgsBody')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/organizations/${org.id}`}
                  className="group bg-surface border border-divider rounded-lg p-5 hover:border-ink/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-ink text-[17px] leading-snug group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                    {org.spanish_available && (
                      <span className="shrink-0 text-[10px] font-semibold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                        ES
                      </span>
                    )}
                  </div>
                  {org.mission && (
                    <p className="text-sm text-body-text leading-relaxed line-clamp-2 mb-3">
                      {locale === 'es' && org.mission_es ? org.mission_es : org.mission}
                    </p>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {needs.length > 0 && (
        <section className="bg-background border-b border-divider">
          <div className="container-readable py-12">
            <h2 className="text-xl font-semibold text-ink mb-6">
              {needs.length} {needs.length === 1 ? 'way to help' : 'ways to help'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {needs.map((need) => (
                <div
                  key={need.id}
                  className="bg-surface border border-divider rounded-lg p-5 flex flex-col"
                >
                  {need.time_commitment && (
                    <p className="text-xs text-muted-text mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {need.time_commitment}
                    </p>
                  )}
                  <h3 className="font-semibold text-ink text-[17px] leading-snug mb-2">
                    {locale === 'es' && need.title_es ? need.title_es : need.title}
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed line-clamp-3 mb-4 flex-1">
                    {locale === 'es' && need.description_es ? need.description_es : need.description}
                  </p>
                  <Link
                    href={`/volunteer/apply?need=${need.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all self-start"
                  >
                    {t('volunteer.apply')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section className="bg-background">
          <div className="container-readable py-12">
            <h2 className="text-xl font-semibold text-ink mb-6">{t('sectors.activities')}</h2>
            <ul className="space-y-3">
              {activities.map((act) => (
                <li
                  key={act.id}
                  className="bg-surface border border-divider rounded-lg p-5 flex flex-col md:flex-row md:items-start gap-4"
                >
                  {act.scheduled_for && (
                    <div className="flex md:flex-col items-baseline md:items-start gap-2 md:gap-0 md:w-32 shrink-0">
                      <p className="text-2xl font-bold text-ink tabular-nums leading-none">
                        {format(new Date(act.scheduled_for), 'd')}
                      </p>
                      <p className="text-xs text-muted-text">
                        {format(new Date(act.scheduled_for), 'MMM yyyy')}
                      </p>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink text-[17px] mb-1">
                      {locale === 'es' && act.title_es ? act.title_es : act.title}
                    </h3>
                    {act.description && (
                      <p className="text-sm text-body-text leading-relaxed">
                        {locale === 'es' && act.description_es ? act.description_es : act.description}
                      </p>
                    )}
                    {act.location && (
                      <p className="text-xs text-muted-text mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {act.location}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Globe, Mail, Clock, Users, ArrowUpRight } from 'lucide-react';
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
      {/* Sector hero */}
      <section
        className="relative border-b border-rule/40"
        style={{ backgroundColor: `${accent}0A` }}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accent }}
        />
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <Link
            href="/sectors"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-text hover:text-ink transition-colors mb-12"
          >
            <ArrowLeft className="h-3 w-3" />
            {t('sectors.backToDirectory')}
          </Link>

          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="sector-numeral text-base text-rule tabular-nums"
                >
                  {meta.numeral} /
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 rounded-sm"
                  style={{ backgroundColor: accent, color: 'var(--color-ivory)' }}
                >
                  {status === 'active' ? t('sectors.active') : status === 'archived' ? t('sectors.archived') : t('sectors.forming')}
                </span>
              </div>
              <h1
                className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em]"
                style={{ color: accent }}
              >
                {name}
              </h1>
              <p className="mt-8 text-base md:text-lg text-body-text leading-[1.7] max-w-xl">
                {description}
              </p>
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9 md:mt-8">
              <dl className="space-y-4 border-t pt-6" style={{ borderColor: `${accent}60` }}>
                <Stat label={t('sectors.orgsCount')} value={organizations.length} />
                <Stat label={t('sectors.volunteerNeedsCount')} value={needs.length} />
                <Stat label={t('sectors.leads')} value={leads.length} />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Subcommittee leads */}
      {leads.length > 0 && (
        <section className="bg-background border-b border-rule/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <SectionHeader
              numeral="A"
              accent={accent}
              overline={t('sectors.leads')}
              title={t('sectors.leads')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-card border-l-2 p-6 hover:border-l-4 transition-all"
                  style={{ borderLeftColor: accent }}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-2">
                    {lead.role === 'lead' ? 'Subcommittee Lead' : lead.role === 'co-lead' ? 'Co-Lead' : 'Member'}
                  </p>
                  <p className="font-display text-xl text-ink leading-tight mb-1">
                    {lead.name}
                  </p>
                  {lead.affiliation && (
                    <p className="text-sm text-muted-text italic mb-3">{lead.affiliation}</p>
                  )}
                  {lead.bio && (
                    <p className="text-sm text-body-text leading-relaxed mb-4">{lead.bio}</p>
                  )}
                  <div className="flex flex-col gap-1 text-xs">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 text-muted-text hover:text-ink transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-2 text-muted-text hover:text-ink transition-colors"
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

      {/* Organizations */}
      <section className="bg-background border-b border-rule/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeader
            numeral="B"
            accent={accent}
            overline="Directory"
            title={organizations.length > 0 ? `${organizations.length} organizations` : t('sectors.noOrgs')}
          />

          {organizations.length === 0 ? (
            <div className="border border-dashed border-rule rounded-sm p-10 text-center max-w-xl mx-auto">
              <p className="text-sm text-muted-text leading-relaxed">
                {t('sectors.noOrgsBody')}
              </p>
            </div>
          ) : (
            <ol className="border-t border-rule/40">
              {organizations.map((org, idx) => (
                <li key={org.id} className="border-b border-rule/40 group">
                  <Link
                    href={`/organizations/${org.id}`}
                    className="grid grid-cols-12 gap-4 items-baseline py-6 transition-colors"
                  >
                    <span className="col-span-2 md:col-span-1 sector-numeral text-xs text-rule tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="col-span-10 md:col-span-5">
                      <h3 className="font-display text-xl md:text-2xl text-ink leading-tight group-hover:italic transition-all">
                        {org.name}
                      </h3>
                      {org.mission && (
                        <p className="text-sm text-muted-text mt-1 italic">
                          {locale === 'es' && org.mission_es ? org.mission_es : org.mission}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm text-body-text">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rule" />
                        {org.town}
                      </p>
                      {org.phone && (
                        <p className="flex items-center gap-1.5 mt-1 text-muted-text">
                          <Phone className="h-3.5 w-3.5 text-rule" />
                          {org.phone}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-2 md:text-right flex items-center justify-between md:justify-end gap-3">
                      {org.spanish_available && (
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-text border border-rule/60 rounded-sm px-1.5 py-0.5">
                          ES
                        </span>
                      )}
                      <ArrowUpRight
                        className="h-4 w-4 text-rule transition-transform group-hover:rotate-45"
                        style={{ color: accent }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Volunteer needs */}
      {needs.length > 0 && (
        <section className="bg-ivory-deep/40 border-b border-rule/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <SectionHeader
              numeral="C"
              accent={accent}
              overline="Volunteer"
              title={`${needs.length} ways to help`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {needs.map((need) => (
                <div
                  key={need.id}
                  className="bg-card p-6 border-l-2 hover:border-l-4 transition-all"
                  style={{ borderLeftColor: accent }}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-3">
                    {t('volunteer.timeCommitment')} · {need.time_commitment ?? '—'}
                  </p>
                  <h3 className="font-display text-lg md:text-xl text-ink mb-3 leading-tight">
                    {locale === 'es' && need.title_es ? need.title_es : need.title}
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed line-clamp-3 mb-4">
                    {locale === 'es' && need.description_es ? need.description_es : need.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-rule/40">
                    {need.needed_date && (
                      <p className="text-xs text-muted-text flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {format(new Date(need.needed_date), 'MMM d, yyyy')}
                      </p>
                    )}
                    <Link
                      href={`/volunteer/apply?need=${need.id}`}
                      className="text-xs font-medium inline-flex items-center gap-1 hover:underline"
                      style={{ color: accent }}
                    >
                      {t('volunteer.apply')}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activities */}
      {activities.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <SectionHeader
              numeral="D"
              accent={accent}
              overline="Next"
              title={t('sectors.activities')}
            />
            <ul className="border-t border-rule/40">
              {activities.map((act) => (
                <li
                  key={act.id}
                  className="grid grid-cols-12 gap-4 py-6 border-b border-rule/40 items-baseline"
                >
                  <div className="col-span-12 md:col-span-2">
                    {act.scheduled_for ? (
                      <div>
                        <p className="font-display text-3xl text-ink leading-none tabular-nums">
                          {format(new Date(act.scheduled_for), 'd')}
                        </p>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-text mt-1">
                          {format(new Date(act.scheduled_for), 'MMM yyyy')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-text">TBD</p>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <h4 className="font-display text-xl text-ink mb-1">
                      {locale === 'es' && act.title_es ? act.title_es : act.title}
                    </h4>
                    {act.description && (
                      <p className="text-sm text-body-text leading-relaxed">
                        {locale === 'es' && act.description_es ? act.description_es : act.description}
                      </p>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-2 md:text-right">
                    {act.location && (
                      <p className="text-xs text-muted-text flex items-center gap-1 md:justify-end">
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-muted-text tracking-wide">{label}</dt>
      <dd className="font-display text-2xl text-ink tabular-nums leading-none">
        {value}
      </dd>
    </div>
  );
}

function SectionHeader({
  numeral,
  accent,
  overline,
  title,
}: {
  numeral: string;
  accent: string;
  overline: string;
  title: string;
}) {
  return (
    <div className="flex items-baseline gap-4 mb-10">
      <span
        className="sector-numeral text-xl"
        style={{ color: accent }}
      >
        {numeral}.
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-1">
          {overline}
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

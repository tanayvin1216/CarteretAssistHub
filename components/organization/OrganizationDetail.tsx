'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MapPin, Phone, Globe, Mail, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import type { Organization, VolunteerNeed } from '@/types/database';
import { SECTORS, sectorBySlug } from '@/lib/sectors';

interface Props {
  org: Organization;
  needs: VolunteerNeed[];
}

const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABEL_EN: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};
const DAY_LABEL_ES: Record<string, string> = {
  monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
  thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo',
};

export function OrganizationDetail({ org, needs }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  const primarySector = org.sector_slug ? sectorBySlug(org.sector_slug) : null;
  const accent = primarySector?.accentHex ?? '#1E3A5F';
  const mission = locale === 'es' && org.mission_es ? org.mission_es : org.mission;
  const dayLabels = locale === 'es' ? DAY_LABEL_ES : DAY_LABEL_EN;

  return (
    <div>
      <section
        className="border-b border-rule/40"
        style={{ backgroundColor: `${accent}08` }}
      >
        <div
          aria-hidden
          className="h-1 w-full"
          style={{ backgroundColor: accent }}
        />
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <Link
            href={primarySector ? `/sectors/${primarySector.slug}` : '/sectors'}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-text hover:text-ink transition-colors mb-10"
          >
            <ArrowLeft className="h-3 w-3" />
            {primarySector ? primarySector.name : t('sectors.backToDirectory')}
          </Link>

          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-8">
              {primarySector && (
                <p className="text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: accent }}>
                  {primarySector.numeral} · {primarySector.name}
                </p>
              )}
              <h1 className="font-display text-4xl md:text-6xl leading-[0.98] tracking-[-0.02em] text-ink">
                {org.name}
              </h1>
              {mission && (
                <p className="mt-6 text-base md:text-lg text-body-text leading-[1.65] italic max-w-2xl">
                  “{mission}”
                </p>
              )}
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9 md:mt-4">
              <div className="bg-card border-l-2 p-5 space-y-3" style={{ borderLeftColor: accent }}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text">
                  {t('org.phone')} / {t('org.website')}
                </p>
                <div className="space-y-2.5 text-sm">
                  <a href={`tel:${org.phone}`} className="flex items-center gap-2 text-ink hover:underline">
                    <Phone className="h-3.5 w-3.5 text-rule" />
                    {org.phone}
                  </a>
                  {org.email && (
                    <a href={`mailto:${org.email}`} className="flex items-center gap-2 text-ink hover:underline">
                      <Mail className="h-3.5 w-3.5 text-rule" />
                      {org.email}
                    </a>
                  )}
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-ink hover:underline break-all"
                    >
                      <Globe className="h-3.5 w-3.5 text-rule" />
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <div className="pt-2 text-sm text-body-text flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-rule mt-1 shrink-0" />
                  <span>
                    {org.address}
                    <br />
                    {org.town}, NC {org.zip}
                  </span>
                </div>
                {org.spanish_available && (
                  <p className="text-[11px] uppercase tracking-[0.18em] inline-flex items-center gap-1 pt-1" style={{ color: accent }}>
                    <Check className="h-3 w-3" /> {t('org.spanishAvailable')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            {(org.assistance_types?.length ?? 0) > 0 && (
              <div className="mb-10">
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-4">
                  {t('org.services')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {org.assistance_types.map((svc) => (
                    <span
                      key={svc}
                      className="text-xs px-3 py-1.5 border border-rule/60 rounded-sm bg-card text-body-text"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(org.who_served?.length ?? 0) > 0 && (
              <div className="mb-10">
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-4">
                  {t('org.whoServed')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(org.who_served ?? []).map((w) => (
                    <span
                      key={w}
                      className="text-xs px-3 py-1.5 border border-rule/60 rounded-sm bg-card text-body-text"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {org.comments && (
              <div className="mb-10">
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-4">
                  Notes
                </h2>
                <p className="text-sm text-body-text leading-[1.75] whitespace-pre-line">
                  {org.comments}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-5">
            {org.operating_hours && Object.keys(org.operating_hours).length > 0 && (
              <div className="bg-card border border-rule/40 rounded-sm p-6">
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-4 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> {t('org.hours')}
                </h2>
                <dl className="space-y-2 text-sm">
                  {DAYS_EN.map((day) => {
                    const h = (org.operating_hours as Record<string, { open: string; close: string; closed?: boolean }> | null)?.[day];
                    return (
                      <div key={day} className="flex justify-between items-baseline border-b border-rule/30 pb-1.5">
                        <dt className="text-body-text capitalize">{dayLabels[day]}</dt>
                        <dd className="font-mono text-xs text-muted-text">
                          {!h || h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                {org.hours_notes && (
                  <p className="text-xs text-muted-text italic mt-4 pt-3 border-t border-rule/30">
                    {org.hours_notes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {needs.length > 0 && (
        <section className="bg-ivory-deep/40 border-t border-rule/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
              {t('org.activeNeeds')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {needs.map((need) => (
                <div
                  key={need.id}
                  className="bg-card p-6 border-l-2 hover:border-l-4 transition-all"
                  style={{ borderLeftColor: accent }}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-3">
                    {t('volunteer.timeCommitment')}: {need.time_commitment ?? '—'}
                  </p>
                  <h3 className="font-display text-xl text-ink leading-tight mb-3">
                    {locale === 'es' && need.title_es ? need.title_es : need.title}
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed line-clamp-3 mb-4">
                    {locale === 'es' && need.description_es ? need.description_es : need.description}
                  </p>
                  <Link
                    href={`/volunteer/apply?need=${need.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium border-b pb-0.5"
                    style={{ color: accent, borderColor: accent }}
                  >
                    {t('volunteer.apply')}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

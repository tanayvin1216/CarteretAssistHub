'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin, Phone, Globe, Mail, Clock, Check } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import type { Organization, VolunteerNeed } from '@/types/database';
import { sectorBySlug } from '@/lib/sectors';

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
  const mission = locale === 'es' && org.mission_es ? org.mission_es : org.mission;
  const dayLabels = locale === 'es' ? DAY_LABEL_ES : DAY_LABEL_EN;

  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-10 md:py-14">
          <Link
            href={primarySector ? `/sectors/${primarySector.slug}` : '/sectors'}
            className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {primarySector ? primarySector.name : t('sectors.backToDirectory')}
          </Link>

          {primarySector && (
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: primarySector.accentHex }}
              />
              <span className="text-xs text-muted-text">{primarySector.name}</span>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            {org.name}
          </h1>
          {mission && (
            <p className="text-base md:text-lg text-body-text leading-relaxed italic max-w-2xl">
              &ldquo;{mission}&rdquo;
            </p>
          )}
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2 space-y-8">
            {(org.assistance_types?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">
                  {t('org.services')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {org.assistance_types.map((svc) => (
                    <span
                      key={svc}
                      className="text-sm px-3 py-1.5 bg-sand border border-divider rounded-full text-body-text"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(org.who_served?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">
                  {t('org.whoServed')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(org.who_served ?? []).map((w) => (
                    <span
                      key={w}
                      className="text-sm px-3 py-1.5 bg-sand border border-divider rounded-full text-body-text"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {org.comments && (
              <div>
                <h2 className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">
                  Notes
                </h2>
                <p className="text-[15px] text-body-text leading-relaxed whitespace-pre-line">
                  {org.comments}
                </p>
              </div>
            )}
          </div>

          <aside className="md:col-span-1 space-y-5">
            <div className="bg-surface border border-divider rounded-xl p-5">
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wide mb-4">
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                {org.phone && (
                  <a href={`tel:${org.phone}`} className="flex items-start gap-2.5 text-body-text hover:text-primary">
                    <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{org.phone}</span>
                  </a>
                )}
                {org.email && (
                  <a href={`mailto:${org.email}`} className="flex items-start gap-2.5 text-body-text hover:text-primary break-all">
                    <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{org.email}</span>
                  </a>
                )}
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2.5 text-body-text hover:text-primary break-all"
                  >
                    <Globe className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{org.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                <div className="flex items-start gap-2.5 text-body-text pt-3 mt-3 border-t border-divider">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    {org.address}
                    <br />
                    {org.town}, NC {org.zip}
                  </span>
                </div>
                {org.spanish_available && (
                  <p className="flex items-center gap-1.5 pt-3 border-t border-divider text-primary-600 font-semibold text-xs">
                    <Check className="h-3.5 w-3.5" /> {t('org.spanishAvailable')}
                  </p>
                )}
              </div>
            </div>

            {org.operating_hours && Object.keys(org.operating_hours).length > 0 && (
              <div className="bg-surface border border-divider rounded-xl p-5">
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wide mb-4 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {t('org.hours')}
                </h3>
                <dl className="space-y-1.5 text-sm">
                  {DAYS_EN.map((day) => {
                    const h = (org.operating_hours as Record<string, { open: string; close: string; closed?: boolean }> | null)?.[day];
                    return (
                      <div key={day} className="flex justify-between items-baseline">
                        <dt className="text-body-text">{dayLabels[day]}</dt>
                        <dd className="font-mono text-xs text-muted-text">
                          {!h || h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                {org.hours_notes && (
                  <p className="text-xs text-muted-text italic mt-4 pt-3 border-t border-divider">
                    {org.hours_notes}
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      {needs.length > 0 && (
        <section className="bg-sand border-t border-divider">
          <div className="container-readable py-12">
            <h2 className="text-xl font-semibold text-ink mb-6">{t('org.activeNeeds')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}

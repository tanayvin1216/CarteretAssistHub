'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Check, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { sectorBySlug } from '@/lib/sectors';
import type { Organization } from '@/types/database';

const DAYS = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
] as const;

type DayHours = { open: string; close: string; closed?: boolean };
type HoursMap = Record<string, DayHours>;

const FIELD =
  'w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink';

interface Draft {
  name: string;
  address: string;
  town: string;
  zip: string;
  contact_name: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  mission: string;
  mission_es: string;
  cost: string;
  hours_notes: string;
  assistance_types: string[];
  who_served: string[];
  spanish_available: boolean;
  is_active: boolean;
  operating_hours: HoursMap;
}

function toDraft(org: Organization): Draft {
  return {
    name: org.name ?? '',
    address: org.address ?? '',
    town: org.town ?? '',
    zip: org.zip ?? '',
    contact_name: org.contact_name ?? '',
    phone: org.phone ?? '',
    email: org.email ?? '',
    website: org.website ?? '',
    facebook: org.facebook ?? '',
    mission: org.mission ?? '',
    mission_es: org.mission_es ?? '',
    cost: org.cost ?? '',
    hours_notes: org.hours_notes ?? '',
    assistance_types: org.assistance_types ?? [],
    who_served: org.who_served ?? [],
    spanish_available: org.spanish_available ?? false,
    is_active: org.is_active ?? true,
    operating_hours: (org.operating_hours as HoursMap | null) ?? {},
  };
}

export function OrgListingForm({ organization }: { organization: Organization }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(organization));
  const [saving, setSaving] = useState(false);
  const sector = organization.sector_slug ? sectorBySlug(organization.sector_slug) : null;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((cur) => ({ ...cur, [key]: value }));

  const setDay = (day: string, patch: Partial<DayHours>) =>
    setDraft((cur) => {
      const base: DayHours = cur.operating_hours[day] ?? { open: '', close: '' };
      return {
        ...cur,
        operating_hours: { ...cur.operating_hours, [day]: { ...base, ...patch } },
      };
    });

  const clearDay = (day: string) =>
    setDraft((cur) => {
      const next = { ...cur.operating_hours };
      delete next[day];
      return { ...cur, operating_hours: next };
    });

  const onSave = async () => {
    if (!draft.name.trim()) {
      toast.error('Your organization needs a name.');
      return;
    }
    setSaving(true);

    // Only the columns an organization owns are sent. Sector, featured
    // placement, and display order are the committee's and are pinned by a
    // trigger on the database side too (migration 007) — this is the polite
    // half of that rule.
    const payload = {
      name: draft.name.trim(),
      address: draft.address.trim(),
      town: draft.town.trim(),
      zip: draft.zip.trim(),
      contact_name: draft.contact_name.trim() || null,
      phone: draft.phone.trim(),
      email: draft.email.trim() || null,
      website: draft.website.trim() || null,
      facebook: draft.facebook.trim() || null,
      mission: draft.mission.trim() || null,
      mission_es: draft.mission_es.trim() || null,
      cost: draft.cost.trim(),
      hours_notes: draft.hours_notes.trim() || null,
      assistance_types: draft.assistance_types,
      who_served: draft.who_served,
      spanish_available: draft.spanish_available,
      is_active: draft.is_active,
      operating_hours: Object.keys(draft.operating_hours).length ? draft.operating_hours : null,
      last_updated: new Date().toISOString(),
    };

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder = supabase.from('organizations') as any;
    const { error } = await builder.update(payload).eq('id', organization.id);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Saved. Your listing is updated.');
  };

  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· Manage</p>
          <h1 className="text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight">
            Our listing
          </h1>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 h-10 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-10 text-xs text-muted-text">
        {sector && (
          <span>
            Sector:{' '}
            <span style={{ color: sector.accentHex }} className="font-semibold">
              {sector.name}
            </span>{' '}
            — set by the committee
          </span>
        )}
        <Link
          href={`/organizations/${organization.id}`}
          className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline underline-offset-4"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          See how this looks to the public
        </Link>
      </div>

      <div className="space-y-10">
        <Section title="Who you are">
          <Field label="Organization name">
            <input value={draft.name} onChange={(e) => set('name', e.target.value)} className={FIELD} />
          </Field>
          <Field label="What you do" hint="One or two sentences. This is the first thing people read.">
            <textarea
              value={draft.mission}
              onChange={(e) => set('mission', e.target.value)}
              rows={3}
              className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed"
            />
          </Field>
          <Field label="What you do — in Spanish" hint="Optional. Left blank, Spanish readers see the English.">
            <textarea
              value={draft.mission_es}
              onChange={(e) => set('mission_es', e.target.value)}
              rows={3}
              className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed"
            />
          </Field>
        </Section>

        <Section title="Where to find you">
          <Field label="Street address">
            <input value={draft.address} onChange={(e) => set('address', e.target.value)} className={FIELD} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Town">
              <input value={draft.town} onChange={(e) => set('town', e.target.value)} className={FIELD} />
            </Field>
            <Field label="Zip">
              <input value={draft.zip} onChange={(e) => set('zip', e.target.value)} className={FIELD} />
            </Field>
          </div>
        </Section>

        <Section title="How to reach you">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <input value={draft.phone} onChange={(e) => set('phone', e.target.value)} className={FIELD} />
            </Field>
            <Field label="Email">
              <input value={draft.email} onChange={(e) => set('email', e.target.value)} className={FIELD} />
            </Field>
          </div>
          <Field label="Contact person" hint="Optional — who to ask for.">
            <input
              value={draft.contact_name}
              onChange={(e) => set('contact_name', e.target.value)}
              className={FIELD}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Website">
              <input
                value={draft.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://…"
                className={FIELD}
              />
            </Field>
            <Field label="Facebook">
              <input
                value={draft.facebook}
                onChange={(e) => set('facebook', e.target.value)}
                placeholder="https://facebook.com/…"
                className={FIELD}
              />
            </Field>
          </div>
        </Section>

        <Section title="When you're open">
          <div className="border border-divider rounded-sm overflow-hidden">
            {DAYS.map(([key, label]) => {
              const value = draft.operating_hours[key];
              const closed = !!value?.closed;
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-3 px-4 py-2.5 border-b border-divider last:border-b-0"
                >
                  <span className="w-24 text-sm text-ink">{label}</span>
                  {value ? (
                    <>
                      <label className="flex items-center gap-1.5 text-xs text-muted-text">
                        <input
                          type="checkbox"
                          checked={closed}
                          onChange={(e) => setDay(key, { closed: e.target.checked })}
                        />
                        Closed
                      </label>
                      {!closed && (
                        <>
                          <input
                            type="time"
                            value={value.open ?? ''}
                            onChange={(e) => setDay(key, { open: e.target.value })}
                            className="h-9 px-2 bg-card border border-divider rounded-sm text-sm"
                          />
                          <span className="text-xs text-muted-text">to</span>
                          <input
                            type="time"
                            value={value.close ?? ''}
                            onChange={(e) => setDay(key, { close: e.target.value })}
                            className="h-9 px-2 bg-card border border-divider rounded-sm text-sm"
                          />
                        </>
                      )}
                      <button
                        onClick={() => clearDay(key)}
                        className="ml-auto text-xs text-muted-text hover:text-destructive transition-colors"
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDay(key, { open: '09:00', close: '17:00' })}
                      className="text-xs text-primary font-semibold hover:underline underline-offset-4"
                    >
                      Set hours
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <Field
            label="Anything else about your hours"
            hint="Seasonal closures, appointment-only, third Saturday of the month — whatever the grid can't say."
          >
            <textarea
              value={draft.hours_notes}
              onChange={(e) => set('hours_notes', e.target.value)}
              rows={2}
              className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed"
            />
          </Field>
        </Section>

        <Section title="What you offer">
          <Field label="Services (comma-separated)" hint="e.g. Food pantry, Utility assistance, Case management">
            <input
              value={draft.assistance_types.join(', ')}
              onChange={(e) => set('assistance_types', splitList(e.target.value))}
              className={FIELD}
            />
          </Field>
          <Field label="Who you serve (comma-separated)" hint="e.g. Families with children, Veterans, Seniors 60+">
            <input
              value={draft.who_served.join(', ')}
              onChange={(e) => set('who_served', splitList(e.target.value))}
              className={FIELD}
            />
          </Field>
          <Field label="Cost" hint="Free, sliding scale, insurance accepted — whatever people need to know before they come.">
            <input value={draft.cost} onChange={(e) => set('cost', e.target.value)} className={FIELD} />
          </Field>
        </Section>

        <Section title="Visibility">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.spanish_available}
              onChange={(e) => set('spanish_available', e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-ink">Spanish-language services available</span>
              <span className="block text-xs text-muted-text mt-0.5">
                Residents can filter the directory by this.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) => set('is_active', e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-ink">Show our listing in the public directory</span>
              <span className="block text-xs text-muted-text mt-0.5">
                Uncheck to hide it temporarily — while you are between locations, say. You keep
                access here either way.
              </span>
            </span>
          </label>
        </Section>
      </div>

      <div className="mt-10 pt-6 border-t border-divider flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 h-11 px-6 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-50 shadow-sm"
        >
          <Check className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4 pb-2 border-b border-divider">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-text">{hint}</p>}
    </div>
  );
}

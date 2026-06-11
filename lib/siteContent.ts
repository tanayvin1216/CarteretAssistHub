import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale, MessageKey } from '@/lib/i18n/dictionary';
import type { MessageOverrides } from '@/contexts/LocaleContext';

/** Raw site settings (not locale copy) — hero image, sister-site URL, etc.
 *  Defined here (a server-safe module) so the root layout can read the
 *  defaults; the client context re-exports them. */
export interface SiteSettings {
  heroImageUrl: string;
  sisterSiteUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroImageUrl: '/carteret.avif',
  sisterSiteUrl: 'https://www.carteretfoodandhealthcouncil.org/',
};

export interface SiteContentRow {
  key: string;
  value_en: string | null;
  value_es: string | null;
}

/** Raw-setting keys (not locale copy). Stored in value_en. */
export const SETTING_KEYS = {
  heroImage: 'settings.hero_image_url',
  sisterUrl: 'settings.sister_site_url',
} as const;

/**
 * Curated copy the admin Content editor can override. Each is a real i18n
 * MessageKey, so an override transparently replaces the dictionary default at
 * every `t(key)` call site. Grouped for editor display.
 */
export const EDITABLE_COPY: Array<{
  group: string;
  fields: Array<{ key: MessageKey; label: string; multiline?: boolean }>;
}> = [
  {
    group: 'Homepage hero',
    fields: [
      { key: 'hero.kicker', label: 'Kicker' },
      { key: 'hero.headline', label: 'Headline', multiline: true },
      { key: 'hero.lede', label: 'Lede', multiline: true },
      { key: 'hero.ctaHelp', label: 'Primary button' },
      { key: 'hero.ctaVolunteer', label: 'Secondary button' },
    ],
  },
  {
    group: 'Homepage — sectors section',
    fields: [
      { key: 'sectors.sectionTitle', label: 'Title' },
      { key: 'sectors.sectionLede', label: 'Lede', multiline: true },
    ],
  },
  {
    group: 'Get Help page',
    fields: [
      { key: 'getHelp.title', label: 'Title' },
      { key: 'getHelp.lede', label: 'Lede', multiline: true },
    ],
  },
  {
    group: 'Volunteer page',
    fields: [
      { key: 'volunteer.title', label: 'Title' },
      { key: 'volunteer.lede', label: 'Lede', multiline: true },
    ],
  },
  {
    group: 'About page',
    fields: [
      { key: 'about.eyebrow', label: 'Eyebrow' },
      { key: 'about.title', label: 'Title' },
      { key: 'about.lede', label: 'Lede', multiline: true },
    ],
  },
  {
    group: 'Allies page',
    fields: [
      { key: 'allies.eyebrow', label: 'Eyebrow' },
      { key: 'allies.title', label: 'Title' },
      { key: 'allies.lede', label: 'Lede', multiline: true },
    ],
  },
];

export async function getSiteContent(
  supabase: SupabaseClient,
): Promise<SiteContentRow[]> {
  // site_content isn't in the generated Database type yet.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('site_content')
    .select('key, value_en, value_es');
  if (error) {
    console.error('getSiteContent error', error);
    return [];
  }
  return (data ?? []) as SiteContentRow[];
}

/** Build the locale→key→text override map consumed by LocaleProvider. */
export function buildOverrides(rows: SiteContentRow[]): MessageOverrides {
  const en: Record<string, string> = {};
  const es: Record<string, string> = {};
  for (const row of rows) {
    if (row.key.startsWith('settings.')) continue;
    if (row.value_en && row.value_en.trim()) en[row.key] = row.value_en;
    if (row.value_es && row.value_es.trim()) es[row.key] = row.value_es;
  }
  return { en, es };
}

/** Build raw settings (hero image, sister URL) with sane defaults. */
export function buildSettings(rows: SiteContentRow[]): SiteSettings {
  const map = new Map(rows.map((r) => [r.key, r.value_en ?? '']));
  const heroImageUrl = map.get(SETTING_KEYS.heroImage);
  const sisterSiteUrl = map.get(SETTING_KEYS.sisterUrl);
  return {
    heroImageUrl: heroImageUrl && heroImageUrl.trim() ? heroImageUrl : DEFAULT_SETTINGS.heroImageUrl,
    sisterSiteUrl: sisterSiteUrl && sisterSiteUrl.trim() ? sisterSiteUrl : DEFAULT_SETTINGS.sisterSiteUrl,
  };
}

export type { Locale };

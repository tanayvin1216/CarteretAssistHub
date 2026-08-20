/**
 * Pure helpers for the Resource Directory.
 *
 * These live outside the component so they can be unit-tested without a DOM,
 * and so the rendering code stays about layout rather than string wrangling.
 */

/** Prefer the Spanish edition's wording when reading in Spanish, English otherwise. */
export function localized(en: string | null, es: string | null, locale: string): string {
  const preferred = locale === 'es' ? es : en;
  return (preferred ?? en ?? es ?? '').trim();
}

/**
 * Normalise text for search: strip accents and punctuation so a search for
 * "jose" finds "José" and "marthas" finds "Martha's".
 *
 * Apostrophes are deleted rather than turned into a space — nobody types the
 * apostrophe in "Martha's", and splitting it into "martha s" would make the
 * obvious query miss. Every other separator becomes a space so that words
 * still have boundaries.
 */
export function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['\u2018\u2019\u02bc"\u201c\u201d]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface PhoneLink {
  /** Exactly as the booklet prints it, e.g. "252-355-2345 Ext. 8610". */
  label: string;
  /** A dialable tel: URI. */
  href: string;
}

const PHONE_PART = /(?:1-)?\d{3}-\d{3}-\d{4}/;
const EXTENSION = /(?:Ext\.?|ext\.?|x)\s*(\d+)/i;

/**
 * Turn a booklet phone value into one dialable link per number.
 *
 * The value is usually a single number, but a few entries carry an extension
 * ("252-355-2345 Ext. 8610") or list an alternate ("919-419-1059 or
 * 1-833-408-7672"). Naively stripping non-digits welds those into one
 * unreachable 14- or 22-digit number, so the extension goes in tel:'s own
 * `;ext=` parameter and alternates become separate links.
 */
export function phoneLinks(phone: string | null): PhoneLink[] {
  if (!phone) return [];
  return phone
    .split(/\s+or\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((label) => {
      const number = label.match(PHONE_PART)?.[0] ?? label;
      const digits = number.replace(/[^\d+]/g, '');
      const ext = label.match(EXTENSION)?.[1];
      return { label, href: `tel:${digits}${ext ? `;ext=${ext}` : ''}` };
    })
    .filter((link) => /\d/.test(link.href));
}

/** The booklet breaks some notes across lines; `|` marks that break. */
export function noteLines(notes: string): string[] {
  return notes
    .split('|')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * The printed county directory — every active organization, grouped by sector,
 * typeset as a paginated PDF.
 *
 * Built with pdf-lib and the PDF standard fonts rather than a headless browser:
 * it runs anywhere a Node function runs (including Vercel's serverless
 * runtime), embeds no binaries, and produces the same file every time. The
 * cost is that pagination and text flow are ours to do, which is what the
 * cursor in `Doc` below is for.
 */
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from 'pdf-lib';
import { SECTORS, type SectorMeta } from '@/lib/sectors';
import type { Organization } from '@/types/database';

// ── Page geometry (US Letter, 0.75in margins) ──────────────────────────────
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 56;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const INK = rgb(0.09, 0.11, 0.13);
const BODY = rgb(0.27, 0.29, 0.32);
const MUTED = rgb(0.49, 0.51, 0.55);
const RULE = rgb(0.85, 0.86, 0.88);
const SAND = rgb(0.97, 0.96, 0.94);

export type DirectoryLocale = 'en' | 'es';

const LABELS = {
  en: {
    title: 'Carteret Assist Hub',
    subtitle: 'Community Resource Directory',
    county: 'Carteret County, North Carolina',
    compiled: 'Compiled by the Carteret County Community Service Committee',
    generated: 'Generated',
    contents: 'Contents',
    sector: 'Sector',
    page: 'Page',
    listings: 'listings',
    listing: 'listing',
    orgCount: (n: number) => `${n} ${n === 1 ? 'organization' : 'organizations'}`,
    phone: 'Phone',
    email: 'Email',
    web: 'Web',
    hours: 'Hours',
    cost: 'Cost',
    serves: 'Serves',
    services: 'Services',
    spanish: 'Spanish spoken',
    noListings: 'No listings in this sector yet.',
    footer: 'Carteret Assist Hub · carteret-assist-hub.vercel.app',
    coverNote:
      'Every organization in this directory is listed online, where the details are kept current. If something here is wrong or out of date, tell us at carteret-assist-hub.vercel.app/report and we will fix it.',
    closingTitle: 'Keeping this directory accurate',
    closingBody:
      'This booklet is a snapshot. Programs open, close, and change their hours faster than any printed page can follow. The live directory is the authority, and it is free to search from any phone.',
    updated: 'Updated',
  },
  es: {
    title: 'Carteret Assist Hub',
    subtitle: 'Directorio de Recursos Comunitarios',
    county: 'Condado de Carteret, Carolina del Norte',
    compiled: 'Compilado por el Comité de Servicio Comunitario del Condado de Carteret',
    generated: 'Generado',
    contents: 'Contenido',
    sector: 'Sector',
    page: 'Página',
    listings: 'listados',
    listing: 'listado',
    orgCount: (n: number) => `${n} ${n === 1 ? 'organización' : 'organizaciones'}`,
    phone: 'Teléfono',
    email: 'Correo',
    web: 'Sitio web',
    hours: 'Horario',
    cost: 'Costo',
    serves: 'Atiende a',
    services: 'Servicios',
    spanish: 'Se habla español',
    noListings: 'Aún no hay listados en este sector.',
    footer: 'Carteret Assist Hub · carteret-assist-hub.vercel.app',
    coverNote:
      'Cada organización de este directorio aparece en línea, donde los datos se mantienen al día. Si algo aquí está incorrecto o desactualizado, avísenos en carteret-assist-hub.vercel.app/report y lo corregiremos.',
    closingTitle: 'Cómo mantener este directorio al día',
    closingBody:
      'Este folleto es una instantánea. Los programas abren, cierran y cambian de horario más rápido de lo que una página impresa puede seguir. El directorio en línea es la fuente oficial y se puede consultar gratis desde cualquier teléfono.',
    updated: 'Actualizado',
  },
} as const;

const DAY_LABELS: Record<DirectoryLocale, Record<string, string>> = {
  en: {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
  },
  es: {
    monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié', thursday: 'Jue',
    friday: 'Vie', saturday: 'Sáb', sunday: 'Dom',
  },
};
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// ── Text encoding ──────────────────────────────────────────────────────────
// The standard fonts encode WinAnsi. Accented Spanish characters are covered;
// anything outside it (arrows, ticks, CJK) would throw at draw time, so it is
// mapped or dropped here instead of taking the whole document down.
const REPLACEMENTS: Record<string, string> = {
  '→': '->', '←': '<-', '✓': '*', '✔': '*',
  '≥': '>=', '≤': '<=', ' ': ' ', '\t': ' ',
  '′': "'", '″': '"',
};
const WINANSI_EXTRA = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030,
  0x0160, 0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022,
  0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
]);

function sanitize(input: string | null | undefined): string {
  if (!input) return '';
  let out = '';
  for (const ch of input) {
    if (REPLACEMENTS[ch] !== undefined) {
      out += REPLACEMENTS[ch];
      continue;
    }
    const cp = ch.codePointAt(0)!;
    if (cp === 10) out += '\n';
    else if (cp < 32 || (cp >= 0x7f && cp <= 0x9f)) out += ' ';
    else if (cp <= 0xff) out += ch;
    else if (WINANSI_EXTRA.has(cp)) out += ch;
  }
  return out;
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

// ── Layout engine ──────────────────────────────────────────────────────────
interface TextOpts {
  font?: PDFFont;
  size?: number;
  color?: RGB;
  indent?: number;
  leading?: number;
  gapAfter?: number;
  width?: number;
}

class Doc {
  readonly pdf: PDFDocument;
  readonly regular: PDFFont;
  readonly bold: PDFFont;
  readonly italic: PDFFont;
  pages: PDFPage[] = [];
  page!: PDFPage;
  y = 0;

  constructor(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, italic: PDFFont) {
    this.pdf = pdf;
    this.regular = regular;
    this.bold = bold;
    this.italic = italic;
  }

  newPage(): PDFPage {
    const page = this.pdf.addPage([PAGE_W, PAGE_H]);
    this.pages.push(page);
    this.page = page;
    this.y = PAGE_H - MARGIN_TOP;
    return page;
  }

  /** Index of the page currently being written, 0-based within the body. */
  get pageIndex(): number {
    return this.pages.length - 1;
  }

  /** Start a new page if `height` more points will not fit above the margin. */
  ensure(height: number) {
    if (this.y - height < MARGIN_BOTTOM) this.newPage();
  }

  wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const lines: string[] = [];
    for (const paragraph of sanitize(text).split('\n')) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        lines.push('');
        continue;
      }
      let line = '';
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          line = candidate;
        } else {
          if (line) lines.push(line);
          // A single word wider than the column (a long URL) is hard-split so
          // it never bleeds into the margin.
          if (font.widthOfTextAtSize(word, size) > maxWidth) {
            let chunk = '';
            for (const ch of word) {
              if (font.widthOfTextAtSize(chunk + ch, size) > maxWidth) {
                lines.push(chunk);
                chunk = ch;
              } else {
                chunk += ch;
              }
            }
            line = chunk;
          } else {
            line = word;
          }
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  text(value: string, opts: TextOpts = {}) {
    const font = opts.font ?? this.regular;
    const size = opts.size ?? 9.5;
    const color = opts.color ?? BODY;
    const indent = opts.indent ?? 0;
    const leading = opts.leading ?? size * 1.38;
    const width = opts.width ?? CONTENT_W - indent;

    for (const line of this.wrap(value, font, size, width)) {
      this.ensure(leading);
      this.y -= leading;
      if (line) {
        this.page.drawText(line, {
          x: MARGIN_X + indent,
          y: this.y,
          size,
          font,
          color,
        });
      }
    }
    if (opts.gapAfter) this.y -= opts.gapAfter;
  }

  rule(color: RGB = RULE, thickness = 0.5, gapBefore = 6, gapAfter = 8) {
    this.ensure(gapBefore + gapAfter + thickness);
    this.y -= gapBefore;
    this.page.drawRectangle({
      x: MARGIN_X,
      y: this.y,
      width: CONTENT_W,
      height: thickness,
      color,
    });
    this.y -= gapAfter;
  }
}

// ── Content helpers ────────────────────────────────────────────────────────
function formatHours(org: Organization, locale: DirectoryLocale): string | null {
  const parts: string[] = [];
  const hours = org.operating_hours;
  if (hours && typeof hours === 'object') {
    const days = DAY_ORDER.filter((d) => hours[d]);
    const open = days
      .filter((d) => !hours[d].closed && hours[d].open && hours[d].close)
      .map((d) => `${DAY_LABELS[locale][d]} ${hours[d].open}-${hours[d].close}`);
    if (open.length) parts.push(open.join(', '));
  }
  if (org.hours_notes) parts.push(org.hours_notes);
  return parts.length ? parts.join(' · ') : null;
}

function detailLine(label: string, value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  return v ? `${label}: ${v}` : null;
}

function drawOrganization(doc: Doc, org: Organization, locale: DirectoryLocale, accent: RGB) {
  const L = LABELS[locale];
  const mission = locale === 'es' ? org.mission_es || org.mission : org.mission;

  // Keep the name attached to at least its first two detail lines rather than
  // stranding a heading alone at the foot of a page.
  doc.ensure(46);

  doc.page.drawRectangle({
    x: MARGIN_X,
    y: doc.y - 11,
    width: 2.5,
    height: 12,
    color: accent,
  });

  doc.text(org.name, { font: doc.bold, size: 11.5, color: INK, indent: 10 });

  const location = [org.address, [org.town, org.zip].filter(Boolean).join(' ')]
    .filter((s) => (s ?? '').trim())
    .join(', ');
  if (location) doc.text(location, { size: 9, color: BODY, indent: 10 });

  const contact = [
    detailLine(L.phone, org.phone),
    detailLine(L.email, org.email),
    detailLine(L.web, org.website),
  ].filter(Boolean) as string[];
  if (contact.length) doc.text(contact.join('  ·  '), { size: 9, color: BODY, indent: 10 });

  const hours = formatHours(org, locale);
  if (hours) doc.text(`${L.hours}: ${hours}`, { size: 9, color: BODY, indent: 10 });

  const cost = detailLine(L.cost, org.cost);
  if (cost) doc.text(cost, { size: 9, color: BODY, indent: 10 });

  if (org.who_served?.length) {
    doc.text(`${L.serves}: ${org.who_served.join(', ')}`, { size: 9, color: BODY, indent: 10 });
  }
  if (org.assistance_types?.length) {
    doc.text(`${L.services}: ${org.assistance_types.join(', ')}`, {
      size: 9,
      color: BODY,
      indent: 10,
    });
  }
  if (mission) {
    doc.text(mission, { font: doc.italic, size: 9, color: MUTED, indent: 10 });
  }
  if (org.spanish_available) {
    doc.text(L.spanish, { font: doc.bold, size: 8, color: accent, indent: 10 });
  }

  doc.y -= 14;
}

function drawSectorHeader(doc: Doc, sector: SectorMeta, count: number, locale: DirectoryLocale) {
  const L = LABELS[locale];
  const accent = hexToRgb(sector.accentHex);
  const name = locale === 'es' ? sector.nameEs : sector.name;
  const blurb = locale === 'es' ? sector.shortDescriptionEs : sector.shortDescription;

  doc.newPage();

  const BAND_H = 96;
  const bandBottom = doc.y - (BAND_H - 14);
  doc.page.drawRectangle({
    x: MARGIN_X, y: bandBottom, width: CONTENT_W, height: BAND_H, color: SAND,
  });
  doc.page.drawRectangle({
    x: MARGIN_X, y: bandBottom, width: 4, height: BAND_H, color: accent,
  });

  doc.y -= 10;
  doc.text(`${sector.numeral} · ${L.orgCount(count)}`, {
    font: doc.bold,
    size: 8,
    color: accent,
    indent: 18,
    leading: 13,
  });
  doc.text(name, { font: doc.bold, size: 20, color: INK, indent: 18, leading: 28 });
  doc.y -= 5;
  doc.text(blurb, { size: 9, color: MUTED, indent: 18, leading: 12, width: CONTENT_W - 36 });
  doc.y -= 30;
}

function drawCover(doc: Doc, locale: DirectoryLocale, orgCount: number, sectorCount: number) {
  const L = LABELS[locale];
  doc.newPage();
  const page = doc.page;

  const BAND_H = 250;
  page.drawRectangle({ x: 0, y: PAGE_H - BAND_H, width: PAGE_W, height: BAND_H, color: SAND });

  // The thirteen sector accents as a spine under the title band — the same
  // visual key the site uses to tell sectors apart, and a hint that what
  // follows is organised by them.
  const spineY = PAGE_H - BAND_H - 20;
  const slot = CONTENT_W / SECTORS.length;
  SECTORS.forEach((sector, i) => {
    page.drawRectangle({
      x: MARGIN_X + i * slot,
      y: spineY,
      width: slot - 4,
      height: 6,
      color: hexToRgb(sector.accentHex),
    });
  });

  doc.y = PAGE_H - 118;
  doc.text(L.county.toUpperCase(), { font: doc.bold, size: 8.5, color: MUTED, leading: 15 });
  doc.y -= 6;
  doc.text(L.title, { font: doc.bold, size: 42, color: INK, leading: 48 });
  doc.text(L.subtitle, { size: 20, color: BODY, leading: 28 });

  doc.y = spineY - 52;
  doc.text(`${L.orgCount(orgCount)}  ·  ${sectorCount} ${locale === 'es' ? 'sectores' : 'sectors'}`, {
    font: doc.bold,
    size: 13,
    color: INK,
    leading: 20,
  });
  doc.text(L.compiled, { size: 10.5, color: BODY, leading: 16, width: CONTENT_W - 90 });

  doc.y = MARGIN_BOTTOM + 186;
  doc.rule(RULE, 0.5, 0, 16);
  doc.text(L.coverNote, { size: 10.5, color: BODY, leading: 16, width: CONTENT_W - 70 });

  doc.y = MARGIN_BOTTOM + 46;
  doc.rule(RULE, 0.5, 0, 12);
  doc.text(
    `${L.generated} ${new Date().toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    { size: 8.5, color: MUTED, leading: 12 },
  );
  doc.text('carteret-assist-hub.vercel.app', { font: doc.bold, size: 8.5, color: INK, leading: 12 });
}

function drawClosing(doc: Doc, locale: DirectoryLocale) {
  const L = LABELS[locale];
  doc.newPage();
  doc.y -= 12;
  doc.text(L.closingTitle, { font: doc.bold, size: 16, color: INK, leading: 22 });
  doc.rule(RULE, 0.5, 6, 12);
  doc.text(L.closingBody, { size: 10, color: BODY, leading: 15.5, width: CONTENT_W - 60 });
  doc.y -= 14;
  doc.text('carteret-assist-hub.vercel.app', { font: doc.bold, size: 11, color: INK, leading: 16 });
  doc.text('carteret-assist-hub.vercel.app/report', { size: 10, color: BODY, leading: 15 });
}

// ── Entry point ────────────────────────────────────────────────────────────
export async function buildDirectoryPdf(
  organizations: Organization[],
  locale: DirectoryLocale = 'en',
): Promise<Uint8Array> {
  const L = LABELS[locale];
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const doc = new Doc(pdf, regular, bold, italic);

  // An organization can be tagged into several sectors; it prints under each.
  const bySector = new Map<string, Organization[]>();
  for (const sector of SECTORS) bySector.set(sector.slug, []);
  for (const org of organizations) {
    const slugs = new Set(
      [org.sector_slug, ...(org.additional_sector_slugs ?? [])].filter(Boolean) as string[],
    );
    for (const slug of slugs) bySector.get(slug)?.push(org);
  }

  // Alphabetical inside each sector — a printed page has no search box, so
  // the site's featured-first ordering would only make a name hard to find.
  for (const list of bySector.values()) list.sort((a, b) => a.name.localeCompare(b.name));

  const sectorsWithOrgs = SECTORS.filter((s) => (bySector.get(s.slug)?.length ?? 0) > 0);

  pdf.setTitle(`${L.title} — ${L.subtitle}`);
  pdf.setAuthor('Carteret County Community Service Committee');
  pdf.setSubject(L.county);
  pdf.setProducer('Carteret Assist Hub');

  drawCover(doc, locale, organizations.length, sectorsWithOrgs.length);

  // Body first; the contents page needs page numbers that do not exist yet.
  const startPage = new Map<string, number>();
  for (const sector of sectorsWithOrgs) {
    const orgs = bySector.get(sector.slug) ?? [];
    drawSectorHeader(doc, sector, orgs.length, locale);
    startPage.set(sector.slug, doc.pageIndex);
    const accent = hexToRgb(sector.accentHex);
    for (const org of orgs) drawOrganization(doc, org, locale, accent);
  }

  drawClosing(doc, locale);

  // ── Contents, inserted after the cover ───────────────────────────────────
  // One line per sector plus the header; a single page holds the thirteen we
  // have, but the count is computed so it survives more sectors being added.
  const LINE_H = 20;
  const firstPageRows = Math.floor((PAGE_H - MARGIN_TOP - MARGIN_BOTTOM - 74) / LINE_H);
  const tocPages = Math.max(1, Math.ceil(sectorsWithOrgs.length / Math.max(1, firstPageRows)));

  const tocPageObjects: PDFPage[] = [];
  for (let i = 0; i < tocPages; i++) {
    tocPageObjects.push(pdf.insertPage(1 + i, [PAGE_W, PAGE_H]));
  }

  let tocIdx = 0;
  let toc = tocPageObjects[0];
  let ty = PAGE_H - MARGIN_TOP;

  toc.drawText(sanitize(L.contents), {
    x: MARGIN_X, y: ty - 24, size: 22, font: bold, color: INK,
  });
  ty -= 48;
  toc.drawRectangle({ x: MARGIN_X, y: ty, width: CONTENT_W, height: 0.75, color: RULE });
  ty -= 12;
  toc.drawText(sanitize(L.sector.toUpperCase()), {
    x: MARGIN_X, y: ty - 8, size: 7.5, font: bold, color: MUTED,
  });
  toc.drawText(sanitize(L.page.toUpperCase()), {
    x: PAGE_W - MARGIN_X - bold.widthOfTextAtSize(sanitize(L.page.toUpperCase()), 7.5),
    y: ty - 8, size: 7.5, font: bold, color: MUTED,
  });
  ty -= 26;

  for (const sector of sectorsWithOrgs) {
    if (ty - LINE_H < MARGIN_BOTTOM && tocIdx + 1 < tocPageObjects.length) {
      tocIdx += 1;
      toc = tocPageObjects[tocIdx];
      ty = PAGE_H - MARGIN_TOP;
    }
    const accent = hexToRgb(sector.accentHex);
    const name = locale === 'es' ? sector.nameEs : sector.name;
    const count = bySector.get(sector.slug)?.length ?? 0;
    // +1 for the cover, +tocPages for the contents, +1 to make it 1-based.
    const printed = (startPage.get(sector.slug) ?? 0) + tocPages + 1;

    toc.drawRectangle({ x: MARGIN_X, y: ty - 9, width: 3, height: 10, color: accent });
    toc.drawText(sanitize(name), { x: MARGIN_X + 11, y: ty - 8, size: 10.5, font: regular, color: INK });

    const countText = sanitize(`${count} ${count === 1 ? L.listing : L.listings}`);
    toc.drawText(countText, {
      x: MARGIN_X + 11 + regular.widthOfTextAtSize(sanitize(name), 10.5) + 10,
      y: ty - 8, size: 8, font: regular, color: MUTED,
    });

    const num = String(printed);
    toc.drawText(num, {
      x: PAGE_W - MARGIN_X - regular.widthOfTextAtSize(num, 10.5),
      y: ty - 8, size: 10.5, font: regular, color: INK,
    });
    ty -= LINE_H;
  }

  // ── Footers, numbered against the final page order ───────────────────────
  const pages = pdf.getPages();
  const footerText = sanitize(L.footer);
  pages.forEach((page, i) => {
    if (i === 0) return; // the cover carries its own colophon
    page.drawRectangle({
      x: MARGIN_X, y: MARGIN_BOTTOM - 16, width: CONTENT_W, height: 0.5, color: RULE,
    });
    page.drawText(footerText, {
      x: MARGIN_X, y: MARGIN_BOTTOM - 28, size: 7.5, font: regular, color: MUTED,
    });
    const num = String(i + 1);
    page.drawText(num, {
      x: PAGE_W - MARGIN_X - regular.widthOfTextAtSize(num, 7.5),
      y: MARGIN_BOTTOM - 28, size: 7.5, font: regular, color: MUTED,
    });
  });

  return pdf.save();
}

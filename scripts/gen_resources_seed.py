#!/usr/bin/env python3
"""Generate the Resource Directory seed from the bilingual Resource Aid docs.

Source of truth: the committee's "Carteret County Resource Aid" Word document
and its Spanish counterpart. The two files are row-for-row parallel — same
categories in the same order, same entries in the same order — so this script
zips them together into one bilingual dataset.

Each document table row is three cells:
    [ name ] [ website and/or street address ] [ phone and/or notes ]

Those cells are split into typed columns (website, address, phone, email,
notes) so the site can render tel:/mailto:/map links instead of one opaque
blob, while `notes` keeps whatever prose the cell carried verbatim.

Emits supabase/resources-seed.sql — idempotent and self-correcting: it wipes
the resource tables and rewrites them, so re-running always yields exactly the
current documents. Nothing else in the database is touched; the 80 partner
organizations in directory-seed.sql are a separate dataset and are left alone.

Usage:  python3 scripts/gen_resources_seed.py [EN_DOCX] [ES_DOCX]
"""
import json
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
NS = {'w': W[1:-1]}

DEFAULT_EN = '/Users/tanayvinaykya/Downloads/Carteret County Resource Aid.docx'
DEFAULT_ES = ('/Users/tanayvinaykya/Library/Caches/'
              'com.apple.SwiftUI.Drag-9A0420F3-1D8A-4D6D-8036-FB6F0DE4260A/'
              'Spanish Carteret County Resource Aid.docx')
OUT_SQL = 'supabase/resources-seed.sql'
OUT_JSON = 'supabase/resources-seed.summary.json'

# Category slug + optional cross-link into the 13 AssistHub sectors. A None
# sector means the category has no sensible home among the sectors (mobile
# home parks, thrift stores, transportation, general services) — those
# resources live only in the resource directory.
CATEGORIES = [
    ('assisted-living',                      'senior-care'),
    ('clothing-furniture',                    None),
    ('counseling-mental-health',              'health-care-access'),
    ('education',                             'youth-education'),
    ('employment',                            None),
    ('family-childrens-services',            'youth-education'),
    ('food-assistance',                      'food-insecurity'),
    ('food-assistance-free-meals',           'food-insecurity'),
    ('food-assistance-food-pantry',          'food-insecurity'),
    ('general-assistance',                    None),
    ('hospitals',                            'health-care-access'),
    ('home-health-hospice',                  'senior-care'),
    ('housing-assistance-shelters',          'housing-homelessness'),
    ('inpatient-rehabilitation',             'health-care-access'),
    ('low-income-public-housing',            'housing-homelessness'),
    ('medical-dental-clinics',               'health-care-access'),
    ('mobile-home-parks',                    'housing-homelessness'),
    ('outpatient-physical-rehab',            'health-care-access'),
    ('private-personal-care',                'senior-care'),
    ('psychiatric-substance-abuse-hospitals', 'addiction-recovery'),
    ('senior-assistance',                    'senior-care'),
    ('services',                              None),
    ('substance-abuse-clinics',              'addiction-recovery'),
    ('transportation',                        None),
    ('veterans-services',                    'veterans'),
]

# Typos in the source headings, corrected for display only.
TITLE_FIX_EN = {'General Medical HospitalS': 'General Medical Hospitals'}
TITLE_FIX_ES = {'/Consultorios Médicos y Dentales': 'Consultorios Médicos y Dentales'}

# The two documents are parallel except at one row: English "General
# Assistance" #1 lists AMEXCAN, Spanish lists ULECAN — different organizations,
# different phone numbers. Neither is a translation of the other, so the row is
# split into two resources and each is shown in both locales. Keyed by
# (category slug, row index); re-check this if the documents are revised.
SPLIT_ROWS = {
    ('general-assistance', 1): (
        ['Association of Mexicans in North Carolina (AMEXCAN)',
         'https://www.amexcannc.org/ | 1410 Evans St., Ste. 1A, Greenville',
         '252-329-0593'],
        ['Ulecan. Union De Latinos del Este de Carolina del Norte.',
         'ulecancarteret@gmail.com',
         'Susan Guijarro 252-723-1858, servicios integrales y variados'],
    ),
}

TOWNS = [
    'Morehead City', 'Pine Knoll Shores', 'Atlantic Beach', 'Emerald Isle',
    'Cedar Point', 'Cedar Island', 'Harkers Island', 'Camp Lejeune',
    'Chapel Hill', 'New Bern', 'Sea Level', 'Beaufort', 'Newport', 'Havelock',
    'Jacksonville', 'Swansboro', 'Greenville', 'Greensboro', 'Wilmington',
    'Goldsboro', 'Kinston', 'Bayboro', 'Gloucester', 'Atlantic', 'Durham',
    'Raleigh', 'Tarboro', 'Smyrna', 'Stacy',
]

URL_RE = re.compile(
    r'(https?://[^\s|,]+|www\.[^\s|,]+|'
    r'[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:org|com|net|gov|edu)(?:/[^\s|,]*)?)',
    re.I)
EMAIL_RE = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
PHONE_RE = re.compile(r'(?:1-)?\d{3}-\d{3}-\d{4}(?:\s*(?:Ext\.?|ext\.?|x)\s*\d+)?')
LEAD_SEP_RE = re.compile(r'^[\s|,;/·–—-]+')
TRAIL_SEP_RE = re.compile(r'[\s|,;/·–—-]+$')


def clean(s):
    s = re.sub(r'[ ​‌‍﻿]', ' ', s or '')
    s = re.sub(r'\s+', ' ', s)
    s = LEAD_SEP_RE.sub('', s)
    # Removing a URL can strand the conjunction that joined it to the address
    # ("va.gov or 221 Memorial Dr." -> "or 221 Memorial Dr.").
    s = re.sub(r'^(?:or|o|y|and)\s+', '', s, flags=re.I)
    # `|` marks a line break carried over from the document and is kept, but
    # removing a phone or email can leave it stranded against punctuation.
    s = re.sub(r'\s*\|\s*([,;.])', r'\1', s)
    s = re.sub(r'([,;])\s*\|\s*', r'\1 ', s)
    s = re.sub(r'(?:\|\s*){2,}', '| ', s)
    return TRAIL_SEP_RE.sub('', s).strip(' :;,|')


def clean_addr(s):
    """clean(), plus: names and addresses never carry a real line break, so a
    `|` there is Word wrapping a long line and folds back to a space."""
    return clean(re.sub(r'\s*\|\s*', ' ', s or ''))


def parse_doc(path):
    """Return [{'title': str, 'rows': [[cell, cell, cell], ...]}, ...]."""
    root = ET.fromstring(zipfile.ZipFile(path).read('word/document.xml'))
    body = root.find('w:body', NS)

    def ptext(p):
        return ''.join(t.text or '' for t in p.iter(W + 't'))

    cats, cur = [], None
    for child in body:
        tag = child.tag.split('}')[1]
        if tag == 'p':
            text = ptext(child).strip()
            # Every non-empty paragraph is a candidate heading; only those
            # immediately followed by a table survive the filter below.
            if text:
                cur = {'title': re.sub(r'\s+', ' ', text), 'rows': []}
                cats.append(cur)
        elif tag == 'tbl' and cur is not None:
            for row in child.findall('w:tr', NS):
                cells = [' | '.join(ptext(p) for p in c.findall('w:p', NS))
                         for c in row.findall('w:tc', NS)]
                cells = [re.sub(r'\s+', ' ', c).strip() for c in cells]
                if any(cells):
                    cur['rows'].append(cells)
    return [c for c in cats if c['rows']]


def split_location(cell):
    """Cell 2 -> (website, address, email). Holds a URL, an address, or both."""
    cell = (cell or '').strip()
    website = email = None
    # Emails first — otherwise the domain half is mistaken for a website and
    # the local part is left behind masquerading as a street address.
    m = EMAIL_RE.search(cell)
    if m:
        email = m.group(0)
        cell = cell[:m.start()] + ' | ' + cell[m.end():]
    m = URL_RE.search(cell)
    if m:
        website = m.group(0).rstrip('.,;|')
        cell = cell[:m.start()] + ' | ' + cell[m.end():]
        # Word wrapped some long links across paragraphs, stranding the query
        # string in what would otherwise be read as a street address.
        if website.endswith(('?', '&', '=')):
            rest = cell.split('|')
            for i, chunk in enumerate(rest):
                c = chunk.strip()
                if c and ' ' not in c and re.fullmatch(r'[\w%.\-=&/#+?]+', c):
                    website += c
                    rest[i] = ''
                    break
            cell = ' | '.join(rest)
    address = clean_addr(cell)
    if website and not re.match(r'^https?://', website, re.I):
        website = 'https://' + website
    return website, (address or None), email


def split_contact(cell):
    """Cell 3 -> (phone, email, notes).

    Phones are pulled off the front of the cell (the common shape is
    "252-726-4747, Tues., Thurs, Sat., 10-4"); everything after them is notes.
    """
    text = (cell or '').strip()
    email = None
    m = EMAIL_RE.search(text)
    if m:
        email = m.group(0)
        text = (text[:m.start()] + ' ' + text[m.end():]).strip()

    phones, pos = [], 0
    while True:
        gap = re.match(r'[\s,;/|]*(?:or|and|o|y)?[\s,;/|]*', text[pos:], re.I)
        start = pos + gap.end()
        m = PHONE_RE.match(text, start)
        if not m:
            break
        phones.append(re.sub(r'\s+', ' ', m.group(0)))
        pos = m.end()
    notes = clean(text[pos:])

    if not phones:
        m = PHONE_RE.search(text)
        if m:
            phones.append(re.sub(r'\s+', ' ', m.group(0)))
            # Drop the number from the note only when it sits at one end
            # ("AA Hotline: 252-…"). Mid-sentence it is load-bearing prose
            # ("Llame al 252-… para dejar de fumar") and stays put.
            head, tail = text[:m.start()], text[m.end():]
            if not clean(tail):
                notes = clean(head)
            elif not clean(head):
                notes = clean(tail)
            else:
                notes = clean(text)
        else:
            notes = clean(text)

    phone = ' or '.join(phones) if phones else None
    return phone, email, (notes or None)


def find_town(address):
    if not address:
        return None
    for town in TOWNS:
        if re.search(r'\b' + re.escape(town) + r'\b', address, re.I):
            return town
    return None


def q(val):
    if val is None:
        return 'NULL'
    s = str(val).strip()
    return 'NULL' if not s else "'" + s.replace("'", "''") + "'"


def expand(slug, index, erow, srow):
    """Yield the (english, spanish) cell pairs a document row becomes.

    Normally one pair. Where the documents list genuinely different resources
    at the same position, SPLIT_ROWS turns the row into two, each shown in
    both locales, so neither the English nor the Spanish entry is dropped.
    """
    override = SPLIT_ROWS.get((slug, index))
    if not override:
        return [(erow, srow)]
    en_only, es_only = override
    return [(en_only, en_only), (es_only, es_only)]


def emit(resources, slug, sector, order, erow, srow):
    name = clean_addr(erow[0])
    website, address, loc_email = split_location(erow[1])
    website_es, address_es, loc_email_es = split_location(srow[1])
    phone, email, notes = split_contact(erow[2])
    phone_es, email_es, notes_es = split_contact(srow[2])
    # English URL wins: the Spanish edition has four links whose *paths* were
    # translated ("/230/Senior-Center" -> "/230/Centro para personas mayores"),
    # which do not resolve. The English one is the working address.
    website = website or website_es
    email = email or email_es or loc_email or loc_email_es
    # A few entries carry their web address in the name instead of its own
    # cell ("NCWorks – ncworks.gov"); lift it so the card can link out.
    if not website:
        m = URL_RE.search(name)
        if m:
            website = 'https://' + m.group(0).lstrip('htps:/').rstrip('.,;')
    # The address fields are parallel by construction: an entry with no street
    # address in English has none in Spanish either, so a leftover fragment on
    # one side is parse noise rather than data.
    if not address:
        address_es = None
    # A middle cell with no digits in it is not an address — it is a service
    # label ("Mobile Crisis"). Keep the words, but as a note, so the card does
    # not put a map pin beside something nobody can drive to.
    if address and not re.search(r'\d', address):
        notes = f'{address}. {notes}' if notes else address
        label_es = address_es or address
        notes_es = f'{label_es}. {notes_es}' if notes_es else label_es
        address = address_es = None
    resources.append({
        'category_slug': slug,
        'display_order': order,
        'name': name,
        'name_es': clean_addr(srow[0]),
        'address': address,
        'address_es': address_es if address_es != address else None,
        'town': find_town(address),
        'website': website,
        'phone': phone or phone_es,
        'email': email,
        'notes': notes,
        'notes_es': notes_es,
        'sector_slug': sector,
    })


def main():
    en_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_EN
    es_path = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_ES
    en, es = parse_doc(en_path), parse_doc(es_path)

    if len(en) != len(es) or len(en) != len(CATEGORIES):
        sys.exit(f'Category count mismatch: en={len(en)} es={len(es)} '
                 f'expected={len(CATEGORIES)}. The documents changed shape — '
                 f'update CATEGORIES before regenerating.')

    cats, resources = [], []
    for order, (ecat, scat, (slug, sector)) in enumerate(zip(en, es, CATEGORIES)):
        if len(ecat['rows']) != len(scat['rows']):
            sys.exit(f'Row count mismatch in "{ecat["title"]}": '
                     f'en={len(ecat["rows"])} es={len(scat["rows"])}')
        cats.append({
            'slug': slug,
            'name': TITLE_FIX_EN.get(ecat['title'], ecat['title']),
            'name_es': TITLE_FIX_ES.get(scat['title'], scat['title']),
            'sector_slug': sector,
            'display_order': order,
            'count': len(ecat['rows']),
        })
        order_in_cat = 0
        for i, (erow, srow) in enumerate(zip(ecat['rows'], scat['rows'])):
            for epair, spair in expand(slug, i, erow, srow):
                emit(resources, slug, sector, order_in_cat, epair, spair)
                order_in_cat += 1
        cats[-1]['count'] = order_in_cat

    out = [
        '-- ' + '=' * 74,
        '-- RESOURCE DIRECTORY SEED — Carteret County and Surrounding Area Resource Aide.',
        '-- Generated by scripts/gen_resources_seed.py from the committee\'s bilingual',
        '-- Resource Aid documents (English + Spanish). Do not hand-edit: regenerate.',
        '--',
        '-- Idempotent and self-correcting — it clears both resource tables and',
        '-- rewrites them, so re-running always reproduces the current documents.',
        '-- The `organizations` table (partner orgs, FoodAssist rows) is untouched.',
        '--',
        f'-- {len(cats)} categories, {len(resources)} resources.',
        '-- ' + '=' * 74,
        '',
        'BEGIN;',
        '',
        '-- Rewrite from scratch. resources.category_id cascades on delete.',
        'DELETE FROM resources;',
        'DELETE FROM resource_categories;',
        '',
        '-- 1. Categories, in document order.',
    ]
    for c in cats:
        out.append(
            'INSERT INTO resource_categories '
            '(slug, name, name_es, sector_slug, display_order) VALUES ('
            f'{q(c["slug"])}, {q(c["name"])}, {q(c["name_es"])}, '
            f'{q(c["sector_slug"])}, {c["display_order"]});')

    # One multi-row INSERT rather than 245 statements: it is a single round
    # trip, and small enough to paste straight into the Supabase SQL editor
    # when no local database credentials are available.
    out += ['', f'-- 2. Resources ({len(resources)} rows), in document order.',
            'WITH v (category_slug, name, name_es, address, address_es, town,',
            '        website, phone, email, notes, notes_es, sector_slug,',
            '        display_order) AS (',
            '  VALUES']
    rows_sql = []
    for i, r in enumerate(resources):
        # Cast the first row so Postgres has a type for every column even
        # where the rest of the rows happen to be NULL.
        cast = '::text' if i == 0 else ''
        vals = ', '.join([
            q(r['category_slug']) + cast, q(r['name']) + cast, q(r['name_es']) + cast,
            q(r['address']) + cast, q(r['address_es']) + cast, q(r['town']) + cast,
            q(r['website']) + cast, q(r['phone']) + cast, q(r['email']) + cast,
            q(r['notes']) + cast, q(r['notes_es']) + cast, q(r['sector_slug']) + cast,
            str(r['display_order']) + ('::int' if i == 0 else ''),
        ])
        rows_sql.append(f'    ({vals})')
    out.append(',\n'.join(rows_sql))
    out += [
        ')',
        'INSERT INTO resources (category_id, name, name_es, address, address_es,',
        '                       town, website, phone, email, notes, notes_es,',
        '                       sector_slug, display_order)',
        'SELECT c.id, v.name, v.name_es, v.address, v.address_es, v.town,',
        '       v.website, v.phone, v.email, v.notes, v.notes_es,',
        '       v.sector_slug, v.display_order',
        'FROM v JOIN resource_categories c ON c.slug = v.category_slug;',
        '',
        'COMMIT;',
        '',
    ]

    with open(OUT_SQL, 'w') as f:
        f.write('\n'.join(out))

    summary = {
        'categories': len(cats),
        'resources': len(resources),
        'with_phone': sum(1 for r in resources if r['phone']),
        'with_website': sum(1 for r in resources if r['website']),
        'with_address': sum(1 for r in resources if r['address']),
        'with_town': sum(1 for r in resources if r['town']),
        'with_notes': sum(1 for r in resources if r['notes']),
        'by_category': {c['slug']: c['count'] for c in cats},
        'by_sector': {},
    }
    for r in resources:
        key = r['sector_slug'] or '(none)'
        summary['by_sector'][key] = summary['by_sector'].get(key, 0) + 1
    with open(OUT_JSON, 'w') as f:
        json.dump(summary, f, indent=2)
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()

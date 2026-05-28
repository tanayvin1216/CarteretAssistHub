#!/usr/bin/env python3
"""Generate the real-data Supabase seed for AssistHub from Book1.xlsx.

Emits idempotent SQL that:
  1. Removes the old illustrative demo rows (15 orgs + needs, 13 leads, 3 activities).
  2. Removes any prior copy of the master-directory orgs (by exact name) + their
     needs, so re-running yields exactly the master doc (self-correcting).
  3. Inserts every master-directory organization once, with cross-sector
     listings folded into additional_sector_slugs.
  4. Inserts one volunteer_need per org carrying the sheet's verbatim
     "Volunteer Opportunities" text.

The shared `organizations` table is partitioned from FoodAssist by the `sector`
column: FoodAssist shows only sector='food_insecurity'; committee orgs are
written with sector='other' so they never appear on the FoodAssist site, while
FoodAssist's own rows are left completely untouched.
"""
import json
import re
import openpyxl

SRC = '/Users/tanayvinaykya/Desktop/Book1.xlsx'
OUT_SQL = '/tmp/real_seed.sql'
OUT_JSON = '/tmp/real_seed_summary.json'

# Value for the FoodAssist `sector` column. Anything other than
# 'food_insecurity' keeps these rows off the FoodAssist website.
FOODASSIST_HIDDEN = 'other'

SECTOR_SLUG = {
    'FOOD INSECURITY': 'food-insecurity',
    'HOUSING & HOMELESSNESS': 'housing-homelessness',
    'FOSTER CARE': 'foster-care',
    'YOUTH & EDUCATION': 'youth-education',
    'SENIOR CARE': 'senior-care',
    'ANIMALS & WILDLIFE': 'animals-wildlife',
    'ENVIRONMENT': 'environment',
    'DOMESTIC & SEXUAL VIOLENCE': 'domestic-sexual-violence',
    'HEALTH CARE ACCESS': 'health-care-access',
    'VETERANS': 'veterans',
    'ADDICTION & RECOVERY': 'addiction-recovery',
    'CIVIC ENGAGEMENT': 'civic-engagement',
    'ARTS, HISTORY & CULTURE': 'arts-history-culture',
}

FAKE_ORGS = [
    'Beaufort Community Food Pantry', 'Carteret County Interfaith Assistance',
    'Hope Mission of Carteret County', 'Crystal Coast Rental Assistance',
    'CASA of Carteret County', 'Tutor the Coast', 'Crystal Coast Senior Companions',
    'Carteret County Humane Society', 'Coastal Federation of Carteret',
    'Carteret Safe Haven', 'CarolinaEast Free Clinic of Carteret',
    'Crystal Coast Veterans Outreach', 'Carteret Recovery Alliance',
    'Voter League of Carteret', 'North Carolina Maritime Museum',
]
FAKE_LEADS = [
    'Rev. Marcus Ellington', 'Linda Vargas', 'Janelle Pierce', 'David Yoon',
    'Aisha Carter', 'Tom Hibbs', 'Samar Patel', 'Confidential Coordinator',
    'Dr. Renee Hobbs, MD', 'Col. (Ret.) James Whitfield', 'Kayla Bennett',
    'Priya Rao', 'Walter MacPherson',
]
FAKE_ACTIVITIES = [
    'Countywide pantry coordination meeting',
    'Point-in-Time count volunteer training', 'Oyster reef workday',
]


def q(val):
    if val is None:
        return 'NULL'
    s = str(val).strip()
    return 'NULL' if not s else "'" + s.replace("'", "''") + "'"


def qstr(val):
    s = '' if val is None else str(val).strip()
    return "'" + s.replace("'", "''") + "'"


def norm_web(val):
    s = (val or '').strip()
    if not s:
        return None
    return s if re.match(r'^https?://', s, re.I) else 'https://' + s


def parse_zip(addr):
    m = re.search(r'\b(\d{5})\b', addr or '')
    return m.group(1) if m else ''


def main():
    wb = openpyxl.load_workbook(SRC, data_only=True)
    ws = wb.worksheets[0]
    rows = [['' if c is None else str(c).strip() for c in r]
            for r in ws.iter_rows(values_only=True)]

    current = None
    orgs = {}
    order = []
    for r in rows:
        c0 = r[0] if r else ''
        if not c0:
            continue
        if c0.startswith('▸') or c0.startswith('>'):
            current = SECTOR_SLUG.get(c0.lstrip('▸> ').strip().upper())
            continue
        if c0.startswith('Carteret County Democrats') or c0 == 'Organization':
            continue
        if current is None:
            continue
        col = lambda i: r[i] if len(r) > i else ''
        key = re.sub(r'\s+', ' ', c0).strip().lower()
        if key not in orgs:
            orgs[key] = {
                'name': c0, 'town': col(1), 'contact': col(2), 'phone': col(3),
                'email': col(4), 'address': col(5), 'website': col(6),
                'opps': col(7), 'notes': col(8), 'sectors': [],
            }
            order.append(key)
        if current not in orgs[key]['sectors']:
            orgs[key]['sectors'].append(current)

    final = []
    crosslisted = []
    for key in order:
        o = orgs[key]
        o['primary'] = o['sectors'][0]
        o['additional'] = o['sectors'][1:]
        if o['additional']:
            crosslisted.append((o['name'], o['sectors']))
        final.append(o)

    names = [o['name'] for o in final]
    out = []
    out.append('-- ============================================================================')
    out.append('-- REAL SEED — Carteret County Democrats Community Service Committee directory.')
    out.append('-- Generated from the master Partner Organization Directory (Book1.xlsx).')
    out.append('-- Idempotent + self-correcting: re-running yields exactly the master doc.')
    out.append('-- Run AFTER seed.sql (sectors must exist).')
    out.append('--')
    out.append('-- Shares the organizations table with FoodAssist. FoodAssist shows only')
    out.append("-- sector='food_insecurity'; committee orgs use sector='other' so they never")
    out.append('-- appear on FoodAssist, and FoodAssist\'s own rows are never modified.')
    out.append('-- ============================================================================')
    out.append('')
    out.append('-- 1. Remove the old illustrative demo rows.')
    fake_list = ', '.join(qstr(n) for n in FAKE_ORGS)
    out.append(f'DELETE FROM volunteer_needs WHERE organization_id IN '
               f'(SELECT id FROM organizations WHERE name IN ({fake_list}));')
    out.append(f'DELETE FROM organizations WHERE name IN ({fake_list});')
    out.append(f'DELETE FROM subcommittee_leads WHERE name IN ({", ".join(qstr(n) for n in FAKE_LEADS)});')
    out.append(f'DELETE FROM sector_activities WHERE title IN ({", ".join(qstr(n) for n in FAKE_ACTIVITIES)});')
    out.append('')
    out.append('-- 2. Remove any prior copy of the directory orgs (by exact name) so this')
    out.append('--    seed is self-correcting. Names are committee-specific and never match')
    out.append("--    FoodAssist's own rows.")
    real_list = ',\n  '.join(qstr(n) for n in names)
    out.append(f'DELETE FROM volunteer_needs WHERE organization_id IN (SELECT id FROM organizations WHERE name IN (\n  {real_list}\n));')
    out.append(f'DELETE FROM organizations WHERE name IN (\n  {real_list}\n);')
    out.append('')
    out.append("-- 3. Real organizations (sector='other' hides them from FoodAssist).")
    for o in final:
        addl = "'{}'" if not o['additional'] else \
            'ARRAY[' + ', '.join(qstr(s) for s in o['additional']) + ']::text[]'
        cols = ('name, town, address, zip, contact_name, phone, email, website, '
                'assistance_types, cost, is_active, spanish_available, sector, '
                'sector_slug, additional_sector_slugs, comments')
        vals = ', '.join([
            qstr(o['name']), qstr(o['town']), qstr(o['address']), qstr(parse_zip(o['address'])),
            q(o['contact']), qstr(o['phone']), q(o['email']), q(norm_web(o['website'])),
            "'{}'", "'free'", 'true', 'false', qstr(FOODASSIST_HIDDEN),
            qstr(o['primary']), addl, q(o['notes']),
        ])
        out.append(f'INSERT INTO organizations ({cols})')
        out.append(f'  VALUES ({vals});')
    out.append('')
    out.append('-- 4. Volunteer opportunities (verbatim from the directory).')
    for o in final:
        if not (o['opps'] or '').strip():
            continue
        out.append('INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)')
        out.append(f'  SELECT o.id, {qstr(o["name"])}, {qstr(o["opps"])}, true, {qstr(o["primary"])}')
        out.append(f'  FROM organizations o WHERE o.name = {qstr(o["name"])} AND o.sector = {qstr(FOODASSIST_HIDDEN)};')
    out.append('')

    with open(OUT_SQL, 'w') as f:
        f.write('\n'.join(out))

    summary = {
        'inserted_orgs': len(final),
        'crosslisted': crosslisted,
        'by_primary_sector': {},
        'by_any_sector': {},
        'needs_emitted': sum(1 for o in final if (o['opps'] or '').strip()),
    }
    for o in final:
        summary['by_primary_sector'][o['primary']] = summary['by_primary_sector'].get(o['primary'], 0) + 1
        for s in [o['primary']] + o['additional']:
            summary['by_any_sector'][s] = summary['by_any_sector'].get(s, 0) + 1
    with open(OUT_JSON, 'w') as f:
        json.dump(summary, f, indent=2)
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()

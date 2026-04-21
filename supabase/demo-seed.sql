-- ============================================================================
-- DEMO SEED — plausible Carteret County non-profits across all 13 sectors.
--
-- Names, phones, and addresses here are illustrative fixtures for the demo.
-- Replace with real verified data before production. Run AFTER seed.sql so
-- the sectors table is populated.
-- ============================================================================

-- Helper: resolve sector UUIDs by slug.
WITH s AS (
  SELECT slug, id FROM sectors
)
INSERT INTO organizations (
  name, mission, address, town, zip, phone, email, website,
  assistance_types, who_served, cost, spanish_available, is_active,
  sector_slug, operating_hours, hours_notes
)
VALUES
  (
    'Beaufort Community Food Pantry',
    'A volunteer-run pantry serving families in Beaufort and the surrounding Down East communities. No documentation required.',
    '1601 Live Oak St', 'Beaufort', '28516', '(252) 728-4200', 'beaufortpantry@example.org',
    'https://beaufortfoodpantry.example.org',
    ARRAY['Food pantry', 'Hot meals', 'Groceries', 'Baby supplies'],
    ARRAY['Families', 'Seniors', 'Children'],
    'free', true, true, 'food-insecurity',
    '{"tuesday":{"open":"09:00","close":"12:00"},"thursday":{"open":"13:00","close":"16:00"},"saturday":{"open":"09:00","close":"11:00"}}'::jsonb,
    'Closed on federal holidays. Emergency bags available any time — call first.'
  ),
  (
    'Carteret County Interfaith Assistance',
    'Faith-based coalition coordinating rent, utility, and food assistance across the county. Confidential and low-barrier.',
    '200 Safrit Dr', 'Morehead City', '28557', '(252) 247-3535', 'hello@ccia.example.org',
    'https://ccia.example.org',
    ARRAY['Food assistance', 'Rental assistance', 'Utility help', 'Emergency groceries'],
    ARRAY['Families', 'Working adults', 'Seniors'],
    'free', true, true, 'food-insecurity',
    '{"monday":{"open":"10:00","close":"15:00"},"wednesday":{"open":"10:00","close":"15:00"},"friday":{"open":"10:00","close":"15:00"}}'::jsonb,
    'First-come, first-served.'
  ),
  (
    'Hope Mission of Carteret County',
    'Emergency shelter and transitional housing for individuals and families experiencing homelessness.',
    '720 Cedar St', 'Beaufort', '28516', '(252) 728-4000', 'info@hopemissionct.example.org',
    'https://hopemissionct.example.org',
    ARRAY['Emergency shelter', 'Transitional housing', 'Meals', 'Case management'],
    ARRAY['Adults', 'Families', 'Veterans'],
    'free', false, true, 'housing-homelessness',
    '{"monday":{"open":"00:00","close":"23:59"},"tuesday":{"open":"00:00","close":"23:59"},"wednesday":{"open":"00:00","close":"23:59"},"thursday":{"open":"00:00","close":"23:59"},"friday":{"open":"00:00","close":"23:59"},"saturday":{"open":"00:00","close":"23:59"},"sunday":{"open":"00:00","close":"23:59"}}'::jsonb,
    '24-hour intake hotline. Walk-ins accepted evenings.'
  ),
  (
    'Crystal Coast Rental Assistance',
    'One-time rental and utility grants for tenants at risk of eviction in Carteret County.',
    '100 Hollister Rd', 'Morehead City', '28557', '(252) 726-1100', 'rental@crystalcoast.example.org',
    null,
    ARRAY['Rental assistance', 'Utility assistance', 'Eviction prevention'],
    ARRAY['Renters', 'Families'],
    'free', true, true, 'housing-homelessness',
    '{"monday":{"open":"09:00","close":"17:00"},"tuesday":{"open":"09:00","close":"17:00"},"wednesday":{"open":"09:00","close":"17:00"},"thursday":{"open":"09:00","close":"17:00"},"friday":{"open":"09:00","close":"13:00"}}'::jsonb,
    'Appointments strongly preferred.'
  ),
  (
    'CASA of Carteret County',
    'Court-appointed special advocates for children in foster care. Every child deserves a voice in court.',
    '302 Front St', 'Beaufort', '28516', '(252) 728-8555', 'info@casacarteret.example.org',
    'https://casacarteret.example.org',
    ARRAY['Advocacy', 'Court representation', 'Mentorship', 'Volunteer training'],
    ARRAY['Children in care', 'Families'],
    'free', false, true, 'foster-care',
    null,
    'Volunteer training offered quarterly.'
  ),
  (
    'Tutor the Coast',
    'Free after-school tutoring and mentorship for K-12 students across Carteret County schools.',
    '450 Mansfield Pkwy', 'Beaufort', '28516', '(252) 728-9090', 'hi@tutorthecoast.example.org',
    'https://tutorthecoast.example.org',
    ARRAY['Tutoring', 'Mentorship', 'Literacy', 'College prep'],
    ARRAY['K-12 students', 'High schoolers', 'First-gen students'],
    'free', true, true, 'youth-education',
    '{"monday":{"open":"15:30","close":"18:30"},"tuesday":{"open":"15:30","close":"18:30"},"wednesday":{"open":"15:30","close":"18:30"},"thursday":{"open":"15:30","close":"18:30"}}'::jsonb,
    null
  ),
  (
    'Crystal Coast Senior Companions',
    'Friendly visits, errand support, and wellness check-ins for isolated seniors across the county.',
    '88 Hestron Plaza', 'Morehead City', '28557', '(252) 726-3003', null, null,
    ARRAY['Companionship', 'Transportation', 'Meal delivery', 'Wellness checks'],
    ARRAY['Seniors', 'Homebound adults'],
    'free', false, true, 'senior-care',
    null,
    null
  ),
  (
    'Carteret County Humane Society',
    'Shelter, adoption, and TNR services for animals in need. Runs the county''s low-cost spay-neuter voucher program.',
    '853 Hibbs Rd', 'Newport', '28570', '(252) 247-7744', 'adopt@carterethumane.example.org',
    'https://carterethumane.example.org',
    ARRAY['Adoption', 'Spay/neuter vouchers', 'Emergency foster', 'Surrender intake'],
    ARRAY['Dogs', 'Cats', 'Community cats'],
    'low cost', false, true, 'animals-wildlife',
    '{"tuesday":{"open":"11:00","close":"17:00"},"wednesday":{"open":"11:00","close":"17:00"},"thursday":{"open":"11:00","close":"17:00"},"friday":{"open":"11:00","close":"17:00"},"saturday":{"open":"10:00","close":"14:00"}}'::jsonb,
    'Appointments recommended for surrenders.'
  ),
  (
    'Coastal Federation of Carteret',
    'Protecting the coast through restoration, education, and advocacy. Monthly volunteer workdays.',
    '3609 Hwy 24', 'Newport', '28570', '(252) 393-8185', 'volunteer@coastalfedct.example.org',
    'https://coastalfedct.example.org',
    ARRAY['Oyster restoration', 'Shoreline cleanup', 'Environmental education'],
    ARRAY['All ages', 'School groups', 'Families'],
    'free', false, true, 'environment',
    null,
    'Check website for next workday.'
  ),
  (
    'Carteret Safe Haven',
    '24/7 confidential crisis line and emergency shelter for survivors of domestic and sexual violence.',
    'Confidential location', 'Morehead City', '28557', '(252) 728-3788', null, 'https://carteretsafehaven.example.org',
    ARRAY['Crisis line', 'Emergency shelter', 'Legal advocacy', 'Counseling', 'Children''s services'],
    ARRAY['Survivors', 'Children', 'Families'],
    'free', true, true, 'domestic-sexual-violence',
    null,
    'Crisis line answered 24 hours a day, every day.'
  ),
  (
    'CarolinaEast Free Clinic of Carteret',
    'Free primary care, prescription assistance, and chronic disease management for uninsured adults.',
    '3500 Arendell St', 'Morehead City', '28557', '(252) 499-6700', null, null,
    ARRAY['Primary care', 'Prescriptions', 'Lab work', 'Chronic care'],
    ARRAY['Uninsured adults'],
    'free', true, true, 'health-care-access',
    '{"tuesday":{"open":"17:00","close":"20:00"},"thursday":{"open":"17:00","close":"20:00"}}'::jsonb,
    'Appointment only. Bring ID and proof of income if available.'
  ),
  (
    'Crystal Coast Veterans Outreach',
    'Peer support, benefits navigation, and transition assistance for Carteret County veterans.',
    '502 Bridges St', 'Morehead City', '28557', '(252) 247-1900', 'outreach@ccveterans.example.org',
    'https://ccveterans.example.org',
    ARRAY['Benefits navigation', 'Peer support', 'Employment help', 'Housing referrals'],
    ARRAY['Veterans', 'Military families'],
    'free', false, true, 'veterans',
    null,
    null
  ),
  (
    'Carteret Recovery Alliance',
    'Peer-led recovery community, meetings, naloxone distribution, and harm reduction supplies.',
    '1006 Arendell St #102', 'Morehead City', '28557', '(252) 648-8400', 'info@carteretrecovery.example.org',
    'https://carteretrecovery.example.org',
    ARRAY['Peer support', 'Recovery meetings', 'Naloxone', 'Harm reduction'],
    ARRAY['People in recovery', 'Family members'],
    'free', true, true, 'addiction-recovery',
    null,
    'Meetings M-F; see website.'
  ),
  (
    'Voter League of Carteret',
    'Non-partisan voter registration, poll-worker recruitment, and candidate forum hosting.',
    'PO Box 1422', 'Beaufort', '28516', '(252) 728-0100', 'voters@vlcarteret.example.org',
    null,
    ARRAY['Voter registration', 'Candidate forums', 'Poll worker recruitment'],
    ARRAY['Adults', 'New citizens'],
    'free', true, true, 'civic-engagement',
    null,
    null
  ),
  (
    'North Carolina Maritime Museum',
    'Exploring the maritime history of the Crystal Coast. Free admission; docent-led tours daily.',
    '315 Front St', 'Beaufort', '28516', '(252) 728-7317', 'maritime@nc.example.org',
    'https://ncmaritimemuseums.com',
    ARRAY['Museum', 'Tours', 'Education programs', 'Boat-building workshops'],
    ARRAY['All ages', 'School groups'],
    'free', false, true, 'arts-history-culture',
    '{"tuesday":{"open":"10:00","close":"17:00"},"wednesday":{"open":"10:00","close":"17:00"},"thursday":{"open":"10:00","close":"17:00"},"friday":{"open":"10:00","close":"17:00"},"saturday":{"open":"10:00","close":"17:00"}}'::jsonb,
    'Closed Sundays and Mondays.'
  )
ON CONFLICT DO NOTHING;

-- Sample subcommittee leads so the sector pages feel live for the demo.
INSERT INTO subcommittee_leads (sector_id, name, role, affiliation, bio, email, phone, display_order)
SELECT s.id, v.name, v.role, v.affiliation, v.bio, v.email, v.phone, v.display_order
FROM sectors s
JOIN (VALUES
  ('food-insecurity', 'Rev. Marcus Ellington', 'lead', 'St. Paul AME Church', 'Pastor coordinating food pantry networks across the county.', 'rev.ellington@example.org', '(252) 728-1100', 0),
  ('food-insecurity', 'Linda Vargas',  'co-lead', 'Beaufort Community Food Pantry', 'Volunteer coordinator; bilingual EN/ES.', 'linda@example.org', null, 1),
  ('housing-homelessness', 'Janelle Pierce', 'lead', 'Hope Mission of Carteret County', 'Former social worker, now shelter director.', 'janelle@example.org', null, 0),
  ('foster-care', 'David Yoon', 'lead', 'CASA of Carteret County', 'CASA program director.', 'david@example.org', null, 0),
  ('youth-education', 'Aisha Carter', 'lead', 'Tutor the Coast', 'Founder; former NC public school teacher.', 'aisha@example.org', null, 0),
  ('animals-wildlife', 'Tom Hibbs', 'lead', 'Carteret County Humane Society', null, null, null, 0),
  ('environment', 'Samar Patel', 'lead', 'NC Coastal Federation', null, 'samar@example.org', null, 0),
  ('domestic-sexual-violence', 'Confidential Coordinator', 'lead', 'Carteret Safe Haven', 'Name withheld for safety.', null, '(252) 728-3788', 0),
  ('health-care-access', 'Dr. Renee Hobbs, MD', 'lead', 'CarolinaEast Free Clinic', 'Medical director, 12-year volunteer.', null, null, 0),
  ('veterans', 'Col. (Ret.) James Whitfield', 'lead', 'Crystal Coast Veterans Outreach', null, 'jwhitfield@example.org', null, 0),
  ('addiction-recovery', 'Kayla Bennett', 'lead', 'Carteret Recovery Alliance', 'Person in recovery, certified peer-support specialist.', 'kayla@example.org', null, 0),
  ('civic-engagement', 'Priya Rao', 'lead', 'Voter League of Carteret', null, 'priya@example.org', null, 0),
  ('arts-history-culture', 'Walter MacPherson', 'lead', 'NC Maritime Museum', null, null, null, 0)
) AS v(slug, name, role, affiliation, bio, email, phone, display_order) ON v.slug = s.slug
ON CONFLICT DO NOTHING;

-- Sample volunteer needs — at least one per sector that has an organization above.
INSERT INTO volunteer_needs (organization_id, title, description, time_commitment, is_active, sector_slug)
SELECT o.id, v.title, v.description, v.time_commitment, true, v.sector_slug
FROM organizations o
JOIN (VALUES
  ('Beaufort Community Food Pantry', 'food-insecurity', 'Saturday morning pantry volunteer', 'Help sort donations and bag groceries for families. Heavy lifting required.', '3 hrs / Saturday'),
  ('Carteret County Interfaith Assistance', 'food-insecurity', 'Intake interviewer (bilingual preferred)', 'Meet with families to assess food and utility needs. Spanish a plus.', '4 hrs / week'),
  ('Hope Mission of Carteret County', 'housing-homelessness', 'Overnight shelter volunteer', 'Staff the front desk 7pm–7am once a month. Background check required.', '12 hrs / month'),
  ('CASA of Carteret County', 'foster-care', 'Court-appointed advocate', 'Advocate for one child in the foster system. 30-hour training provided.', '10 hrs / month'),
  ('Tutor the Coast', 'youth-education', 'After-school tutor', 'Help elementary students with reading and math homework.', '2–4 hrs / week'),
  ('Crystal Coast Senior Companions', 'senior-care', 'Friendly visitor', 'Weekly visit with a homebound senior. Conversation, errands, wellness check.', '1–2 hrs / week'),
  ('Carteret County Humane Society', 'animals-wildlife', 'Dog walker', 'Rotating shifts to exercise adoptable dogs.', '1–2 hrs / week'),
  ('Coastal Federation of Carteret', 'environment', 'Oyster restoration crew', 'Outdoor workdays building oyster reefs. Physical work; boots/gloves provided.', '4 hrs / monthly'),
  ('Carteret Safe Haven', 'domestic-sexual-violence', 'Hotline volunteer (trained)', '40-hour training, then 1 shift per week on the crisis line. Applicants vetted carefully.', '4 hrs / week'),
  ('CarolinaEast Free Clinic of Carteret', 'health-care-access', 'Front-desk patient greeter', 'Check patients in for the Tuesday/Thursday evening clinic.', '3 hrs / week'),
  ('Crystal Coast Veterans Outreach', 'veterans', 'Peer mentor (veterans only)', 'Pair with a recently separated veteran navigating benefits and housing.', '2 hrs / week'),
  ('Carteret Recovery Alliance', 'addiction-recovery', 'Recovery-meeting host', 'Open the meeting space, make coffee, welcome new attendees.', '2 hrs / week'),
  ('Voter League of Carteret', 'civic-engagement', 'Registration-drive volunteer', 'Staff tables at farmers markets and college campuses.', 'Flexible'),
  ('North Carolina Maritime Museum', 'arts-history-culture', 'Docent / tour guide', 'Give daily tours after a 4-week training on maritime history.', '1 shift / week')
) AS v(org_name, sector_slug, title, description, time_commitment)
  ON o.name = v.org_name
ON CONFLICT DO NOTHING;

-- A couple of sector activities so the "Upcoming activity" panel has content.
INSERT INTO sector_activities (sector_id, title, description, scheduled_for, location, is_published)
SELECT s.id, v.title, v.description, v.scheduled_for::timestamptz, v.location, true
FROM sectors s
JOIN (VALUES
  ('food-insecurity', 'Countywide pantry coordination meeting', 'Monthly meeting of all Carteret County food pantry leads.', '2026-05-07 18:00:00+00', 'Morehead City Library'),
  ('housing-homelessness', 'Point-in-Time count volunteer training', 'Annual count of unsheltered neighbors.', '2026-05-15 09:00:00+00', 'Hope Mission, Beaufort'),
  ('environment', 'Oyster reef workday', 'Join Coastal Federation staff to build living shoreline.', '2026-05-24 08:00:00+00', 'Newport River access')
) AS v(slug, title, description, scheduled_for, location) ON v.slug = s.slug
ON CONFLICT DO NOTHING;

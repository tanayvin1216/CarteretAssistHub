-- ============================================================================
-- REAL SEED — Carteret County Democrats Community Service Committee directory.
-- Generated from the master Partner Organization Directory (Book1.xlsx).
-- Idempotent + self-correcting: re-running yields exactly the master doc.
-- Run AFTER seed.sql (sectors must exist).
--
-- Shares the organizations table with FoodAssist. FoodAssist shows only
-- sector='food_insecurity'; committee orgs use sector='other' so they never
-- appear on FoodAssist, and FoodAssist's own rows are never modified.
-- ============================================================================

-- 1. Remove the old illustrative demo rows.
DELETE FROM volunteer_needs WHERE organization_id IN (SELECT id FROM organizations WHERE name IN ('Beaufort Community Food Pantry', 'Carteret County Interfaith Assistance', 'Hope Mission of Carteret County', 'Crystal Coast Rental Assistance', 'CASA of Carteret County', 'Tutor the Coast', 'Crystal Coast Senior Companions', 'Carteret County Humane Society', 'Coastal Federation of Carteret', 'Carteret Safe Haven', 'CarolinaEast Free Clinic of Carteret', 'Crystal Coast Veterans Outreach', 'Carteret Recovery Alliance', 'Voter League of Carteret', 'North Carolina Maritime Museum'));
DELETE FROM organizations WHERE name IN ('Beaufort Community Food Pantry', 'Carteret County Interfaith Assistance', 'Hope Mission of Carteret County', 'Crystal Coast Rental Assistance', 'CASA of Carteret County', 'Tutor the Coast', 'Crystal Coast Senior Companions', 'Carteret County Humane Society', 'Coastal Federation of Carteret', 'Carteret Safe Haven', 'CarolinaEast Free Clinic of Carteret', 'Crystal Coast Veterans Outreach', 'Carteret Recovery Alliance', 'Voter League of Carteret', 'North Carolina Maritime Museum');
DELETE FROM subcommittee_leads WHERE name IN ('Rev. Marcus Ellington', 'Linda Vargas', 'Janelle Pierce', 'David Yoon', 'Aisha Carter', 'Tom Hibbs', 'Samar Patel', 'Confidential Coordinator', 'Dr. Renee Hobbs, MD', 'Col. (Ret.) James Whitfield', 'Kayla Bennett', 'Priya Rao', 'Walter MacPherson');
DELETE FROM sector_activities WHERE title IN ('Countywide pantry coordination meeting', 'Point-in-Time count volunteer training', 'Oyster reef workday');

-- 2. Remove any prior copy of the directory orgs (by exact name) so this
--    seed is self-correcting. Names are committee-specific and never match
--    FoodAssist's own rows.
DELETE FROM volunteer_needs WHERE organization_id IN (SELECT id FROM organizations WHERE name IN (
  'Carteret Food and Health Council',
  'Martha''s Mission Cupboard',
  'Matthew 25 Food Pantry & Thrift Store',
  'Loaves and Fishes of Beaufort',
  'Hand 2 Hand Down East Food Bank',
  'Hope Mission Soup Kitchen',
  'Coastal Community Action Inc.',
  'Second Blessings Community Outreach & Thrift Store',
  'Jeremiah 33:3 Ministries – Down East Thrift Store',
  'Project Christmas Cheer',
  'Salvation Army',
  'Family Promise of Carteret County',
  'Crystal Coast Habitat for Humanity',
  'St. James United Methodist Church',
  'Atlantic House',
  'Coastal Carolina Center for Women''s Ministries',
  'Guardian ad Litem Program',
  'Carteret County DSS – Child Welfare',
  'Carteret County Partnership for Children',
  'Sweet Tea & Chai Society',
  'Boys & Girls Clubs of Coastal Carolina',
  'YouthLife',
  'The Bridge Down East',
  'Carteret County Public School Foundation',
  'Crystal Coast Autism Center',
  'Take A Kid Fishing Foundation',
  'Carteret Community College Foundation',
  'Camp Albemarle (YMCA Camping & Retreat)',
  'Leon Mann Jr. Enrichment Center',
  'Crystal Coast Hospice House',
  'Hospice of Carteret County',
  'Meals on Wheels',
  'Brookdale Senior Living',
  'Pruitt Crystal Coast',
  'Embassy Healthcare',
  'Croatan Ridge',
  'Pine Knoll Shores Council on Successful Aging',
  'Carteret County Humane Society',
  'Outer Banks Wildlife Shelter (OWLS)',
  'Misplaced Mutts',
  'Island Cat Allies',
  'Protectors of Homeless Pets of Carteret County',
  'NC Coastal Federation',
  'Bogue Banks Surfrider Foundation',
  'Litter Free Land & Sea',
  'Fort Macon State Park',
  'Cape Lookout National Seashore',
  'Foundation for Shackleford Horses',
  'Sierra Club – Crystal Coast Group',
  'Core Sound Waterfowl Museum',
  'NC Aquarium at Pine Knoll Shores',
  'Carteret County Domestic Violence Program',
  'Carteret SPEAK',
  'Broad Street Clinic',
  'Carteret Health Care Foundation',
  'COACH Hope',
  'Coastal Pregnancy Care Center',
  'La Leche League of Carteret County',
  'American Red Cross – Coastal Plains Chapter',
  'Carteret County Veterans Services Office',
  'Carteret Warriors for Recovery',
  'Hope for the Warriors',
  'Carteret Long Term Recovery Alliance (CLTRA)',
  'Peer Overdose Response Team (PORT)',
  'Station Club / Easterseals',
  'League of Women Voters of Carteret County',
  'Carteret Literacy Council',
  'Carteret Community Foundation',
  'Carteret County Council for Women',
  'Queen Street Heritage Foundation',
  'NC Seafood Festival',
  'Beaufort Historical Association',
  'History Museum of Carteret County',
  'Morehead City Historical Society',
  'NC Maritime Museum',
  'Core Sound Carvers Decoy Guild',
  'Arts Council of Carteret County',
  'American Music Festival',
  'Downtown Morehead City Revitalization Association',
  'Friends of Fort Macon'
));
DELETE FROM organizations WHERE name IN (
  'Carteret Food and Health Council',
  'Martha''s Mission Cupboard',
  'Matthew 25 Food Pantry & Thrift Store',
  'Loaves and Fishes of Beaufort',
  'Hand 2 Hand Down East Food Bank',
  'Hope Mission Soup Kitchen',
  'Coastal Community Action Inc.',
  'Second Blessings Community Outreach & Thrift Store',
  'Jeremiah 33:3 Ministries – Down East Thrift Store',
  'Project Christmas Cheer',
  'Salvation Army',
  'Family Promise of Carteret County',
  'Crystal Coast Habitat for Humanity',
  'St. James United Methodist Church',
  'Atlantic House',
  'Coastal Carolina Center for Women''s Ministries',
  'Guardian ad Litem Program',
  'Carteret County DSS – Child Welfare',
  'Carteret County Partnership for Children',
  'Sweet Tea & Chai Society',
  'Boys & Girls Clubs of Coastal Carolina',
  'YouthLife',
  'The Bridge Down East',
  'Carteret County Public School Foundation',
  'Crystal Coast Autism Center',
  'Take A Kid Fishing Foundation',
  'Carteret Community College Foundation',
  'Camp Albemarle (YMCA Camping & Retreat)',
  'Leon Mann Jr. Enrichment Center',
  'Crystal Coast Hospice House',
  'Hospice of Carteret County',
  'Meals on Wheels',
  'Brookdale Senior Living',
  'Pruitt Crystal Coast',
  'Embassy Healthcare',
  'Croatan Ridge',
  'Pine Knoll Shores Council on Successful Aging',
  'Carteret County Humane Society',
  'Outer Banks Wildlife Shelter (OWLS)',
  'Misplaced Mutts',
  'Island Cat Allies',
  'Protectors of Homeless Pets of Carteret County',
  'NC Coastal Federation',
  'Bogue Banks Surfrider Foundation',
  'Litter Free Land & Sea',
  'Fort Macon State Park',
  'Cape Lookout National Seashore',
  'Foundation for Shackleford Horses',
  'Sierra Club – Crystal Coast Group',
  'Core Sound Waterfowl Museum',
  'NC Aquarium at Pine Knoll Shores',
  'Carteret County Domestic Violence Program',
  'Carteret SPEAK',
  'Broad Street Clinic',
  'Carteret Health Care Foundation',
  'COACH Hope',
  'Coastal Pregnancy Care Center',
  'La Leche League of Carteret County',
  'American Red Cross – Coastal Plains Chapter',
  'Carteret County Veterans Services Office',
  'Carteret Warriors for Recovery',
  'Hope for the Warriors',
  'Carteret Long Term Recovery Alliance (CLTRA)',
  'Peer Overdose Response Team (PORT)',
  'Station Club / Easterseals',
  'League of Women Voters of Carteret County',
  'Carteret Literacy Council',
  'Carteret Community Foundation',
  'Carteret County Council for Women',
  'Queen Street Heritage Foundation',
  'NC Seafood Festival',
  'Beaufort Historical Association',
  'History Museum of Carteret County',
  'Morehead City Historical Society',
  'NC Maritime Museum',
  'Core Sound Carvers Decoy Guild',
  'Arts Council of Carteret County',
  'American Music Festival',
  'Downtown Morehead City Revitalization Association',
  'Friends of Fort Macon'
);

-- 3. Real organizations (sector='other' hides them from FoodAssist).
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Food and Health Council', 'Morehead City', '', '', 'Sujata Bijou', '734-644-4852', 'fwrcfhc@gmail.com', 'https://facebook.com/CarteretFoodandHealthCouncil', '{}', 'free', true, false, 'other', 'food-insecurity', '{}', 'For full pantry list: drive.google.com/drive/u/4/folders/14lWHI8d5J99ibuv4PsFHdD3S9hjzV2FC');
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Martha''s Mission Cupboard', 'Morehead City', '', '', NULL, '252-726-1717', NULL, 'https://marthasmission.com', '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Matthew 25 Food Pantry & Thrift Store', 'Newport', '', '', NULL, '252-223-4727', NULL, 'https://stjamesnewportnc.com/community-ministry', '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Loaves and Fishes of Beaufort', 'Beaufort', '', '', NULL, '252-835-9035', NULL, 'https://loavesandfishesnc.org', '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Hand 2 Hand Down East Food Bank', 'Down East', '', '', NULL, '703-732-1608', NULL, NULL, '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Hope Mission Soup Kitchen', 'Morehead City', '1410 Bridges St, Morehead City, NC 28557', '28557', NULL, '252-240-2359', 'meals@hopemissionnc.org', 'https://hopemissionnc.org', '{}', 'free', true, false, 'other', 'food-insecurity', ARRAY['addiction-recovery']::text[], NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Coastal Community Action Inc.', 'Newport', '', '', NULL, '252-223-1630', NULL, 'https://ccaction.org', '{}', 'free', true, false, 'other', 'food-insecurity', ARRAY['housing-homelessness']::text[], NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Second Blessings Community Outreach & Thrift Store', 'County-wide', '', '', NULL, '252-726-7921', NULL, NULL, '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Jeremiah 33:3 Ministries – Down East Thrift Store', 'Down East', '', '', NULL, '252-418-0103', NULL, NULL, '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Project Christmas Cheer', 'County-wide', '', '', NULL, '252-247-7275', NULL, NULL, '{}', 'free', true, false, 'other', 'food-insecurity', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Salvation Army', 'Morehead City', '', '', NULL, '252-726-7147', NULL, 'https://salvationarmycarolinas.org', '{}', 'free', true, false, 'other', 'food-insecurity', ARRAY['housing-homelessness']::text[], NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Family Promise of Carteret County', 'Morehead City', '', '', NULL, '252-222-0019', NULL, 'https://familypromisecarteret.org', '{}', 'free', true, false, 'other', 'housing-homelessness', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Crystal Coast Habitat for Humanity', 'Newport', '', '', NULL, '252-223-2111', NULL, 'https://habitatcrystalcoast.org', '{}', 'free', true, false, 'other', 'housing-homelessness', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('St. James United Methodist Church', 'Newport', '', '', 'Pastor Joseph Park', '', NULL, 'https://stjamesnewportnc.com', '{}', 'free', true, false, 'other', 'housing-homelessness', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Atlantic House', 'Morehead City', '', '', NULL, '252-726-9732', NULL, NULL, '{}', 'free', true, false, 'other', 'housing-homelessness', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Coastal Carolina Center for Women''s Ministries', 'Newport', '', '', NULL, '252-764-0722', NULL, 'https://cwmhope.org/locations/pages/newport-nc-coastal-carolina-cwm', '{}', 'free', true, false, 'other', 'housing-homelessness', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Guardian ad Litem Program', 'County-wide', '', '', NULL, '', NULL, 'https://volunteerforgal.org', '{}', 'free', true, false, 'other', 'foster-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County DSS – Child Welfare', 'Beaufort', '', '', NULL, '252-728-3181', NULL, 'https://carteretcountync.gov', '{}', 'free', true, false, 'other', 'foster-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Partnership for Children', 'Morehead City', '', '', NULL, '252-727-0440', NULL, 'https://carteretkids.org', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Sweet Tea & Chai Society', 'County-wide', '', '', 'Jay Bijou', '734-218-6622', NULL, NULL, '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Boys & Girls Clubs of Coastal Carolina', 'Morehead City', '', '', NULL, '252-222-3007', NULL, 'https://bgccp.com/clubs/sunshine-lady-club/', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('YouthLife', 'County-wide', '', '', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('The Bridge Down East', 'Down East', '', '', NULL, '252-504-2581', NULL, 'https://thebridgedowneast.org', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Public School Foundation', 'County-wide', '', '', NULL, '252-728-4583', NULL, 'https://ccpsfoundation.com', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Crystal Coast Autism Center', 'Morehead City', '', '', NULL, '252-240-2255', NULL, 'https://ccautismcenter.org', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Take A Kid Fishing Foundation', 'Morehead City', '', '', NULL, '252-808-8303', NULL, 'https://takf.org', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Community College Foundation', 'Morehead City', '', '', NULL, '252-222-6000', NULL, 'https://carteret.edu/foundation', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Camp Albemarle (YMCA Camping & Retreat)', 'Newport', '', '', NULL, '252-726-4848', NULL, 'https://campalbemarle.org', '{}', 'free', true, false, 'other', 'youth-education', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Leon Mann Jr. Enrichment Center', 'Morehead City', '', '', NULL, '252-247-2626', NULL, 'https://carteretcountync.gov/168/Senior-Services', '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Crystal Coast Hospice House', 'Morehead City', '', '', NULL, '252-808-2244', NULL, 'https://crystalcoasthospicehouse.org', '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Hospice of Carteret County', 'Morehead City', '', '', NULL, '252-808-6085', NULL, NULL, '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Meals on Wheels', 'County-wide', '', '', NULL, '252-241-4292', NULL, 'https://mealsonwheelsamerica.org', '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Brookdale Senior Living', 'Newport area', '', '', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Pruitt Crystal Coast', 'County-wide', '', '', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Embassy Healthcare', 'County-wide', '', '', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Croatan Ridge', 'County-wide', '', '', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Pine Knoll Shores Council on Successful Aging', 'Pine Knoll Shores', '', '', NULL, '', NULL, 'https://pkscouncilonsuccessfulaging.com', '{}', 'free', true, false, 'other', 'senior-care', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Humane Society', 'Newport', '853 Hibbs Rd, Newport, NC 28570', '28570', NULL, '252-247-7744', 'cchsshelter@yahoo.com', 'https://cchsshelter.com', '{}', 'free', true, false, 'other', 'animals-wildlife', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Outer Banks Wildlife Shelter (OWLS)', 'Newport', '100 Wildlife Way, Newport, NC 28570', '28570', NULL, '252-240-1200', NULL, 'https://outerbankswildlifeshelter.com', '{}', 'free', true, false, 'other', 'animals-wildlife', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Misplaced Mutts', 'Beaufort', 'P.O. Box 58, Beaufort, NC 28516', '28516', NULL, '252-248-1217', 'MuttsMobile@MisplacedMutts.com', 'https://misplacedmutts.com', '{}', 'free', true, false, 'other', 'animals-wildlife', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Island Cat Allies', 'Emerald Isle', 'P.O. Box 4068, Emerald Isle, NC 28594', '28594', NULL, '252-354-7780', 'islandcatallies@gmail.com', 'https://islandcatallies.org', '{}', 'free', true, false, 'other', 'animals-wildlife', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Protectors of Homeless Pets of Carteret County', 'Emerald Isle', '', '', NULL, '252-723-0319', NULL, NULL, '{}', 'free', true, false, 'other', 'animals-wildlife', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('NC Coastal Federation', 'Newport', '3609 NC-24, Newport, NC 28570', '28570', 'Stacia Strong (Comms)', '252-393-8185', 'stacias@nccoast.org', 'https://nccoast.org', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Bogue Banks Surfrider Foundation', 'Bogue Banks', '', '', 'Sam Athey', '', NULL, 'https://nc.surfrider.org', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Litter Free Land & Sea', 'Carteret County', '', '', NULL, '252-648-7880', NULL, 'https://litterfreelandandsea.com', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Fort Macon State Park', 'Atlantic Beach', '', '', NULL, '252-726-3775', NULL, 'https://ncparks.gov/fort-macon-state-park', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Cape Lookout National Seashore', 'Harkers Island', '', '', NULL, '252-728-2250', NULL, 'https://nps.gov/calo', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Foundation for Shackleford Horses', 'Harkers Island', '', '', NULL, '252-728-6308', NULL, 'https://nps.gov/calo/learn/historyculture/shacklefordhorses.htm', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Sierra Club – Crystal Coast Group', 'County-wide', '', '', NULL, '', NULL, 'https://sierraclub.org', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Core Sound Waterfowl Museum', 'Harkers Island', '', '', NULL, '252-728-1500', NULL, 'https://coresound.com', '{}', 'free', true, false, 'other', 'environment', ARRAY['arts-history-culture']::text[], NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('NC Aquarium at Pine Knoll Shores', 'Pine Knoll Shores', '', '', NULL, '252-247-4003', NULL, 'https://ncaquariums.com/pine-knoll-shores', '{}', 'free', true, false, 'other', 'environment', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Domestic Violence Program', 'Morehead City', 'P.O. Box 2279, Morehead City, NC 28557', '28557', NULL, '252-726-2336', 'info@carteretdomesticviolence.com', 'https://carteretdomesticviolence.com', '{}', 'free', true, false, 'other', 'domestic-sexual-violence', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret SPEAK', 'County-wide', '', '', 'Caprice Pratt', '', NULL, NULL, '{}', 'free', true, false, 'other', 'domestic-sexual-violence', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Broad Street Clinic', 'Morehead City', '534 N 35th St Suite K, Morehead City, NC 28557', '28557', 'Lou Johnson (Director)', '252-726-4562', 'assistantdirector@broadstreetclinic.org', 'https://broadstreetclinic.org', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Health Care Foundation', 'Morehead City', '', '', NULL, '252-499-6646', NULL, 'https://carterethealth.org/giving', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('COACH Hope', 'Morehead City', '', '', NULL, '252-732-4522', NULL, 'https://facebook.com/p/COACH-HOPE-100064227413562', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Coastal Pregnancy Care Center', 'Morehead City', '', '', NULL, '252-247-2273', NULL, 'https://cpccenter.org', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('La Leche League of Carteret County', 'County-wide', '', '', NULL, '984-219-8808', NULL, 'https://llli.org', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('American Red Cross – Coastal Plains Chapter', 'Greenville (serves Carteret)', '', '', NULL, '252-355-3800', NULL, 'https://redcross.org', '{}', 'free', true, false, 'other', 'health-care-access', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Veterans Services Office', 'Beaufort', '', '', NULL, '252-728-8440', NULL, 'https://carteretcountync.gov', '{}', 'free', true, false, 'other', 'veterans', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Warriors for Recovery', 'Morehead City', '', '', NULL, '252-432-6861', 'carteretwarriors4recovery@gmail.com', 'https://cw4r.org', '{}', 'free', true, false, 'other', 'veterans', ARRAY['addiction-recovery']::text[], NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Hope for the Warriors', 'National (local support)', '', '', NULL, '877-246-7349', NULL, 'https://hopeforthewarriors.org', '{}', 'free', true, false, 'other', 'veterans', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Long Term Recovery Alliance (CLTRA)', 'Beaufort', '2101 Live Oak St, Beaufort, NC 28516', '28516', NULL, '', 'carteretltra@gmail.com', 'https://carteretltra.org', '{}', 'free', true, false, 'other', 'addiction-recovery', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Peer Overdose Response Team (PORT)', 'Morehead City', '', '', NULL, '252-222-3888', NULL, NULL, '{}', 'free', true, false, 'other', 'addiction-recovery', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Station Club / Easterseals', 'Morehead City', '', '', NULL, '252-808-7597', NULL, 'https://eastersealsucp.com', '{}', 'free', true, false, 'other', 'addiction-recovery', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('League of Women Voters of Carteret County', 'County-wide', '', '', NULL, '252-728-6385', NULL, 'https://lwvnc.org', '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Literacy Council', 'Morehead City', '', '', NULL, '252-808-2020', NULL, 'https://carteretliteracycouncil.org', '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret Community Foundation', 'County-wide', '', '', NULL, '252-240-0011', NULL, 'https://nccommunityfoundation.org/affiliate/carteret-community-foundation', '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Carteret County Council for Women', 'County-wide', '', '', NULL, '', NULL, 'https://cccwomen.org', '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Queen Street Heritage Foundation', 'Beaufort', 'P.O. Box 2213, Beaufort, NC 28516', '28516', NULL, '', NULL, NULL, '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('NC Seafood Festival', 'Morehead City', '', '', NULL, '252-726-6273', NULL, NULL, '{}', 'free', true, false, 'other', 'civic-engagement', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Beaufort Historical Association', 'Beaufort', '', '', NULL, '252-728-5225', NULL, 'https://beauforthistoricsite.org', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('History Museum of Carteret County', 'Morehead City', '', '', NULL, '252-247-7533', NULL, 'https://carterethistory.org', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Morehead City Historical Society', 'Morehead City', '', '', NULL, '703-405-3597', NULL, NULL, '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('NC Maritime Museum', 'Beaufort', '', '', NULL, '252-728-7317', NULL, 'https://ncmaritime.org', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Core Sound Carvers Decoy Guild', 'Davis (Down East)', '', '', NULL, '252-342-9811', NULL, 'https://decoyguild.com', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Arts Council of Carteret County', 'Morehead City', '', '', NULL, '252-726-7550', NULL, 'https://artscouncilcarteret.org', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('American Music Festival', 'Beaufort', '', '', NULL, '252-728-6152', NULL, 'https://americanmusicfestival.org', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Downtown Morehead City Revitalization Association', 'Morehead City', '', '', NULL, '252-808-0440', NULL, 'https://downtownmoreheadcity.com', '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);
INSERT INTO organizations (name, town, address, zip, contact_name, phone, email, website, assistance_types, cost, is_active, spanish_available, sector, sector_slug, additional_sector_slugs, comments)
  VALUES ('Friends of Fort Macon', 'Atlantic Beach', '', '', NULL, '252-354-5132', NULL, NULL, '{}', 'free', true, false, 'other', 'arts-history-culture', '{}', NULL);

-- 4. Volunteer opportunities (verbatim from the directory).
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Food and Health Council', 'Coalition building with faith communities, food pantry outreach and coordination, program support for food access initiatives', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Carteret Food and Health Council' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Martha''s Mission Cupboard', 'Food pantry volunteering: stocking shelves, sorting donations, assisting clients; donation drives for non-perishable goods', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Martha''s Mission Cupboard' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Matthew 25 Food Pantry & Thrift Store', 'Food pantry support (open Mon & Thu); sorting and distributing food to families; thrift store volunteering', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Matthew 25 Food Pantry & Thrift Store' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Loaves and Fishes of Beaufort', 'Food ministry and community meal outreach', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Loaves and Fishes of Beaufort' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Hand 2 Hand Down East Food Bank', 'Food bank volunteering; collecting and distributing food to Down East families', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Hand 2 Hand Down East Food Bank' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Hope Mission Soup Kitchen', 'Soup kitchen meals Mon–Sat 11am–12:30pm; volunteer groups welcome to prepare/serve Saturday lunch; Meals on Wheels delivery; donation drives', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Hope Mission Soup Kitchen' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Coastal Community Action Inc.', 'Anti-poverty programs, food assistance, emergency services; call to inquire about volunteer opportunities', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Coastal Community Action Inc.' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Second Blessings Community Outreach & Thrift Store', 'Thrift store volunteering; food and goods distribution; community outreach support', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Second Blessings Community Outreach & Thrift Store' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Jeremiah 33:3 Ministries – Down East Thrift Store', 'Community thrift store and outreach ministry; volunteer opportunities in store and food/goods distribution', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Jeremiah 33:3 Ministries – Down East Thrift Store' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Project Christmas Cheer', 'Annual holiday gift and toy drive for families in need; volunteers needed for collection, sorting, and distribution', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Project Christmas Cheer' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Salvation Army', 'Food pantry, emergency assistance, disaster relief; volunteer opportunities year-round and especially during holiday Red Kettle campaign', true, 'food-insecurity'
  FROM organizations o WHERE o.name = 'Salvation Army' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Family Promise of Carteret County', 'Host families for transitional housing guests; meal preparation and serving; childcare support; fundraising events; volunteer application online', true, 'housing-homelessness'
  FROM organizations o WHERE o.name = 'Family Promise of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Crystal Coast Habitat for Humanity', 'Construction volunteer days (no experience needed, 16+ for build sites); ReStore donation center volunteering: sorting, stocking, retail floor', true, 'housing-homelessness'
  FROM organizations o WHERE o.name = 'Crystal Coast Habitat for Humanity' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'St. James United Methodist Church', 'Emergency food and household goods support; Matthew 25 Food Pantry; community outreach ministry', true, 'housing-homelessness'
  FROM organizations o WHERE o.name = 'St. James United Methodist Church' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Atlantic House', 'Transitional housing and reentry support services; call to inquire about volunteer opportunities', true, 'housing-homelessness'
  FROM organizations o WHERE o.name = 'Atlantic House' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Coastal Carolina Center for Women''s Ministries', 'Support services for women in crisis including housing; call to inquire about current volunteer needs', true, 'housing-homelessness'
  FROM organizations o WHERE o.name = 'Coastal Carolina Center for Women''s Ministries' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Guardian ad Litem Program', 'Serve as a court-appointed advocate for children in foster care; complete application at volunteerforgal.org; mandatory training provided; very high impact', true, 'foster-care'
  FROM organizations o WHERE o.name = 'Guardian ad Litem Program' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County DSS – Child Welfare', 'Foster parent recruitment and support; contact DSS to learn about becoming a foster family or supporting foster families', true, 'foster-care'
  FROM organizations o WHERE o.name = 'Carteret County DSS – Child Welfare' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Partnership for Children', 'Early childhood advocacy, literacy programs, Smart Start initiatives; contact to inquire about volunteer roles', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Carteret County Partnership for Children' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Sweet Tea & Chai Society', 'Youth mentoring, cultural programming, and community-building activities for young people in Carteret County', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Sweet Tea & Chai Society' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Boys & Girls Clubs of Coastal Carolina', 'After-school tutoring and homework help; activity and enrichment facilitation; mentoring; contact club for volunteer orientation requirements', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Boys & Girls Clubs of Coastal Carolina' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'YouthLife', 'Youth mentoring, discipleship, and life skills programs; contact via Facebook to inquire about volunteer opportunities', true, 'youth-education'
  FROM organizations o WHERE o.name = 'YouthLife' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'The Bridge Down East', 'Youth outreach, mentoring, and support services for Down East youth; contact to discuss volunteer roles', true, 'youth-education'
  FROM organizations o WHERE o.name = 'The Bridge Down East' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Public School Foundation', 'Educator grant programs, school supply initiatives, and literacy projects; fundraising event volunteers', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Carteret County Public School Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Crystal Coast Autism Center', 'Support programs for individuals with autism and their families; contact center to learn about volunteer opportunities', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Crystal Coast Autism Center' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Take A Kid Fishing Foundation', 'Annual fishing events connecting youth with mentors; volunteers needed for event day logistics, registration, and fishing guides', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Take A Kid Fishing Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Community College Foundation', 'Scholarship fundraising events; community education programs; contact foundation to inquire about volunteer and advisory roles', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Carteret Community College Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Camp Albemarle (YMCA Camping & Retreat)', 'Camp programming support; facility work days; retreat and event volunteers; youth camp scholarship support; contact camp to inquire', true, 'youth-education'
  FROM organizations o WHERE o.name = 'Camp Albemarle (YMCA Camping & Retreat)' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Leon Mann Jr. Enrichment Center', 'County senior center: day programs, fitness, meals, social activities; volunteers welcome to lead activities, assist with programming, or provide transportation', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Leon Mann Jr. Enrichment Center' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Crystal Coast Hospice House', 'Companion volunteers sit with patients; errand and administrative support; must complete volunteer training', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Crystal Coast Hospice House' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Hospice of Carteret County', 'Volunteer companions for patients; caregiver respite support; bereavement program assistance; contact to inquire about training', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Hospice of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Meals on Wheels', 'Deliver hot meals to homebound seniors on regular or substitute routes; requires background check; leave message to sign up', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Meals on Wheels' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Brookdale Senior Living', 'Visitor and companion volunteer program; activity facilitation; contact facility directly', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Brookdale Senior Living' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Pruitt Crystal Coast', 'Companion visits, holiday events, and activity support; contact facility to arrange visits', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Pruitt Crystal Coast' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Embassy Healthcare', 'Social activity facilitation, holiday visits, and companion programs; contact facility to learn about volunteer opportunities', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Embassy Healthcare' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Croatan Ridge', 'Resident activities, social visits, and entertainment programs; contact facility to discuss volunteer involvement', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Croatan Ridge' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Pine Knoll Shores Council on Successful Aging', 'Community programs and resource hub connecting seniors to services county-wide; contact to inquire about volunteer and support roles', true, 'senior-care'
  FROM organizations o WHERE o.name = 'Pine Knoll Shores Council on Successful Aging' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Humane Society', 'Dog walking and socialization (18+, or 15–17 with adult supervision); kennel cleaning; laundry and dishes; Adopt-a-Thon event support; foster care; animal transport; apply via VicNet', true, 'animals-wildlife'
  FROM organizations o WHERE o.name = 'Carteret County Humane Society' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Outer Banks Wildlife Shelter (OWLS)', 'Wildlife care: animal feeding, enclosure cleaning, rehabilitation assistance; education program support; fundraising; entirely volunteer-run; contact shelter to inquire', true, 'animals-wildlife'
  FROM organizations o WHERE o.name = 'Outer Banks Wildlife Shelter (OWLS)' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Misplaced Mutts', 'Foster care for rescue dogs and cats; transport volunteers; adoption event support; mobile spay/neuter clinic assistance', true, 'animals-wildlife'
  FROM organizations o WHERE o.name = 'Misplaced Mutts' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Island Cat Allies', 'TNR support; daily colony caretaking; foster care for kittens; adoption event support at PetSmart Morehead City; contact via email', true, 'animals-wildlife'
  FROM organizations o WHERE o.name = 'Island Cat Allies' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Protectors of Homeless Pets of Carteret County', 'Fundraising support for CCHS medical and spay/neuter programs; event volunteers', true, 'animals-wildlife'
  FROM organizations o WHERE o.name = 'Protectors of Homeless Pets of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'NC Coastal Federation', 'Oyster reef and living shoreline restoration work days; coastal cleanup events; oyster shell recycling program; habitat planting; volunteer calendar on website', true, 'environment'
  FROM organizations o WHERE o.name = 'NC Coastal Federation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Bogue Banks Surfrider Foundation', 'Beach Guardians monthly cleanup program; coastal advocacy; ocean-friendly business outreach; contact local chapter to join', true, 'environment'
  FROM organizations o WHERE o.name = 'Bogue Banks Surfrider Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Litter Free Land & Sea', 'Organized cleanups of beaches, roadsides, and waterways; group and individual opportunities', true, 'environment'
  FROM organizations o WHERE o.name = 'Litter Free Land & Sea' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Fort Macon State Park', 'Park cleanup, trail maintenance, and interpretive program support; Friends of Fort Macon (252-354-5132)', true, 'environment'
  FROM organizations o WHERE o.name = 'Fort Macon State Park' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Cape Lookout National Seashore', 'Beach and trail maintenance; shorebird nesting site monitoring; ferry-access volunteer work days; contact park volunteer coordinator', true, 'environment'
  FROM organizations o WHERE o.name = 'Cape Lookout National Seashore' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Foundation for Shackleford Horses', 'Fundraising events to support wild horse monitoring and habitat protection; contact foundation to learn about volunteer roles', true, 'environment'
  FROM organizations o WHERE o.name = 'Foundation for Shackleford Horses' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Sierra Club – Crystal Coast Group', 'Environmental advocacy, nature hikes, and community outreach; contact national Sierra Club to connect with local chapter', true, 'environment'
  FROM organizations o WHERE o.name = 'Sierra Club – Crystal Coast Group' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Core Sound Waterfowl Museum', 'Museum and cultural heritage site celebrating Down East traditions; volunteer docents, event support, educational program assistance', true, 'environment'
  FROM organizations o WHERE o.name = 'Core Sound Waterfowl Museum' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'NC Aquarium at Pine Knoll Shores', 'Volunteer naturalists and education program assistants; special event volunteers; contact aquarium volunteer coordinator', true, 'environment'
  FROM organizations o WHERE o.name = 'NC Aquarium at Pine Knoll Shores' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Domestic Violence Program', '24/7 Hotline: 252-728-3788. Volunteer roles: clerks at Caroline''s Collectables thrift store; office support; court advocacy (trained volunteers); transportation assistance; small maintenance repairs; board membership. Download application from website.', true, 'domestic-sexual-violence'
  FROM organizations o WHERE o.name = 'Carteret County Domestic Violence Program' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret SPEAK', 'Sexual assault prevention education and advocacy; community awareness events; survivor support programs; contact Caprice Pratt to discuss volunteer opportunities', true, 'domestic-sexual-violence'
  FROM organizations o WHERE o.name = 'Carteret SPEAK' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Broad Street Clinic', 'Free clinic serving low-income patients; clinical volunteers (doctors, NPs, nurses) Mon–Wed mornings; non-clinical: front desk, phones, supply organization, pharmacy support; complete volunteer form on website', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'Broad Street Clinic' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Health Care Foundation', 'Fundraising event volunteers; community health initiative support; contact foundation office', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'Carteret Health Care Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'COACH Hope', 'Chronic disease support and caregiver relief programs; contact via phone or Facebook', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'COACH Hope' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Coastal Pregnancy Care Center', 'Client support, baby supply donations, administrative assistance; contact center to learn about volunteer roles', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'Coastal Pregnancy Care Center' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'La Leche League of Carteret County', 'Breastfeeding peer support for new mothers; volunteer as a certified Leader after training; community outreach events', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'La Leche League of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'American Red Cross – Coastal Plains Chapter', 'Disaster response volunteers; blood drive coordination; community education (CPR/First Aid training); contact Greenville office or register online', true, 'health-care-access'
  FROM organizations o WHERE o.name = 'American Red Cross – Coastal Plains Chapter' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Veterans Services Office', 'Benefits navigation and claims assistance for veterans; support staff volunteers for events; contact office to inquire', true, 'veterans'
  FROM organizations o WHERE o.name = 'Carteret County Veterans Services Office' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Warriors for Recovery', 'Household replenishment drives; education and outreach events; entirely volunteer-run; contact by email or phone', true, 'veterans'
  FROM organizations o WHERE o.name = 'Carteret Warriors for Recovery' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Hope for the Warriors', 'Awareness and fundraising events supporting veteran well-being programs; contact national office for local activities', true, 'veterans'
  FROM organizations o WHERE o.name = 'Hope for the Warriors' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Long Term Recovery Alliance (CLTRA)', 'Disaster and hurricane recovery case management; home repair and construction volunteer days; donation drives; contact via email to join volunteer roster', true, 'addiction-recovery'
  FROM organizations o WHERE o.name = 'Carteret Long Term Recovery Alliance (CLTRA)' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Peer Overdose Response Team (PORT)', 'Overdose response and peer support services; contact to learn about volunteer and outreach opportunities', true, 'addiction-recovery'
  FROM organizations o WHERE o.name = 'Peer Overdose Response Team (PORT)' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Station Club / Easterseals', 'Day programs and support services for adults with disabilities; contact to learn about volunteer involvement and event support', true, 'addiction-recovery'
  FROM organizations o WHERE o.name = 'Station Club / Easterseals' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'League of Women Voters of Carteret County', 'Voter registration drives; candidate forum organization and moderation; voter education outreach; election observer training', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'League of Women Voters of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Literacy Council', 'Adult literacy tutoring (free training provided); ESL tutoring; administrative support; contact council to begin tutor training', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'Carteret Literacy Council' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret Community Foundation', 'Grant-making, nonprofit capacity building, and community events; contact to inquire about volunteer and advisory opportunities', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'Carteret Community Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Carteret County Council for Women', 'Advocacy and programs supporting women in Carteret County; contact to find current activities and volunteer needs', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'Carteret County Council for Women' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Queen Street Heritage Foundation', 'Historic preservation and community events honoring African American heritage in Beaufort; contact via mail', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'Queen Street Heritage Foundation' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'NC Seafood Festival', 'Annual fall festival; large volunteer force needed for logistics, booths, and crowd management; contact festival office to sign up', true, 'civic-engagement'
  FROM organizations o WHERE o.name = 'NC Seafood Festival' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Beaufort Historical Association', 'Docent and tour guide volunteers; special event support; historic preservation projects', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Beaufort Historical Association' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'History Museum of Carteret County', 'Museum docent and gallery assistant volunteers; event support; archival and research assistance', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'History Museum of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Morehead City Historical Society', 'Local history preservation and community events; contact to learn about volunteer involvement', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Morehead City Historical Society' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'NC Maritime Museum', 'Volunteer docents and educators; boat shop and model building volunteers; special event support; contact Friends of the NC Maritime Museum (252-728-1638)', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'NC Maritime Museum' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Core Sound Carvers Decoy Guild', 'Traditional woodcarving heritage preservation; event and exhibit volunteers; call after 5pm to reach contact', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Core Sound Carvers Decoy Guild' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Arts Council of Carteret County', 'Event volunteers for arts programs and gallery events; outreach and education support', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Arts Council of Carteret County' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'American Music Festival', 'Annual music festival volunteers needed for logistics, ticketing, venue setup, and crowd management', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'American Music Festival' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Downtown Morehead City Revitalization Association', 'Community events, beautification projects, and downtown programming; contact to learn about volunteer opportunities', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Downtown Morehead City Revitalization Association' AND o.sector = 'other';
INSERT INTO volunteer_needs (organization_id, title, description, is_active, sector_slug)
  SELECT o.id, 'Friends of Fort Macon', 'Historic fort preservation and interpretive program volunteers', true, 'arts-history-culture'
  FROM organizations o WHERE o.name = 'Friends of Fort Macon' AND o.sector = 'other';

-- Seed the 13 sectors. Idempotent via ON CONFLICT.
INSERT INTO sectors (slug, name, name_es, short_description, short_description_es, accent_color, numeral, display_order, status) VALUES
  ('food-insecurity',          'Food Insecurity',            'Inseguridad Alimentaria',          'Food pantries, meal programs, grocery assistance across Carteret County.', 'Despensas, comidas y asistencia alimentaria en el condado de Carteret.', '#B8622A', '01',  1, 'active'),
  ('housing-homelessness',     'Housing & Homelessness',     'Vivienda y Personas sin Hogar',    'Shelter, rental assistance, transitional housing, and outreach.',          'Albergues, asistencia de alquiler, vivienda transitoria y alcance.',    '#4A6B82', '02',  2, 'forming'),
  ('foster-care',              'Foster Care',                'Cuidado de Crianza',               'Support for foster families, youth in care, and adoption services.',      'Apoyo a familias de crianza, jóvenes en cuidado y servicios de adopción.', '#A85569', '03',  3, 'forming'),
  ('youth-education',          'Youth & Education',          'Jóvenes y Educación',              'Tutoring, after-school, mentorship, literacy, and scholarships.',         'Tutorías, programas extraescolares, mentoría, alfabetización y becas.',  '#4A6E4F', '04',  4, 'forming'),
  ('senior-care',              'Senior Care',                'Cuidado de Personas Mayores',      'Meals on wheels, visitor programs, caregiver respite, senior centers.',   'Comidas a domicilio, acompañamiento y centros para personas mayores.',   '#7F659A', '05',  5, 'forming'),
  ('animals-wildlife',         'Animals & Wildlife',         'Animales y Vida Silvestre',        'Shelters, rescue, rehabilitation, and wildlife preservation.',            'Refugios, rescate, rehabilitación y conservación de vida silvestre.',    '#6B7A3F', '06',  6, 'forming'),
  ('environment',              'Environment',                'Medio Ambiente',                   'Coastal cleanup, conservation, education, and advocacy.',                 'Limpieza costera, conservación, educación y defensa ambiental.',         '#2E5D4F', '07',  7, 'forming'),
  ('domestic-sexual-violence', 'Domestic & Sexual Violence', 'Violencia Doméstica y Sexual',     'Crisis lines, shelter, counseling, and court advocacy. Confidential.',    'Líneas de crisis, albergue, consejería y defensoría. Confidencial.',    '#6B3F5E', '08',  8, 'forming'),
  ('health-care-access',       'Health Care Access',         'Acceso a Atención Médica',         'Free clinics, prescription help, dental, mental health access.',          'Clínicas gratuitas, medicamentos, salud dental y salud mental.',         '#A05842', '09',  9, 'forming'),
  ('veterans',                 'Veterans',                   'Veteranos',                        'Benefits, housing, employment, and peer support for veterans.',           'Beneficios, vivienda, empleo y apoyo entre pares para veteranos.',       '#2C4763', '10', 10, 'forming'),
  ('addiction-recovery',       'Addiction & Recovery',       'Adicción y Recuperación',          'Recovery support, harm reduction, and peer-led groups.',                  'Apoyo a la recuperación, reducción de daños y grupos de pares.',         '#9D6A3C', '11', 11, 'forming'),
  ('civic-engagement',         'Civic Engagement',           'Compromiso Cívico',                'Voter registration, town hall hosting, community organizing.',            'Registro de votantes, foros públicos y organización comunitaria.',       '#833932', '12', 12, 'forming'),
  ('arts-history-culture',     'Arts, History & Culture',    'Artes, Historia y Cultura',        'Museums, historic sites, performing arts, and public art.',               'Museos, lugares históricos, artes escénicas y arte público.',            '#A8832E', '13', 13, 'forming')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_es = EXCLUDED.name_es,
  short_description = EXCLUDED.short_description,
  short_description_es = EXCLUDED.short_description_es,
  accent_color = EXCLUDED.accent_color,
  numeral = EXCLUDED.numeral,
  display_order = EXCLUDED.display_order;

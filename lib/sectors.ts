/**
 * Canonical sector definitions. The ordering here drives rendering order on the
 * homepage and navigation. The `slug` is the URL segment and MUST match the
 * `slug` column in the `sectors` table in Supabase (see migration 001).
 *
 * The accent color pulls from design tokens in globals.css and is also stored
 * on the DB row — the client-side copy is for static pages where the full
 * sector hasn't loaded yet, and for type-safety on sector-specific UI.
 */

export type SectorSlug =
  | 'food-insecurity'
  | 'housing-homelessness'
  | 'foster-care'
  | 'youth-education'
  | 'senior-care'
  | 'animals-wildlife'
  | 'environment'
  | 'domestic-sexual-violence'
  | 'health-care-access'
  | 'veterans'
  | 'addiction-recovery'
  | 'civic-engagement'
  | 'arts-history-culture';

export interface SectorMeta {
  slug: SectorSlug;
  name: string;
  nameEs: string;
  shortDescription: string;
  shortDescriptionEs: string;
  accentVar: string;
  accentHex: string;
  numeral: string;
}

export const SECTORS: SectorMeta[] = [
  {
    slug: 'food-insecurity',
    name: 'Food Insecurity',
    nameEs: 'Inseguridad Alimentaria',
    shortDescription: 'Food pantries, meal programs, grocery assistance across Carteret County.',
    shortDescriptionEs: 'Despensas, comidas y asistencia alimentaria en el condado de Carteret.',
    accentVar: '--color-sector-food',
    accentHex: '#B8622A',
    numeral: '01',
  },
  {
    slug: 'housing-homelessness',
    name: 'Housing & Homelessness',
    nameEs: 'Vivienda y Personas sin Hogar',
    shortDescription: 'Shelter, rental assistance, transitional housing, and outreach.',
    shortDescriptionEs: 'Albergues, asistencia de alquiler, vivienda transitoria y alcance.',
    accentVar: '--color-sector-housing',
    accentHex: '#4A6B82',
    numeral: '02',
  },
  {
    slug: 'foster-care',
    name: 'Foster Care',
    nameEs: 'Cuidado de Crianza',
    shortDescription: 'Support for foster families, youth in care, and adoption services.',
    shortDescriptionEs: 'Apoyo a familias de crianza, jóvenes en cuidado y servicios de adopción.',
    accentVar: '--color-sector-foster',
    accentHex: '#A85569',
    numeral: '03',
  },
  {
    slug: 'youth-education',
    name: 'Youth & Education',
    nameEs: 'Jóvenes y Educación',
    shortDescription: 'Tutoring, after-school, mentorship, literacy, scholarships.',
    shortDescriptionEs: 'Tutorías, programas extraescolares, mentoría, alfabetización y becas.',
    accentVar: '--color-sector-youth',
    accentHex: '#4A6E4F',
    numeral: '04',
  },
  {
    slug: 'senior-care',
    name: 'Senior Care',
    nameEs: 'Cuidado de Personas Mayores',
    shortDescription: 'Meals on wheels, visitor programs, caregiver respite, senior centers.',
    shortDescriptionEs: 'Comidas a domicilio, acompañamiento y centros para personas mayores.',
    accentVar: '--color-sector-senior',
    accentHex: '#7F659A',
    numeral: '05',
  },
  {
    slug: 'animals-wildlife',
    name: 'Animals & Wildlife',
    nameEs: 'Animales y Vida Silvestre',
    shortDescription: 'Shelters, rescue, rehabilitation, and wildlife preservation.',
    shortDescriptionEs: 'Refugios, rescate, rehabilitación y conservación de vida silvestre.',
    accentVar: '--color-sector-animals',
    accentHex: '#6B7A3F',
    numeral: '06',
  },
  {
    slug: 'environment',
    name: 'Environment',
    nameEs: 'Medio Ambiente',
    shortDescription: 'Coastal cleanup, conservation, education, and advocacy.',
    shortDescriptionEs: 'Limpieza costera, conservación, educación y defensa ambiental.',
    accentVar: '--color-sector-environment',
    accentHex: '#2E5D4F',
    numeral: '07',
  },
  {
    slug: 'domestic-sexual-violence',
    name: 'Domestic & Sexual Violence',
    nameEs: 'Violencia Doméstica y Sexual',
    shortDescription: 'Crisis lines, shelter, counseling, and court advocacy. Confidential.',
    shortDescriptionEs: 'Líneas de crisis, albergue, consejería y defensoría. Confidencial.',
    accentVar: '--color-sector-violence',
    accentHex: '#6B3F5E',
    numeral: '08',
  },
  {
    slug: 'health-care-access',
    name: 'Health Care Access',
    nameEs: 'Acceso a Atención Médica',
    shortDescription: 'Free clinics, prescription help, dental, mental health access.',
    shortDescriptionEs: 'Clínicas gratuitas, medicamentos, salud dental y salud mental.',
    accentVar: '--color-sector-health',
    accentHex: '#A05842',
    numeral: '09',
  },
  {
    slug: 'veterans',
    name: 'Veterans',
    nameEs: 'Veteranos',
    shortDescription: 'Benefits, housing, employment, and peer support for veterans.',
    shortDescriptionEs: 'Beneficios, vivienda, empleo y apoyo entre pares para veteranos.',
    accentVar: '--color-sector-veterans',
    accentHex: '#2C4763',
    numeral: '10',
  },
  {
    slug: 'addiction-recovery',
    name: 'Addiction & Recovery',
    nameEs: 'Adicción y Recuperación',
    shortDescription: 'Recovery support, harm reduction, and peer-led groups.',
    shortDescriptionEs: 'Apoyo a la recuperación, reducción de daños y grupos de pares.',
    accentVar: '--color-sector-recovery',
    accentHex: '#9D6A3C',
    numeral: '11',
  },
  {
    slug: 'civic-engagement',
    name: 'Civic Engagement',
    nameEs: 'Compromiso Cívico',
    shortDescription: 'Voter registration, town hall hosting, community organizing.',
    shortDescriptionEs: 'Registro de votantes, foros públicos y organización comunitaria.',
    accentVar: '--color-sector-civic',
    accentHex: '#833932',
    numeral: '12',
  },
  {
    slug: 'arts-history-culture',
    name: 'Arts, History & Culture',
    nameEs: 'Artes, Historia y Cultura',
    shortDescription: 'Museums, historic sites, performing arts, and public art.',
    shortDescriptionEs: 'Museos, lugares históricos, artes escénicas y arte público.',
    accentVar: '--color-sector-arts',
    accentHex: '#A8832E',
    numeral: '13',
  },
];

export function sectorBySlug(slug: string): SectorMeta | undefined {
  return SECTORS.find((s) => s.slug === slug);
}

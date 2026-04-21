/**
 * Homepage — Server Component.
 * Pulls sector rows, org counts per sector, and volunteer need counts per sector.
 */
import { createClient } from '@/lib/supabase/server';
import { getSectors } from '@/lib/supabase/queries';
import { Hero } from '@/components/home/Hero';
import { SectorIndex } from '@/components/home/SectorIndex';
import { DualCTA } from '@/components/home/DualCTA';
import { CommitteeBand } from '@/components/home/CommitteeBand';

export const revalidate = 300;

export default async function HomePage() {
  const supabase = await createClient();

  const sectors = await getSectors(supabase);

  // Bulk count organizations and volunteer_needs per sector_slug in one round-trip each.
  const [orgsRes, needsRes, townsRes] = await Promise.all([
    supabase.from('organizations').select('sector_slug').eq('is_active', true),
    supabase.from('volunteer_needs').select('sector_slug').eq('is_active', true),
    supabase.from('organizations').select('town').eq('is_active', true),
  ]);

  const orgCountsBySector: Record<string, number> = {};
  for (const row of (orgsRes.data ?? []) as Array<{ sector_slug: string | null }>) {
    const slug = row.sector_slug ?? 'food-insecurity';
    orgCountsBySector[slug] = (orgCountsBySector[slug] ?? 0) + 1;
  }

  const needCountsBySector: Record<string, number> = {};
  for (const row of (needsRes.data ?? []) as Array<{ sector_slug: string | null }>) {
    const slug = row.sector_slug ?? 'food-insecurity';
    needCountsBySector[slug] = (needCountsBySector[slug] ?? 0) + 1;
  }

  const totalOrgs = orgsRes.data?.length ?? 0;
  const towns = new Set<string>();
  for (const row of (townsRes.data ?? []) as Array<{ town: string | null }>) {
    if (row.town) towns.add(row.town);
  }

  return (
    <>
      <Hero sectorCount={sectors.length || 13} orgCount={totalOrgs} townCount={towns.size} />
      <CommitteeBand />
      <SectorIndex
        sectors={sectors}
        orgCountsBySector={orgCountsBySector}
        needCountsBySector={needCountsBySector}
      />
      <DualCTA />
    </>
  );
}

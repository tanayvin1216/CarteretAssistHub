import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSectors } from '@/lib/supabase/queries';
import { SectorsIndexClient } from '@/components/sectors/SectorsIndexClient';

export const revalidate = 300;

export default async function SectorsIndexPage() {
  const supabase = await createClient();
  const sectors = await getSectors(supabase);

  const [orgsRes, needsRes] = await Promise.all([
    supabase.from('organizations').select('sector_slug').eq('is_active', true),
    supabase.from('volunteer_needs').select('sector_slug').eq('is_active', true),
  ]);

  const orgCounts: Record<string, number> = {};
  for (const row of (orgsRes.data ?? []) as Array<{ sector_slug: string | null }>) {
    const slug = row.sector_slug ?? 'food-insecurity';
    orgCounts[slug] = (orgCounts[slug] ?? 0) + 1;
  }
  const needCounts: Record<string, number> = {};
  for (const row of (needsRes.data ?? []) as Array<{ sector_slug: string | null }>) {
    const slug = row.sector_slug ?? 'food-insecurity';
    needCounts[slug] = (needCounts[slug] ?? 0) + 1;
  }

  return (
    <SectorsIndexClient sectors={sectors} orgCounts={orgCounts} needCounts={needCounts} />
  );
}

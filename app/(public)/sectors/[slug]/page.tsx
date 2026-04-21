import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getSectorBySlug,
  getSubcommitteeLeads,
  getSectorActivities,
  getOrganizationsBySector,
  getVolunteerNeedsBySector,
} from '@/lib/supabase/queries';
import { SectorDetail } from '@/components/sectors/SectorDetail';
import { sectorBySlug } from '@/lib/sectors';

export const revalidate = 300;

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = sectorBySlug(slug);
  if (!meta) notFound();

  const supabase = await createClient();
  const sector = await getSectorBySlug(supabase, slug);
  if (!sector) {
    // DB row missing — surface a minimal view from the local meta so nothing looks broken.
    return (
      <SectorDetail
        meta={meta}
        sector={null}
        leads={[]}
        activities={[]}
        organizations={[]}
        needs={[]}
      />
    );
  }

  const [leads, activities, organizations, needs] = await Promise.all([
    getSubcommitteeLeads(supabase, sector.id),
    getSectorActivities(supabase, sector.id),
    getOrganizationsBySector(supabase, slug),
    getVolunteerNeedsBySector(supabase, slug),
  ]);

  return (
    <SectorDetail
      meta={meta}
      sector={sector}
      leads={leads}
      activities={activities}
      organizations={organizations}
      needs={needs}
    />
  );
}

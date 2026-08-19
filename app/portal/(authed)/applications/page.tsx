import { requireOrgSession } from '@/lib/portal/session';
import { OrgApplications } from '@/components/portal/OrgApplications';
import type { VolunteerApplication } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function PortalApplicationsPage() {
  const { supabase, organizationId } = await requireOrgSession();

  // Two ways an application belongs to an organization, mirroring the
  // ownership predicate in migration 006: the newer rows carry
  // organization_id, older ones only point at one of the org's roles. Row-level
  // security enforces the same rule server-side; asking for it explicitly keeps
  // the page honest about what it means to show.
  const { data: needRows } = await supabase
    .from('volunteer_needs')
    .select('id')
    .eq('organization_id', organizationId);
  const needIds = ((needRows ?? []) as Array<{ id: string }>).map((n) => n.id);

  const orFilter = needIds.length
    ? `organization_id.eq.${organizationId},volunteer_need_id.in.(${needIds.join(',')})`
    : `organization_id.eq.${organizationId}`;

  const { data } = await supabase
    .from('volunteer_applications')
    .select('*, volunteer_need:volunteer_needs(id, title)')
    .or(orFilter)
    .order('created_at', { ascending: false });

  return (
    <OrgApplications
      applications={
        (data ?? []) as unknown as Array<
          VolunteerApplication & { volunteer_need?: { id: string; title: string } | null }
        >
      }
    />
  );
}

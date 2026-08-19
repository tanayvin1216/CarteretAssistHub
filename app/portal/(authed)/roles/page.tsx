import { requireOrgSession } from '@/lib/portal/session';
import { OrgRolesManager } from '@/components/portal/OrgRolesManager';
import type { VolunteerNeed } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function PortalRolesPage() {
  const { supabase, organizationId } = await requireOrgSession();

  const [needsRes, orgRes] = await Promise.all([
    supabase
      .from('volunteer_needs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('posted_date', { ascending: false }),
    supabase.from('organizations').select('sector_slug').eq('id', organizationId).maybeSingle(),
  ]);

  return (
    <OrgRolesManager
      needs={(needsRes.data ?? []) as VolunteerNeed[]}
      organizationId={organizationId}
      sectorSlug={(orgRes.data as { sector_slug: string | null } | null)?.sector_slug ?? null}
    />
  );
}

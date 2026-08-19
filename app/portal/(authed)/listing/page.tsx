import { redirect } from 'next/navigation';
import { requireOrgSession } from '@/lib/portal/session';
import { OrgListingForm } from '@/components/portal/OrgListingForm';
import type { Organization } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function PortalListingPage() {
  const { supabase, organizationId } = await requireOrgSession();

  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .maybeSingle();

  if (!data) redirect('/portal/login?error=no_org');

  return <OrgListingForm organization={data as Organization} />;
}

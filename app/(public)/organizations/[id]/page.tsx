import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrganization } from '@/lib/supabase/queries';
import { OrganizationDetail } from '@/components/organization/OrganizationDetail';

export const revalidate = 300;

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const org = await getOrganization(supabase, id);
  if (!org) notFound();

  const { data: needs } = await supabase
    .from('volunteer_needs')
    .select('*')
    .eq('organization_id', id)
    .eq('is_active', true)
    .order('posted_date', { ascending: false });

  return <OrganizationDetail org={org} needs={(needs ?? []) as never} />;
}

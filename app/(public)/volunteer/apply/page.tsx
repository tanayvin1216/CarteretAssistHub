import { createClient } from '@/lib/supabase/server';
import { VolunteerApplyForm } from '@/components/volunteer/VolunteerApplyForm';

export const revalidate = 0;

export default async function VolunteerApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string; org?: string }>;
}) {
  const { need, org } = await searchParams;
  const supabase = await createClient();

  let needContext: {
    id: string;
    title: string;
    description: string;
    sector_slug: string | null;
    organization_id: string;
    organization?: { id: string; name: string; town: string } | null;
  } | null = null;

  if (need) {
    const { data } = await supabase
      .from('volunteer_needs')
      .select('id, title, description, sector_slug, organization_id, organization:organizations(id, name, town)')
      .eq('id', need)
      .maybeSingle();
    needContext = (data as typeof needContext) ?? null;
  }

  let orgContext: { id: string; name: string; town: string } | null = null;
  if (org && !needContext) {
    const { data } = await supabase
      .from('organizations')
      .select('id, name, town')
      .eq('id', org)
      .maybeSingle();
    orgContext = (data as typeof orgContext) ?? null;
  }

  return <VolunteerApplyForm needContext={needContext} orgContext={orgContext} />;
}

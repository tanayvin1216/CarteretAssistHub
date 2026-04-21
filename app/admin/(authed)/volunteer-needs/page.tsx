import { createClient } from '@/lib/supabase/server';
import { VolunteerNeedsAdmin } from '@/components/admin/VolunteerNeedsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminVolunteerNeedsPage() {
  const supabase = await createClient();
  const [needsRes, orgsRes] = await Promise.all([
    supabase
      .from('volunteer_needs')
      .select('*, organization:organizations(id, name, sector_slug)')
      .order('posted_date', { ascending: false }),
    supabase
      .from('organizations')
      .select('id, name, sector_slug')
      .eq('is_active', true)
      .order('name'),
  ]);
  return (
    <VolunteerNeedsAdmin
      needs={(needsRes.data ?? []) as never}
      organizations={(orgsRes.data ?? []) as never}
    />
  );
}

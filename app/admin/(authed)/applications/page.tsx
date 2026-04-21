import { createClient } from '@/lib/supabase/server';
import { ApplicationsAdmin } from '@/components/admin/ApplicationsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('volunteer_applications')
    .select('*, organization:organizations(id, name), volunteer_need:volunteer_needs(id, title)')
    .order('created_at', { ascending: false });
  return <ApplicationsAdmin applications={(data ?? []) as never} />;
}

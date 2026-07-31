import { createClient } from '@/lib/supabase/server';
import { ReportsAdmin } from '@/components/admin/ReportsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('community_reports')
    .select('*, organization:organizations(id, name)')
    .order('created_at', { ascending: false });
  return <ReportsAdmin reports={(data ?? []) as never} />;
}

import { createClient } from '@/lib/supabase/server';
import { SubcommitteeLeadsAdmin } from '@/components/admin/SubcommitteeLeadsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const [sectorsRes, leadsRes] = await Promise.all([
    supabase.from('sectors').select('id, slug, name, accent_color, numeral').order('display_order'),
    supabase.from('subcommittee_leads').select('*').order('display_order'),
  ]);
  return (
    <SubcommitteeLeadsAdmin
      sectors={(sectorsRes.data ?? []) as never}
      leads={(leadsRes.data ?? []) as never}
    />
  );
}

import { createClient } from '@/lib/supabase/server';
import { OrganizationsAdmin } from '@/components/admin/OrganizationsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const [orgsRes, sectorsRes] = await Promise.all([
    supabase.from('organizations').select('*').order('name'),
    supabase.from('sectors').select('id, slug, name').order('display_order'),
  ]);
  return (
    <OrganizationsAdmin
      organizations={(orgsRes.data ?? []) as never}
      sectors={(sectorsRes.data ?? []) as never}
    />
  );
}

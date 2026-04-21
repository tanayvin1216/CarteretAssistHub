import { createClient } from '@/lib/supabase/server';
import { SectorsAdmin } from '@/components/admin/SectorsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminSectorsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('sectors')
    .select('*')
    .order('display_order');
  return <SectorsAdmin sectors={(data ?? []) as never} />;
}

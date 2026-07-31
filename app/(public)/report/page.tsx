import { createClient } from '@/lib/supabase/server';
import { ReportForm, type ReportOrganization } from '@/components/report/ReportForm';

export const metadata = {
  title: 'Report something | Carteret Assist Hub',
  description:
    'Tell the Carteret County Community Service Committee about an incorrect listing, an unmet need, or anything else they should know.',
};

export const revalidate = 0;

export default async function ReportPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('organizations')
    .select('id, name, town')
    .eq('is_active', true)
    .order('name');

  return <ReportForm organizations={(data ?? []) as ReportOrganization[]} />;
}

import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/siteContent';
import { ContentAdmin } from '@/components/admin/ContentAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const supabase = await createClient();
  const rows = await getSiteContent(supabase);
  return <ContentAdmin rows={rows} />;
}

import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/siteContent';
import { SettingsAdmin } from '@/components/admin/SettingsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const rows = await getSiteContent(supabase);
  return <SettingsAdmin rows={rows} />;
}

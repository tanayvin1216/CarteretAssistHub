import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // Authorization: Assist Hub admin is its own scope on the shared database —
  // profiles.assisthub_admin, not the global profiles.role = 'admin'. A
  // FoodAssist admin (global role) must NOT reach Assist Hub admin. `getUser()`
  // alone only proves authentication, so we check the per-site flag here in
  // addition to the RLS scoping on Assist-Hub-only tables.
  const { data: profile } = await supabase
    .from('profiles')
    .select('assisthub_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !(profile as { assisthub_admin: boolean }).assisthub_admin) {
    redirect('/admin/login?error=not_admin');
  }

  return <AdminShell userEmail={user.email ?? ''}>{children}</AdminShell>;
}

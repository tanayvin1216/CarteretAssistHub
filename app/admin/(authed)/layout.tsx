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

  // Authorization: role must be 'admin' in the profiles table.
  // `getUser()` alone only proves authentication — any signed-in user would
  // otherwise reach admin PII even if RLS blocks their writes.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || (profile as { role: string }).role !== 'admin') {
    redirect('/admin/login?error=not_admin');
  }

  return <AdminShell userEmail={user.email ?? ''}>{children}</AdminShell>;
}

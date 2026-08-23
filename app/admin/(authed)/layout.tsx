import { redirect } from 'next/navigation';
import { getAssistHubAdmin } from '@/lib/admin/guard';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

/**
 * Authorization: Assist Hub admin is its own scope on the shared database —
 * profiles.assisthub_admin, not the global profiles.role = 'admin'. A
 * FoodAssist admin (global role) must NOT reach the Assist Hub admin, and an
 * organization partner reaches only its own portal. getUser() alone proves
 * authentication and nothing more, so the per-site flag is checked here in
 * addition to the RLS scoping on Assist-Hub-only tables.
 */
export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAssistHubAdmin();
  if (!admin) redirect('/admin/login?error=not_admin');

  return <AdminShell userEmail={admin.email}>{children}</AdminShell>;
}

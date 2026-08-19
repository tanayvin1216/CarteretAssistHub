import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalShell } from '@/components/portal/PortalShell';

export const dynamic = 'force-dynamic';

/**
 * The portal door. Authentication alone proves nothing here — a resident, a
 * FoodAssist admin, and a revoked partner can all hold a valid session on the
 * shared database. What grants portal access is the pair the RLS policies key
 * off: profiles.role = 'organization' with an organization_id that still
 * resolves. Anything short of that is turned around at the login page.
 */
export default async function AuthedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/portal/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', user.id)
    .maybeSingle();

  const row = profile as { role: string; organization_id: string | null } | null;
  if (!row || row.role !== 'organization' || !row.organization_id) {
    redirect('/portal/login?error=not_org');
  }

  const { data: organization } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', row.organization_id)
    .maybeSingle();

  if (!organization) redirect('/portal/login?error=no_org');
  const org = organization as { id: string; name: string };

  return (
    <PortalShell
      organizationName={org.name}
      organizationId={org.id}
      userEmail={user.email ?? ''}
    >
      {children}
    </PortalShell>
  );
}

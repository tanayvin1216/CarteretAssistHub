import { redirect } from 'next/navigation';
import { requireOrgSession } from '@/lib/portal/session';
import { PortalShell } from '@/components/portal/PortalShell';

export const dynamic = 'force-dynamic';

/**
 * The portal door. Authentication alone proves nothing here — a resident, a
 * FoodAssist admin, and a revoked partner can all hold a valid session on the
 * shared database. requireOrgSession is what decides who gets in and which
 * organization they get: the org itself via profiles.role = 'organization',
 * or an Assist Hub admin who picked an organization at /portal/select.
 */
export default async function AuthedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, organizationId, assisting, userEmail } = await requireOrgSession();

  const { data: organization } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', organizationId)
    .maybeSingle();

  if (!organization) {
    // For an admin this means the organization behind a stale assist cookie is
    // gone; the picker will clear it. For an org account it means their own
    // listing was deleted, which is the committee's to explain.
    redirect(assisting ? '/portal/select?error=gone' : '/portal/login?error=no_org');
  }
  const org = organization as { id: string; name: string };

  return (
    <PortalShell
      organizationName={org.name}
      organizationId={org.id}
      userEmail={userEmail}
      assisting={assisting}
    >
      {children}
    </PortalShell>
  );
}

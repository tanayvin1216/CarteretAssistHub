import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrgAccountsAdmin, type OrgAccount } from '@/components/admin/OrgAccountsAdmin';

export const dynamic = 'force-dynamic';

export default async function OrgAccountsPage() {
  const supabase = await createClient();
  const { data: orgRows } = await supabase
    .from('organizations')
    .select('id, name, town')
    .order('name');
  const organizations = (orgRows ?? []) as Array<{ id: string; name: string; town: string }>;

  // Accounts are read with the service role: profiles carries every user on the
  // shared database, and Assist Hub admins have no blanket read over it.
  let accounts: OrgAccount[] = [];
  let serviceRoleError: string | null = null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('profiles')
      .select('id, email, name, organization_id, created_at')
      .eq('role', 'organization');
    if (error) throw new Error(error.message);

    const byId = new Map(organizations.map((o) => [o.id, o]));
    accounts = ((data ?? []) as Array<Omit<OrgAccount, 'organization'>>)
      .map((row) => ({
        ...row,
        organization: row.organization_id ? byId.get(row.organization_id) ?? null : null,
      }))
      .sort((a, b) =>
        (a.organization?.name ?? 'zzz').localeCompare(b.organization?.name ?? 'zzz'),
      );
  } catch (e) {
    serviceRoleError = e instanceof Error ? e.message : 'Could not read organization accounts.';
  }

  return (
    <OrgAccountsAdmin
      accounts={accounts}
      organizations={organizations}
      serviceRoleError={serviceRoleError}
    />
  );
}

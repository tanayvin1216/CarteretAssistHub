import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAssistHubAdmin } from '@/lib/admin/guard';
import { UsersAdmin, type UserAccount } from '@/components/admin/UsersAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const caller = await getAssistHubAdmin();

  const { data: orgRows } = await supabase
    .from('organizations')
    .select('id, name, town')
    .order('name');
  const organizations = (orgRows ?? []) as Array<{ id: string; name: string; town: string }>;

  // Accounts are read with the service role. `profiles` carries every user on
  // the database Assist Hub shares with FoodAssist, and an Assist Hub admin has
  // no blanket read over it — migration 004 deliberately left the shared tables
  // scoped to the global admin role.
  let accounts: UserAccount[] = [];
  let serviceRoleError: string | null = null;

  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from('profiles')
      .select('id, email, name, role, organization_id, assisthub_admin, created_at');
    if (error) throw new Error(error.message);

    // Last sign-in lives on the auth user, not the profile — it is the fastest
    // way to tell a login that was never picked up from one in daily use.
    const lastSignIn = new Map<string, string | null>();
    for (let page = 1; page <= 10; page++) {
      const { data: users, error: usersError } = await admin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (usersError) throw new Error(usersError.message);
      users.users.forEach((u) => lastSignIn.set(u.id, u.last_sign_in_at ?? null));
      if (users.users.length < 200) break;
    }

    const byId = new Map(organizations.map((o) => [o.id, o]));
    accounts = (
      (data ?? []) as Array<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        organization_id: string | null;
        assisthub_admin: boolean;
        created_at: string;
      }>
    )
      .map((row) => ({
        ...row,
        organization: row.organization_id ? byId.get(row.organization_id) ?? null : null,
        last_sign_in_at: lastSignIn.get(row.id) ?? null,
      }))
      // Admins first, then organizations, then everyone else — the order you
      // scan the list in when you are looking for something.
      .sort((a, b) => {
        const rank = (r: string) => (r === 'admin' ? 0 : r === 'organization' ? 1 : 2);
        if (rank(a.role) !== rank(b.role)) return rank(a.role) - rank(b.role);
        return (a.email ?? '').localeCompare(b.email ?? '');
      });
  } catch (e) {
    serviceRoleError = e instanceof Error ? e.message : 'Could not read accounts.';
  }

  return (
    <UsersAdmin
      accounts={accounts}
      organizations={organizations}
      currentUserId={caller?.userId ?? ''}
      serviceRoleError={serviceRoleError}
    />
  );
}

import { createClient } from '@/lib/supabase/server';

/**
 * The one place that answers "is the caller an Assist Hub admin?".
 *
 * Assist Hub admin is its own scope on the shared FoodAssist database —
 * profiles.assisthub_admin, not the global profiles.role = 'admin' (see
 * migration 004). Authentication alone proves nothing here: a FoodAssist
 * admin, an organization partner and a resident all hold valid sessions on
 * this database.
 *
 * Server actions each need this on their own. The layout gate at
 * app/admin/(authed) gets them nothing — an action is its own endpoint and can
 * be invoked without that layout ever rendering.
 */
export interface AdminIdentity {
  userId: string;
  email: string;
  /**
   * Global FoodAssist role. Carried because RLS on the shared `organizations`
   * table still keys off is_admin() (role = 'admin'), so an Assist Hub admin
   * who is not also a global admin cannot write listings.
   */
  role: string;
}

export async function getAssistHubAdmin(): Promise<AdminIdentity | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role, assisthub_admin')
    .eq('id', user.id)
    .maybeSingle();

  const row = data as { role: string; assisthub_admin: boolean } | null;
  if (!row || !row.assisthub_admin) return null;

  return { userId: user.id, email: user.email ?? '', role: row.role };
}

/** Throwing variant, for server actions that hold the service-role key. */
export async function requireAssistHubAdmin(): Promise<AdminIdentity> {
  const admin = await getAssistHubAdmin();
  if (!admin) throw new Error('Not authorized for the Assist Hub admin.');
  return admin;
}

import { cookies } from 'next/headers';
import { getAssistHubAdmin } from '@/lib/admin/guard';

/**
 * "Assist mode": an Assist Hub admin working inside an organization's portal
 * on that organization's behalf — to fix a listing over the phone, post a role
 * for a partner who cannot, or see exactly what the org sees when they report
 * that something is wrong.
 *
 * This is deliberately NOT impersonation. The admin stays signed in as
 * themselves: their own session, their own RLS grants, their own audit trail.
 * All the cookie carries is *which* organization the portal pages should scope
 * to, and every read of it re-checks that the caller is still an admin — so a
 * stale cookie left on a demoted account grants nothing.
 *
 * Organizations are untouched by any of this. Their portal access still comes
 * from profiles.role = 'organization' + organization_id, and an org can still
 * only ever reach its own portal.
 */
export const ASSIST_COOKIE = 'assisthub_portal_org';

/**
 * The organization the caller is currently assisting, or null. Null for
 * everyone who is not an Assist Hub admin, whatever the cookie says.
 */
export async function getAssistedOrgId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(ASSIST_COOKIE)?.value;
  if (!value) return null;

  const admin = await getAssistHubAdmin();
  return admin ? value : null;
}

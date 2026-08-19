import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Resolves the organization the signed-in user represents, or sends them back
 * to the login page. Every portal page calls this rather than trusting the
 * layout: a page is rendered from its own request, and the organization id is
 * the key each of them filters on, so it is worth reading in one place.
 */
export async function requireOrgSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/portal/login');

  const { data } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', user.id)
    .maybeSingle();

  const row = data as { role: string; organization_id: string | null } | null;
  if (!row || row.role !== 'organization' || !row.organization_id) {
    redirect('/portal/login?error=not_org');
  }

  return { supabase, user, organizationId: row.organization_id };
}

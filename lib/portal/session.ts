import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssistHubAdmin } from '@/lib/admin/guard';
import { getAssistedOrgId } from './assist';

export interface PortalSession {
  supabase: Awaited<ReturnType<typeof createClient>>;
  organizationId: string;
  /** True when an Assist Hub admin is working inside this org's portal. */
  assisting: boolean;
  userEmail: string;
}

/**
 * Resolves the organization whose portal this request is for, or sends the
 * caller back to the login page. Every portal page calls this rather than
 * trusting the layout: a page is rendered from its own request, and the
 * organization id is the key each of them filters on, so it is worth reading
 * in one place.
 *
 * Two kinds of caller get through:
 *
 *   • the organization itself — profiles.role = 'organization' with an
 *     organization_id, the pair the RLS policies in 006/007 key off. It only
 *     ever resolves to its own organization; nothing here can widen that.
 *
 *   • an Assist Hub admin in assist mode — signed in as themselves, with the
 *     organization they picked at /portal/select. Their access rides on their
 *     own admin RLS grants, not the org's.
 */
export async function requireOrgSession(): Promise<PortalSession> {
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

  if (row && row.role === 'organization' && row.organization_id) {
    return {
      supabase,
      organizationId: row.organization_id,
      assisting: false,
      userEmail: user.email ?? '',
    };
  }

  const admin = await getAssistHubAdmin();
  if (admin) {
    const assistedOrgId = await getAssistedOrgId();
    // An admin with no organization chosen yet is not lost — send them to the
    // picker, not to a login page they are already past.
    if (!assistedOrgId) redirect('/portal/select');
    return { supabase, organizationId: assistedOrgId, assisting: true, userEmail: admin.email };
  }

  redirect('/portal/login?error=not_org');
}

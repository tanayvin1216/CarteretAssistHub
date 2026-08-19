'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Server actions behind the "Organization logins" admin screen.
 *
 * These hold the service-role key, so every one of them re-checks that the
 * caller is an Assist Hub admin. The layout gate at app/admin/(authed) is not
 * enough on its own: a server action is its own endpoint and can be invoked
 * without ever rendering that layout.
 */

export interface ActionResult {
  ok: boolean;
  message?: string;
  /** Shown once, then gone — see the note on password delivery below. */
  secret?: { label: string; value: string };
}

async function requireAssistHubAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('assisthub_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !(profile as { assisthub_admin: boolean }).assisthub_admin) {
    throw new Error('Not authorized for the Assist Hub admin.');
  }
  return user.id;
}

/**
 * Passwords are generated here and shown to the admin once, rather than mailed
 * out: this project has no SMTP sender configured, so Supabase's invite email
 * would silently go nowhere. The admin hands the password over by whatever
 * channel they already use with that organization, and the org changes it on
 * first sign-in.
 */
function generatePassword(): string {
  // base64url over 12 bytes — 16 characters, no ambiguous punctuation.
  return randomBytes(12).toString('base64url');
}

async function findUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<string | null> {
  const target = email.trim().toLowerCase();
  // listUsers is the only email lookup the admin API offers. Ten pages of
  // 200 is 2,000 accounts, far past anything this county project will hold.
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const hit = data.users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (hit) return hit.id;
    if (data.users.length < 200) break;
  }
  return null;
}

export async function createOrgAccount(input: {
  email: string;
  organizationId: string;
  name: string;
}): Promise<ActionResult> {
  try {
    await requireAssistHubAdmin();

    const email = input.email.trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, message: 'Enter a valid email.' };
    if (!input.organizationId) return { ok: false, message: 'Pick an organization.' };

    const admin = createAdminClient();

    const { data: org, error: orgError } = await admin
      .from('organizations')
      .select('id, name')
      .eq('id', input.organizationId)
      .maybeSingle();
    if (orgError) return { ok: false, message: orgError.message };
    if (!org) return { ok: false, message: 'That organization no longer exists.' };

    const password = generatePassword();
    let userId: string;
    let created = true;

    const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // Re-running this for an address that already has an account is a normal
      // thing for an admin to do — attach the existing account to the org
      // rather than making them go hunting for it.
      const existingId = await findUserIdByEmail(admin, email);
      if (!existingId) return { ok: false, message: createError.message };
      userId = existingId;
      created = false;
    } else {
      userId = createdUser.user.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = admin.from('profiles') as any;
    const { error: profileError } = await profiles.upsert(
      {
        id: userId,
        email,
        name: input.name.trim() || (org as { name: string }).name,
        role: 'organization',
        organization_id: input.organizationId,
      },
      { onConflict: 'id' },
    );
    if (profileError) return { ok: false, message: profileError.message };

    revalidatePath('/admin/org-accounts');

    if (!created) {
      return {
        ok: true,
        message: `${email} already had an account — it now represents ${(org as { name: string }).name}. Their existing password still works; use "New password" if they need one.`,
      };
    }
    return {
      ok: true,
      message: `Account created for ${(org as { name: string }).name}.`,
      secret: { label: `Temporary password for ${email}`, value: password },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

export async function resetOrgPassword(userId: string): Promise<ActionResult> {
  try {
    await requireAssistHubAdmin();
    const admin = createAdminClient();
    const password = generatePassword();
    const { data, error } = await admin.auth.admin.updateUserById(userId, { password });
    if (error) return { ok: false, message: error.message };
    return {
      ok: true,
      message: 'Password replaced. The old one no longer works.',
      secret: { label: `New password for ${data.user.email}`, value: password },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

export async function revokeOrgAccount(userId: string): Promise<ActionResult> {
  try {
    await requireAssistHubAdmin();
    const admin = createAdminClient();
    // The sign-in itself is left intact and the profile is demoted instead:
    // deleting the auth user would orphan anything else on the shared database
    // that points at it (reviewed_by on applications and reports, updated_by on
    // listings). Demoted, they can still sign in but the portal turns them away.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = admin.from('profiles') as any;
    const { error } = await profiles
      .update({ role: 'public', organization_id: null })
      .eq('id', userId);
    if (error) return { ok: false, message: error.message };
    revalidatePath('/admin/org-accounts');
    return { ok: true, message: 'Access removed. They can no longer reach the portal.' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

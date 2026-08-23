'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { requireAssistHubAdmin } from '@/lib/admin/guard';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Server actions behind the "Users" screen — every account on the database
 * Assist Hub shares with FoodAssist.
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

export type AccountRole = 'admin' | 'organization' | 'public';

/**
 * Passwords are generated here and shown to the admin once, rather than mailed
 * out: this project has no SMTP sender configured, so Supabase's invite email
 * would silently go nowhere. The admin hands the password over by whatever
 * channel they already use with that person, and they change it on first
 * sign-in.
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
  // listUsers is the only email lookup the admin API offers. Ten pages of 200
  // is 2,000 accounts, far past anything these two county sites will hold.
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const hit = data.users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (hit) return hit.id;
    if (data.users.length < 200) break;
  }
  return null;
}

/**
 * An organization account is the pair profiles.role = 'organization' +
 * organization_id — that is what the RLS policies in 006 and 007 key off, and
 * what the portal door checks. Half of it is worse than neither: an
 * organization row with no id can sign in and reach nothing, and an
 * organization_id hung off a 'public' row is a partner quietly locked out.
 */
function normalizeAssignment(role: AccountRole, organizationId: string | null) {
  return {
    role,
    organization_id: role === 'organization' ? organizationId : null,
  };
}

export async function createUserAccount(input: {
  email: string;
  name: string;
  role: AccountRole;
  organizationId: string | null;
  assisthubAdmin: boolean;
}): Promise<ActionResult> {
  try {
    await requireAssistHubAdmin();

    const email = input.email.trim().toLowerCase();
    if (!email || !email.includes('@')) return { ok: false, message: 'Enter a valid email.' };
    if (input.role === 'organization' && !input.organizationId) {
      return { ok: false, message: 'An organization account needs an organization.' };
    }

    const admin = createAdminClient();
    const password = generatePassword();
    let userId: string;
    let created = true;

    const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // Re-running this for an address that already signs in somewhere on the
      // shared database is a normal thing for an admin to do — adjust the
      // existing account rather than making them go hunting for it.
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
        name: input.name.trim() || null,
        ...normalizeAssignment(input.role, input.organizationId),
        assisthub_admin: input.assisthubAdmin,
      },
      { onConflict: 'id' },
    );
    if (profileError) return { ok: false, message: profileError.message };

    revalidatePath('/admin/users');
    revalidatePath('/admin/org-accounts');

    if (!created) {
      return {
        ok: true,
        message: `${email} already had an account — its access has been updated. The existing password still works; use "New password" if they need one.`,
      };
    }
    return {
      ok: true,
      message: `Account created for ${email}.`,
      secret: { label: `Temporary password for ${email}`, value: password },
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

export async function updateUserAccess(input: {
  userId: string;
  name: string;
  role: AccountRole;
  organizationId: string | null;
  assisthubAdmin: boolean;
}): Promise<ActionResult> {
  try {
    const caller = await requireAssistHubAdmin();

    if (input.role === 'organization' && !input.organizationId) {
      return { ok: false, message: 'An organization account needs an organization.' };
    }

    // Locking yourself out is a one-way door: with no Assist Hub admin left,
    // there is no screen anywhere that can hand the flag back — it takes SQL.
    if (input.userId === caller.userId && (!input.assisthubAdmin || input.role !== 'admin')) {
      return {
        ok: false,
        message: 'You cannot take away your own admin access. Ask the other admin to do it.',
      };
    }

    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = admin.from('profiles') as any;
    const { error } = await profiles
      .update({
        name: input.name.trim() || null,
        ...normalizeAssignment(input.role, input.organizationId),
        assisthub_admin: input.assisthubAdmin,
      })
      .eq('id', input.userId);
    if (error) return { ok: false, message: error.message };

    revalidatePath('/admin/users');
    revalidatePath('/admin/org-accounts');
    return { ok: true, message: 'Access updated.' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

export async function resetUserPassword(userId: string): Promise<ActionResult> {
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

export async function removeUserAccess(userId: string): Promise<ActionResult> {
  try {
    const caller = await requireAssistHubAdmin();
    if (userId === caller.userId) {
      return { ok: false, message: 'You cannot remove your own access.' };
    }

    const admin = createAdminClient();
    // The sign-in itself is left intact and the profile is demoted instead:
    // deleting the auth user would orphan anything else on the shared database
    // that points at it (reviewed_by on applications and reports, updated_by on
    // listings). Demoted, they can still sign in but every gated screen — this
    // admin, the portal, FoodAssist's own admin — turns them away.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = admin.from('profiles') as any;
    const { error } = await profiles
      .update({ role: 'public', organization_id: null, assisthub_admin: false })
      .eq('id', userId);
    if (error) return { ok: false, message: error.message };

    revalidatePath('/admin/users');
    revalidatePath('/admin/org-accounts');
    return { ok: true, message: 'Access removed. The sign-in still exists but reaches nothing.' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}

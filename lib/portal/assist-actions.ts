'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAssistHubAdmin } from '@/lib/admin/guard';
import { ASSIST_COOKIE } from './assist';

/**
 * Enter and leave assist mode. Cookies can only be written from a Server
 * Action or a Route Handler, which is why these live apart from the read side
 * in ./assist — a page renders the read, never the write.
 */
export async function enterOrgPortal(organizationId: string): Promise<void> {
  await requireAssistHubAdmin();
  const store = await cookies();
  store.set(ASSIST_COOKIE, organizationId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // Session-length on purpose: assisting is something you do for one phone
    // call, not a state you should still be in tomorrow without noticing.
  });
  redirect('/portal');
}

export async function leaveOrgPortal(): Promise<void> {
  const store = await cookies();
  store.delete(ASSIST_COOKIE);
  redirect('/admin/users');
}

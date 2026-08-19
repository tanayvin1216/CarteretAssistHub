'use client';

import { useMemo, useState, useTransition } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Copy, KeyRound, Plus, ShieldOff, TriangleAlert, X } from 'lucide-react';
import {
  createOrgAccount,
  resetOrgPassword,
  revokeOrgAccount,
  type ActionResult,
} from '@/app/admin/(authed)/org-accounts/actions';
import { AdminPageHeader } from './AdminPageHeader';

export interface OrgAccount {
  id: string;
  email: string;
  name: string | null;
  organization_id: string | null;
  created_at: string;
  organization: { id: string; name: string; town: string } | null;
}

interface Props {
  accounts: OrgAccount[];
  organizations: Array<{ id: string; name: string; town: string }>;
  serviceRoleError: string | null;
}

const FIELD =
  'w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink';

export function OrgAccountsAdmin({ accounts, organizations, serviceRoleError }: Props) {
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [secret, setSecret] = useState<{ label: string; value: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const claimed = useMemo(
    () => new Set(accounts.map((a) => a.organization_id).filter(Boolean) as string[]),
    [accounts],
  );

  const handle = (result: ActionResult) => {
    if (!result.ok) {
      toast.error(result.message ?? 'Something went wrong.');
      return;
    }
    if (result.message) toast.success(result.message);
    if (result.secret) setSecret(result.secret);
  };

  const onCreate = () => {
    startTransition(async () => {
      const result = await createOrgAccount({ email, organizationId, name });
      handle(result);
      if (result.ok) {
        setCreating(false);
        setEmail('');
        setName('');
        setOrganizationId('');
      }
    });
  };

  const onReset = (account: OrgAccount) => {
    if (!confirm(`Replace the password for ${account.email}? Their current one stops working.`)) {
      return;
    }
    startTransition(async () => handle(await resetOrgPassword(account.id)));
  };

  const onRevoke = (account: OrgAccount) => {
    if (
      !confirm(
        `Remove portal access for ${account.email}? They keep their sign-in but lose the portal.`,
      )
    ) {
      return;
    }
    startTransition(async () => handle(await revokeOrgAccount(account.id)));
  };

  return (
    <div className="px-8 py-10 max-w-5xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Organization logins"
        action={
          <button
            onClick={() => setCreating(true)}
            disabled={!!serviceRoleError}
            className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New login
          </button>
        }
      />

      <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-8">
        An organization login lets a partner sign in at <code>/portal</code> and manage its own
        listing, volunteer roles, and applications — without going through the committee. One login
        represents exactly one organization.
      </p>

      {serviceRoleError && (
        <div className="flex items-start gap-3 mb-8 px-4 py-3.5 border border-destructive/30 bg-destructive/5 rounded-sm">
          <TriangleAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm text-body-text">
            <p className="font-semibold text-ink mb-1">Accounts cannot be managed right now.</p>
            <p className="leading-relaxed">{serviceRoleError}</p>
            <p className="leading-relaxed mt-1.5 text-muted-text">
              Creating a login needs <code>SUPABASE_SERVICE_ROLE_KEY</code> set in the environment
              (Supabase → Project settings → API → service_role). Add it locally in{' '}
              <code>.env.local</code> and in the Vercel project settings.
            </p>
          </div>
        </div>
      )}

      {secret && (
        <div className="mb-8 px-5 py-4 border border-divider bg-sand rounded-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-text mb-1.5">
                Shown once
              </p>
              <p className="text-sm text-ink mb-2">{secret.label}</p>
              <code className="inline-block px-3 py-2 bg-card border border-divider rounded-sm text-sm break-all">
                {secret.value}
              </code>
              <p className="text-xs text-muted-text mt-2.5 max-w-lg leading-relaxed">
                Send this to the organization however you normally reach them, and ask them to
                change it after signing in. It is not stored anywhere and cannot be shown again —
                if it is lost, issue a new one.
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(secret.value);
                  toast.success('Copied.');
                }}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs border border-divider rounded-sm text-muted-text hover:text-ink hover:border-ink transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <button
                onClick={() => setSecret(null)}
                aria-label="Dismiss"
                className="text-muted-text hover:text-ink p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full bg-card border border-divider rounded-sm overflow-hidden">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-text border-b border-divider">
            <th className="px-4 py-3">Organization</th>
            <th className="px-4 py-3">Sign-in email</th>
            <th className="px-4 py-3 w-28">Added</th>
            <th className="px-4 py-3 w-44"></th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-sm text-muted-text text-center">
                No organization logins yet. Click <em>New login</em> to create the first one.
              </td>
            </tr>
          ) : (
            accounts.map((account) => (
              <tr key={account.id} className="border-b border-divider last:border-b-0 hover:bg-sand/50">
                <td className="px-4 py-3">
                  {account.organization ? (
                    <>
                      <p className="text-base text-ink">{account.organization.name}</p>
                      <p className="text-xs text-muted-text">{account.organization.town}</p>
                    </>
                  ) : (
                    <p className="text-sm text-destructive italic">
                      Organization missing — this login cannot reach the portal
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-body-text break-all">{account.email}</td>
                <td className="px-4 py-3 text-xs text-muted-text">
                  {format(new Date(account.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onReset(account)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-ink transition-colors disabled:opacity-50"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    New password
                  </button>
                  <button
                    onClick={() => onRevoke(account)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-destructive transition-colors disabled:opacity-50"
                  >
                    <ShieldOff className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {creating && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto">
          <div className="bg-canvas w-full max-w-lg rounded-sm shadow-xl my-8">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-text">New</p>
                <h3 className="text-xl text-ink">Organization login</h3>
              </div>
              <button onClick={() => setCreating(false)} className="text-muted-text hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Organization
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className={FIELD}
                >
                  <option value="">— pick an organization —</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} · {o.town}
                      {claimed.has(o.id) ? ' (already has a login)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Sign-in email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@example.org"
                  className={FIELD}
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Contact name (optional)
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={FIELD}
                />
              </div>
              <p className="text-xs text-muted-text leading-relaxed pt-1">
                A temporary password is generated and shown to you once. Pass it to the
                organization yourself — this site has no outgoing mail configured, so an invite
                email would go nowhere.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-divider flex items-center justify-end gap-3">
              <button
                onClick={() => setCreating(false)}
                className="h-10 px-4 text-sm text-muted-text hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onCreate}
                disabled={pending}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                {pending ? 'Creating…' : 'Create login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

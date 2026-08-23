'use client';

import { useMemo, useState, useTransition } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Copy,
  KeyRound,
  Plus,
  Search,
  ShieldOff,
  TriangleAlert,
  X,
  Pencil,
  LogIn,
} from 'lucide-react';
import {
  createUserAccount,
  updateUserAccess,
  resetUserPassword,
  removeUserAccess,
  type AccountRole,
  type ActionResult,
} from '@/app/admin/(authed)/users/actions';
import { enterOrgPortal } from '@/lib/portal/assist-actions';
import { AdminPageHeader } from './AdminPageHeader';

export interface UserAccount {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organization_id: string | null;
  assisthub_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  organization: { id: string; name: string; town: string } | null;
}

interface Props {
  accounts: UserAccount[];
  organizations: Array<{ id: string; name: string; town: string }>;
  currentUserId: string;
  serviceRoleError: string | null;
}

const FIELD =
  'w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  organization: 'Organization',
  public: 'Resident',
};

type Draft = {
  id?: string;
  email: string;
  name: string;
  role: AccountRole;
  organizationId: string;
  assisthubAdmin: boolean;
};

const EMPTY_DRAFT: Draft = {
  email: '',
  name: '',
  role: 'public',
  organizationId: '',
  assisthubAdmin: false,
};

type Filter = 'all' | 'assisthub' | 'admin' | 'organization' | 'public';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Everyone' },
  { key: 'assisthub', label: 'Assist Hub admins' },
  { key: 'admin', label: 'Admins' },
  { key: 'organization', label: 'Organizations' },
  { key: 'public', label: 'Residents' },
];

export function UsersAdmin({
  accounts,
  organizations,
  currentUserId,
  serviceRoleError,
}: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [secret, setSecret] = useState<{ label: string; value: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: accounts.length,
      assisthub: accounts.filter((a) => a.assisthub_admin).length,
      admin: accounts.filter((a) => a.role === 'admin').length,
      organization: accounts.filter((a) => a.role === 'organization').length,
      public: accounts.filter((a) => a.role === 'public').length,
    }),
    [accounts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((a) => {
      if (filter === 'assisthub' && !a.assisthub_admin) return false;
      if (filter !== 'all' && filter !== 'assisthub' && a.role !== filter) return false;
      if (!q) return true;
      return (
        (a.email ?? '').toLowerCase().includes(q) ||
        (a.name ?? '').toLowerCase().includes(q) ||
        (a.organization?.name ?? '').toLowerCase().includes(q)
      );
    });
  }, [accounts, filter, query]);

  const handle = (result: ActionResult) => {
    if (!result.ok) {
      toast.error(result.message ?? 'Something went wrong.');
      return false;
    }
    if (result.message) toast.success(result.message);
    if (result.secret) setSecret(result.secret);
    return true;
  };

  const onSave = () => {
    if (!draft) return;
    startTransition(async () => {
      const organizationId = draft.role === 'organization' ? draft.organizationId || null : null;
      const result = draft.id
        ? await updateUserAccess({
            userId: draft.id,
            name: draft.name,
            role: draft.role,
            organizationId,
            assisthubAdmin: draft.assisthubAdmin,
          })
        : await createUserAccount({
            email: draft.email,
            name: draft.name,
            role: draft.role,
            organizationId,
            assisthubAdmin: draft.assisthubAdmin,
          });
      if (handle(result)) setDraft(null);
    });
  };

  const onReset = (account: UserAccount) => {
    if (!confirm(`Replace the password for ${account.email}? Their current one stops working.`)) {
      return;
    }
    startTransition(async () => {
      handle(await resetUserPassword(account.id));
    });
  };

  const onRemove = (account: UserAccount) => {
    if (
      !confirm(
        `Remove all access for ${account.email}? They keep their sign-in but it will reach nothing — not this admin, not the portal, not FoodAssist.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      handle(await removeUserAccess(account.id));
    });
  };

  return (
    <div className="px-8 py-10 max-w-6xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Users"
        action={
          <button
            onClick={() => setDraft({ ...EMPTY_DRAFT })}
            disabled={!!serviceRoleError}
            className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New account
          </button>
        }
      />

      <p className="text-sm text-body-text leading-relaxed max-w-3xl mb-8">
        Every account on the database Assist Hub shares with the FoodAssist site — county admins,
        organization partners, and residents alike. Two separate things decide what an account can
        reach: its <strong>role</strong>, which both sites read, and the{' '}
        <strong>Assist Hub admin</strong> flag, which only this site reads. An organization account
        can only ever reach its own portal; this screen is admin-only.
      </p>

      {serviceRoleError && (
        <div className="flex items-start gap-3 mb-8 px-4 py-3.5 border border-destructive/30 bg-destructive/5 rounded-sm">
          <TriangleAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm text-body-text">
            <p className="font-semibold text-ink mb-1">Accounts cannot be managed right now.</p>
            <p className="leading-relaxed">{serviceRoleError}</p>
            <p className="leading-relaxed mt-1.5 text-muted-text">
              Reading and changing accounts needs <code>SUPABASE_SERVICE_ROLE_KEY</code> set in the
              environment (Supabase → Project settings → API → service_role). Add it locally in{' '}
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
                Send this however you normally reach them, and ask them to change it after signing
                in. It is not stored anywhere and cannot be shown again — if it is lost, issue a
                new one.
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

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email, name, or organization…"
            className="w-full h-10 pl-10 pr-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`h-9 px-3 text-xs rounded-full border transition-colors ${
                filter === f.key
                  ? 'bg-ink text-white border-ink'
                  : 'border-divider text-muted-text hover:text-ink hover:border-ink'
              }`}
            >
              {f.label}
              <span className="ml-1.5 tabular-nums opacity-60">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      <table className="w-full bg-card border border-divider rounded-sm overflow-hidden">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-text border-b border-divider">
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3 w-40">Role</th>
            <th className="px-4 py-3 w-56">Organization</th>
            <th className="px-4 py-3 w-28">Last sign-in</th>
            <th className="px-4 py-3 w-40"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-sm text-muted-text text-center">
                {accounts.length === 0
                  ? 'No accounts found.'
                  : 'No account matches that search.'}
              </td>
            </tr>
          ) : (
            filtered.map((account) => (
              <tr
                key={account.id}
                className="border-b border-divider last:border-b-0 hover:bg-sand/50 align-top"
              >
                <td className="px-4 py-3">
                  <p className="text-base text-ink break-all">{account.email}</p>
                  <p className="text-xs text-muted-text">
                    {account.name || 'No name'}
                    {account.id === currentUserId && ' · you'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block text-sm text-body-text">
                    {ROLE_LABEL[account.role] ?? account.role}
                  </span>
                  {account.assisthub_admin && (
                    <span className="block mt-1 text-[10px] uppercase tracking-[0.16em] text-primary font-semibold">
                      Assist Hub admin
                    </span>
                  )}
                  {account.role === 'organization' && !account.organization_id && (
                    <span className="block mt-1 text-xs text-destructive">
                      No organization — cannot reach the portal
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {account.organization ? (
                    <>
                      <p className="text-sm text-body-text">{account.organization.name}</p>
                      <p className="text-xs text-muted-text">{account.organization.town}</p>
                    </>
                  ) : account.organization_id ? (
                    <p className="text-xs text-destructive italic">
                      Organization no longer in the directory
                    </p>
                  ) : (
                    <span className="text-xs text-muted-text">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-text">
                  {account.last_sign_in_at
                    ? format(new Date(account.last_sign_in_at), 'MMM d, yyyy')
                    : 'Never'}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex flex-col items-end gap-0.5">
                    <div>
                      <button
                        onClick={() =>
                          setDraft({
                            id: account.id,
                            email: account.email,
                            name: account.name ?? '',
                            role: (account.role as AccountRole) ?? 'public',
                            organizationId: account.organization_id ?? '',
                            assisthubAdmin: account.assisthub_admin,
                          })
                        }
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-ink transition-colors disabled:opacity-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => onReset(account)}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-ink transition-colors disabled:opacity-50"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Password
                      </button>
                    </div>
                    <div>
                      {account.organization_id && (
                        <form
                          action={enterOrgPortal.bind(null, account.organization_id)}
                          className="inline"
                        >
                          <button
                            type="submit"
                            title={`Open ${account.organization?.name ?? 'this organization'}'s portal as yourself`}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-primary transition-colors"
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            Portal
                          </button>
                        </form>
                      )}
                      {account.id !== currentUserId && (
                        <button
                          onClick={() => onRemove(account)}
                          disabled={pending}
                          className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs text-muted-text hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {draft && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto">
          <div className="bg-canvas w-full max-w-lg rounded-sm shadow-xl my-8">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-text">
                  {draft.id ? 'Edit' : 'New'}
                </p>
                <h3 className="text-xl text-ink">{draft.id ? draft.email : 'Account'}</h3>
              </div>
              <button onClick={() => setDraft(null)} className="text-muted-text hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {!draft.id && (
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                    Sign-in email
                  </label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    placeholder="person@example.org"
                    className={FIELD}
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Name (optional)
                </label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={FIELD}
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Role
                </label>
                <select
                  value={draft.role}
                  onChange={(e) =>
                    setDraft({ ...draft, role: e.target.value as AccountRole })
                  }
                  className={FIELD}
                >
                  <option value="public">Resident — public site only</option>
                  <option value="organization">Organization — its own portal</option>
                  <option value="admin">Admin — shared admin role</option>
                </select>
                <p className="text-xs text-muted-text mt-1.5 leading-relaxed">
                  Role is read by both sites. <strong>Admin</strong> grants the shared FoodAssist
                  admin role and is what row-level security on organizations keys off — an Assist
                  Hub admin needs it to edit listings.
                </p>
              </div>
              {draft.role === 'organization' && (
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                    Organization
                  </label>
                  <select
                    value={draft.organizationId}
                    onChange={(e) => setDraft({ ...draft, organizationId: e.target.value })}
                    className={FIELD}
                  >
                    <option value="">— pick an organization —</option>
                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} · {o.town}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-start gap-3 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.assisthubAdmin}
                  onChange={(e) => setDraft({ ...draft, assisthubAdmin: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-ink)]"
                />
                <span className="text-sm text-body-text leading-relaxed">
                  <span className="font-semibold text-ink">Assist Hub admin</span>
                  <span className="block text-xs text-muted-text mt-0.5">
                    Grants this admin dashboard and the ability to open any organization&apos;s
                    portal to help them. FoodAssist never reads this flag.
                  </span>
                </span>
              </label>
              {!draft.id && (
                <p className="text-xs text-muted-text leading-relaxed pt-1">
                  A temporary password is generated and shown to you once. Pass it on yourself —
                  this site has no outgoing mail configured, so an invite email would go nowhere.
                </p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-divider flex items-center justify-end gap-3">
              <button
                onClick={() => setDraft(null)}
                className="h-10 px-4 text-sm text-muted-text hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={pending}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                {pending ? 'Saving…' : draft.id ? 'Save changes' : 'Create account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

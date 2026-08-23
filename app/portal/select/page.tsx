import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { getAssistHubAdmin } from '@/lib/admin/guard';
import { createClient } from '@/lib/supabase/server';
import { OrgPortalPicker } from '@/components/portal/OrgPortalPicker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Open an organization portal · Carteret Assist Hub',
};

const ERRORS: Record<string, string> = {
  gone: 'The organization you were assisting is no longer in the directory. Pick another one.',
};

/**
 * Sits OUTSIDE app/portal/(authed) on purpose: that group's layout resolves an
 * organization, and this page is where an admin goes to choose one. It is
 * admin-only — an organization account never sees it, and never needs to.
 */
export default async function SelectOrgPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getAssistHubAdmin();
  if (!admin) redirect('/portal/login?error=not_org');

  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from('organizations')
    .select('id, name, town, sector_slug, is_active')
    .order('name');

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>

        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· Admin</p>
        <h1 className="text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight mb-3">
          Open an organization portal
        </h1>
        <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-8">
          You will see exactly what the organization sees, signed in as yourself. Use it to fix a
          listing while you have them on the phone, or to check what they are looking at when
          something is not working. Everything you save is their live record.
        </p>

        {error && ERRORS[error] && (
          <div className="mb-6 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3 rounded-sm">
            {ERRORS[error]}
          </div>
        )}

        {admin.role !== 'admin' && (
          <div className="mb-6 text-sm text-body-text bg-sand border border-divider px-4 py-3 rounded-sm leading-relaxed">
            <span className="font-semibold text-ink">Heads up.</span> Your account has Assist Hub
            admin but not the shared <code>admin</code> role, and row-level security on the
            organizations table still keys off that role. You will be able to read a portal, but
            saving a listing will be refused. Grant yourself the <code>admin</code> role on the
            Users page first.
          </div>
        )}

        <OrgPortalPicker
          organizations={
            (data ?? []) as Array<{
              id: string;
              name: string;
              town: string;
              sector_slug: string | null;
              is_active: boolean;
            }>
          }
        />

        {(data ?? []).length === 0 && (
          <div className="flex items-center gap-3 px-5 py-8 border border-divider bg-card rounded-sm text-sm text-muted-text">
            <Building2 className="h-4 w-4" />
            No organizations in the directory yet.
          </div>
        )}
      </div>
    </div>
  );
}

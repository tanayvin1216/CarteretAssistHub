import Link from 'next/link';
import { ArrowRight, Building2, HandHeart, Inbox } from 'lucide-react';
import { requireOrgSession } from '@/lib/portal/session';
import type { Organization } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function PortalOverviewPage() {
  const { supabase, organizationId } = await requireOrgSession();

  const [orgRes, rolesRes, appsRes] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', organizationId).maybeSingle(),
    supabase
      .from('volunteer_needs')
      .select('id, is_active')
      .eq('organization_id', organizationId),
    supabase
      .from('volunteer_applications')
      .select('id, status')
      .eq('organization_id', organizationId),
  ]);

  const org = orgRes.data as Organization | null;
  const roles = (rolesRes.data ?? []) as Array<{ id: string; is_active: boolean }>;
  const apps = (appsRes.data ?? []) as Array<{ id: string; status: string }>;

  const openRoles = roles.filter((r) => r.is_active).length;
  const pending = apps.filter((a) => a.status === 'pending').length;

  // Nudges toward the parts of a listing that most often go unfilled — a
  // listing without hours or a description is the one residents skip past.
  const gaps: string[] = [];
  if (org) {
    if (!org.phone?.trim()) gaps.push('a phone number');
    if (!org.mission?.trim()) gaps.push('a short description of what you do');
    if (!org.assistance_types?.length) gaps.push('the services you offer');
    if (!org.hours_notes?.trim() && !org.operating_hours) gaps.push('your hours');
    if (!org.website?.trim() && !org.email?.trim()) gaps.push('a website or email');
  }

  return (
    <div className="px-8 py-10 max-w-5xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· Portal</p>
      <h1 className="text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight mb-3">
        {org?.name ?? 'Your organization'}
      </h1>
      <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-10">
        Everything here is yours to change, and it goes live on the public directory as soon as you
        save. Sector placement and featured position stay with the Community Service Committee.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Stat
          href="/portal/applications"
          icon={<Inbox className="h-4 w-4" />}
          value={pending}
          label="Applications waiting"
          sub={`${apps.length} received in total`}
        />
        <Stat
          href="/portal/roles"
          icon={<HandHeart className="h-4 w-4" />}
          value={openRoles}
          label="Open volunteer roles"
          sub={`${roles.length} posted in total`}
        />
        <Stat
          href="/portal/listing"
          icon={<Building2 className="h-4 w-4" />}
          value={org?.is_active ? 'Live' : 'Hidden'}
          label="Listing status"
          sub={org?.is_active ? 'Visible in the directory' : 'Not shown to the public'}
        />
      </div>

      {gaps.length > 0 && (
        <div className="border border-divider bg-sand rounded-sm px-5 py-4 mb-10">
          <p className="text-sm font-semibold text-ink mb-1.5">Your listing is missing {gaps.length === 1 ? 'one thing' : `${gaps.length} things`}</p>
          <p className="text-sm text-body-text leading-relaxed mb-3">
            People searching the directory look for {gaps.join(', ')}.
          </p>
          <Link
            href="/portal/listing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            Fill it in
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="border-t border-divider pt-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-3">
          Need something changed that isn&apos;t here?
        </p>
        <p className="text-sm text-body-text leading-relaxed max-w-2xl">
          Sector placement, featured position, and removing your organization from the directory
          entirely are handled by the committee. Email{' '}
          <a
            href="mailto:communityservicecarteret@gmail.com"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            communityservicecarteret@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Stat({
  href,
  icon,
  value,
  label,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  value: number | string;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-card border border-divider rounded-sm px-5 py-5 hover:border-ink transition-colors"
    >
      <div className="flex items-center gap-2 text-muted-text mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-3xl text-ink tabular-nums leading-none mb-2">{value}</p>
      <p className="text-xs text-muted-text">{sub}</p>
    </Link>
  );
}

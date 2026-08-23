'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  HandHeart,
  Inbox,
  LogOut,
  ExternalLink,
  ArrowLeftRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { leaveOrgPortal } from '@/lib/portal/assist-actions';

const NAV = [
  { href: '/portal', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/portal/listing', label: 'Our listing', icon: Building2 },
  { href: '/portal/roles', label: 'Volunteer roles', icon: HandHeart },
  { href: '/portal/applications', label: 'Applications', icon: Inbox },
];

export function PortalShell({
  organizationName,
  organizationId,
  userEmail,
  assisting = false,
  children,
}: {
  organizationName: string;
  organizationId: string;
  userEmail: string;
  /** An Assist Hub admin working inside this organization's portal. */
  assisting?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out.');
    router.push('/portal/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="block">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-semibold">
              Organization portal
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-extrabold tracking-tight leading-none text-white">
                Assist
              </span>
              <span className="text-xl font-extrabold tracking-tight leading-none text-white/70">
                Hub
              </span>
            </div>
          </Link>
          <p className="text-xs text-white/60 mt-3 leading-snug">{organizationName}</p>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          {assisting && (
            <Link
              href="/portal/select"
              className="flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Switch organization
            </Link>
          )}
          <Link
            href={`/organizations/${organizationId}`}
            className="flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public page
          </Link>
          {assisting ? (
            // Signing out here would end the admin's own session, which is not
            // what "I am done helping this org" means.
            <form action={leaveOrgPortal}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                Back to admin
              </button>
            </form>
          ) : (
            <button
              onClick={onSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          )}
          <div className="px-3 pt-2 pb-1 text-[10px] text-white/30 break-all">{userEmail}</div>
        </div>
      </aside>

      <main className="bg-canvas min-w-0">
        {assisting && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-8 py-3 bg-sand border-b border-divider">
            <ShieldCheck className="h-4 w-4 text-ink shrink-0" />
            <p className="text-sm text-ink">
              <span className="font-semibold">Admin view.</span> You are working inside{' '}
              {organizationName}&apos;s portal. Anything you save here is the organization&apos;s
              own record and goes live immediately.
            </p>
            <form action={leaveOrgPortal} className="ml-auto">
              <button
                type="submit"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Leave admin view
              </button>
            </form>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

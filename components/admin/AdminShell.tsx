'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Building2,
  HandHeart,
  Users,
  UserCog,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/sectors', label: 'Sectors', icon: Boxes },
  { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin/volunteer-needs', label: 'Volunteer roles', icon: HandHeart },
  { href: '/admin/applications', label: 'Applications', icon: Users },
  { href: '/admin/subcommittee-leads', label: 'Subcommittee leads', icon: UserCog },
];

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
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
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="block">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-semibold">
              Admin
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
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public site
          </Link>
          <button
            onClick={onSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors text-left"
          >
            <LogOut className="h-3.5 w-3.5" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
          <div className="px-3 pt-2 pb-1 text-[10px] text-white/30 break-all">
            {userEmail}
          </div>
        </div>
      </aside>

      <main className="bg-canvas min-w-0">{children}</main>
    </div>
  );
}

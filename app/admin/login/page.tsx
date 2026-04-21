import { LoginForm } from '@/components/admin/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage =
    error === 'not_admin'
      ? 'That account is not an admin. Ask the community-service committee to upgrade it.'
      : null;

  return (
    <div className="min-h-screen bg-ivory grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex relative flex-col justify-between bg-ink text-ivory p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-ivory/60 hover:text-ivory transition-colors w-fit"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-ivory/50 mb-6">
            Community Service Committee
          </p>
          <h1 className="font-display text-5xl leading-[1.02] tracking-[-0.01em] mb-6">
            Carteret <span className="italic text-sector-food">Assist</span> Hub — Admin
          </h1>
          <p className="text-sm text-ivory/70 max-w-md leading-relaxed">
            Manage sectors, organizations, subcommittee leadership, volunteer roles, and applications
            across every issue area in the county.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/30">
          · admin · v1
        </p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {errorMessage && (
            <p className="mb-5 text-xs text-destructive border-l-2 border-destructive pl-3">
              {errorMessage}
            </p>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

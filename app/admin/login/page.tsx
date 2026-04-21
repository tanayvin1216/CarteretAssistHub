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
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-primary text-white p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
        <div>
          <div className="flex items-baseline gap-0.5 mb-8">
            <span className="text-2xl font-extrabold tracking-tight leading-none">Assist</span>
            <span className="text-2xl font-extrabold tracking-tight leading-none text-white/70">Hub</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Admin dashboard
          </h1>
          <p className="text-base text-white/80 leading-relaxed max-w-md">
            Manage sectors, organizations, subcommittee leadership, volunteer roles, and
            applications across Carteret County.
          </p>
        </div>
        <p className="text-xs text-white/50">
          Carteret County Community Service Committee
        </p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {errorMessage && (
            <div className="mb-5 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

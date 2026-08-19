import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { OrgLoginForm } from '@/components/portal/OrgLoginForm';

export const metadata = {
  title: 'Organization sign-in · Carteret Assist Hub',
};

const ERRORS: Record<string, string> = {
  not_org:
    'That account is not attached to an organization. If your organization should have portal access, ask the Community Service Committee to set it up.',
  no_org:
    'This account represents an organization that is no longer in the directory. Contact the Community Service Committee.',
};

export default async function OrgPortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERRORS[error] ?? null : null;

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
            <span className="text-2xl font-extrabold tracking-tight leading-none text-white/70">
              Hub
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">Organization portal</h1>
          <p className="text-base text-white/80 leading-relaxed max-w-md">
            Update your listing, post volunteer roles, and work the applications people send you —
            all without going through the county advisor.
          </p>
        </div>
        <p className="text-xs text-white/50">Carteret County Community Service Committee</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {errorMessage && (
            <div className="mb-5 text-sm text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <OrgLoginForm />

          <div className="mt-8 pt-6 border-t border-divider space-y-4">
            <div>
              <p className="text-xs font-semibold text-ink mb-1.5">No login yet?</p>
              <p className="text-xs text-body-text leading-relaxed mb-2">
                The committee creates one account per organization and sends you the password.
              </p>
              <a
                href="mailto:communityservicecarteret@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline underline-offset-4"
              >
                <Mail className="h-4 w-4" />
                communityservicecarteret@gmail.com
              </a>
            </div>
            <p className="text-xs text-muted-text">
              County admin?{' '}
              <Link
                href="/admin/login"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Admin sign-in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export const metadata = {
  title: 'Organization portal · Coming soon · Carteret Assist Hub',
};

export default function OrgPortalComingSoon() {
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
            Organization portal
          </h1>
          <p className="text-base text-white/80 leading-relaxed max-w-md">
            Update your listing, post volunteer roles, and review applications — all without going
            through the county advisor.
          </p>
        </div>
        <p className="text-xs text-white/50">Coming in v1.1</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <p className="text-sm font-semibold text-primary mb-2">Coming soon</p>
          <h2 className="text-2xl font-bold text-ink leading-tight mb-4">
            We&apos;re onboarding organizations one at a time.
          </h2>
          <p className="text-sm text-body-text leading-relaxed mb-6">
            In this release, edits are coordinated through the Carteret County Community Service
            Committee. Self-service sign-in for organizations arrives in the next release.
          </p>
          <div className="bg-sand border border-divider rounded-lg p-4">
            <p className="text-xs font-semibold text-ink mb-2">Reach us in the meantime</p>
            <a
              href="mailto:committee@carteretassisthub.org"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline underline-offset-4"
            >
              <Mail className="h-4 w-4" />
              committee@carteretassisthub.org
            </a>
          </div>
          <p className="text-xs text-muted-text mt-6 pt-6 border-t border-divider">
            County admin?{' '}
            <Link href="/admin/login" className="text-primary font-semibold hover:underline underline-offset-4">
              Admin sign-in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

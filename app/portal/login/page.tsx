import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export const metadata = {
  title: 'Organization portal · Coming soon · Carteret Assist Hub',
};

export default function OrgPortalComingSoon() {
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
            For listed non-profits
          </p>
          <h1 className="font-display text-5xl leading-[1.02] tracking-[-0.01em] mb-6">
            Organization <span className="italic text-sector-food">portal</span>.
          </h1>
          <p className="text-sm text-ivory/70 max-w-md leading-relaxed">
            Update your listing, post volunteer roles, and review applications — all without
            going through the county advisor.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/30">· v1.1 · coming soon</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <p className="text-[11px] uppercase tracking-[0.22em] text-sector-food mb-3">
            · Coming soon
          </p>
          <h2 className="font-display text-3xl text-ink leading-tight mb-4">
            We&apos;re onboarding organizations one at a time.
          </h2>
          <p className="text-sm text-body-text leading-relaxed mb-8">
            In this release, edits are coordinated through the Carteret County Community Service
            Committee. Self-service sign-in for organizations arrives in the next release.
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-text mb-2">
            Reach us in the meantime
          </p>
          <a
            href="mailto:committee@carteretassisthub.org"
            className="inline-flex items-center gap-2 h-11 px-4 bg-ink text-ivory text-sm rounded-sm hover:bg-navy transition-colors"
          >
            <Mail className="h-4 w-4" />
            committee@carteretassisthub.org
          </a>
          <p className="text-xs text-muted-text mt-6 pt-6 border-t border-rule/40">
            Already a county admin?{' '}
            <Link href="/admin/login" className="underline text-ink">
              Admin sign-in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Check } from 'lucide-react';

export default function ThanksPage() {
  return (
    <section className="min-h-[60vh] flex items-center bg-background">
      <div className="container-readable max-w-2xl py-20 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-seafoam-tint text-primary-600 mb-6">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-4xl md:text-[3rem] leading-[1.1] text-ink mb-3">
          Application sent.
        </h1>
        <p className="text-base text-body-text leading-relaxed max-w-md mx-auto mb-8">
          The organization will reach out directly — usually within a few days. Thanks for stepping up.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 h-11 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors"
          >
            Back to volunteer roles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-11 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors shadow-sm"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}

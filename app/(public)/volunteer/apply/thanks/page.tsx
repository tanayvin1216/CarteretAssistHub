import Link from 'next/link';
import { Check } from 'lucide-react';

export default function ThanksPage() {
  return (
    <section className="min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sector-environment/10 mb-6">
          <Check className="h-6 w-6 text-sector-environment" />
        </div>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-4">
          Application sent.
        </h1>
        <p className="text-base text-body-text leading-relaxed max-w-md mx-auto mb-8">
          The organization will reach out directly — usually within a few days. Thanks for stepping up.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 h-11 px-5 border border-ink/30 text-ink text-sm font-medium rounded-full hover:border-ink transition-colors"
          >
            Back to volunteer roles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-11 px-5 bg-ink text-ivory text-sm font-medium rounded-full hover:bg-navy transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}

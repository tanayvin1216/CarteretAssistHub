import Link from 'next/link';
import { Check } from 'lucide-react';

export default function ReportThanksPage() {
  return (
    <section className="min-h-[60vh] flex items-center bg-background">
      <div className="container-readable max-w-2xl py-20 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-seafoam-tint text-primary-600 mb-6">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-4xl md:text-[3rem] leading-[1.1] text-ink mb-3">
          Report received.
        </h1>
        <p className="text-base text-body-text leading-relaxed max-w-md mx-auto mb-8">
          The community service committee reviews reports at its regular meetings. If you left
          contact details and we need more, someone will reach out.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 h-11 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors"
          >
            Browse sectors
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

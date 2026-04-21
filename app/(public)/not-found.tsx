import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="sector-numeral text-sm text-rule tracking-[0.25em] uppercase mb-6">
          · 404 ·
        </p>
        <h1 className="font-display text-6xl md:text-7xl text-ink leading-[0.95] tracking-[-0.02em] mb-6">
          Not found.
        </h1>
        <p className="text-sm text-body-text mb-8">
          This page either moved or was never here to begin with.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-11 px-5 bg-ink text-ivory text-sm font-medium rounded-full"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

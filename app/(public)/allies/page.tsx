import Link from 'next/link';
import { Mail, ArrowUpRight, HandCoins, Network, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const metadata = {
  title: 'Allies & Funders · Carteret Assist Hub',
  description:
    'Local foundations, giving circles, and peer-support networks that fund and resource Carteret County non-profits.',
};

interface Ally {
  slug: string;
  name: string;
  kind: string;
  icon: LucideIcon;
  lede: string;
  body: string;
  supports: string[];
  cta?: string;
}

// Seeded directly. Once the committee wants more entries — or wants partners to
// edit their own — promote this to a Supabase `allies` table with the same shape.
const ALLIES: Ally[] = [
  {
    slug: 'chamber-young-professionals',
    name: 'Carteret County Chamber Young Professionals',
    kind: 'Giving circle',
    icon: HandCoins,
    lede: 'Funds youth and young-adult education and workforce-training programs across the county.',
    body: 'A network of young professionals organized through the Carteret County Chamber of Commerce. Their giving focuses on the next generation — education, workforce training, and pathways into local careers. Actively looking to expand their roster of beneficiary non-profits.',
    supports: ['Youth', 'Education', 'Workforce training'],
    cta: 'Looking for funded beneficiaries',
  },
  {
    slug: 'beaufort-community-foundation',
    name: 'Beaufort Community Foundation',
    kind: 'Community foundation',
    icon: Sparkles,
    lede: 'Funds community projects led by Carteret County non-profits across multiple sectors.',
    body: 'A local source of project-based grants for non-profits doing direct community work. Operates across sectors — housing, education, the arts, and more — and is one of the most consistent funding partners for organizations on this hub.',
    supports: ['Community projects', 'Multi-sector grants'],
  },
  {
    slug: 'crystal-coast-nonprofit-network',
    name: 'Crystal Coast Nonprofit Network',
    kind: 'Peer network',
    icon: Network,
    lede: 'Peer-to-peer support, training, and shared resources for non-profits on the Crystal Coast.',
    body: 'Capacity-building rather than funding. A useful first stop for non-profits seeking guidance, board training, fundraising support, or simply other organizations to learn alongside.',
    supports: ['Peer support', 'Training', 'Capacity-building'],
  },
];

export default function AlliesPage() {
  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable max-w-4xl py-12 md:py-16">
          <p className="text-xs md:text-[13px] font-semibold uppercase tracking-[0.2em] text-muted-text mb-4">
            The network behind the network
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            Allies &amp; Funders
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
            Local foundations, giving circles, and peer-support networks that fund and resource
            Carteret County non-profits. They don&apos;t serve residents directly — they make sure
            the organizations that do can keep going.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable max-w-5xl py-12 md:py-16">
          <ul className="space-y-5 md:space-y-6">
            {ALLIES.map((ally) => {
              const Icon = ally.icon;
              return (
                <li
                  key={ally.slug}
                  className="bg-surface border border-divider rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-text mb-1.5">
                        {ally.kind}
                      </p>
                      <h2 className="text-xl md:text-2xl font-bold text-ink leading-tight mb-2">
                        {ally.name}
                      </h2>
                      <p className="text-[15px] md:text-base text-ink leading-relaxed mb-3">
                        {ally.lede}
                      </p>
                      <p className="text-[15px] text-body-text leading-relaxed mb-4">
                        {ally.body}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {ally.supports.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center h-7 px-2.5 bg-sand border border-divider rounded-full text-[12px] font-medium text-body-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {ally.cta && (
                        <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          {ally.cta}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-sand border-t border-divider">
        <div className="container-readable max-w-3xl py-12 md:py-16">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            Are you a supporting organization?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink leading-tight mb-3">
            If your group funds, trains, or backs Carteret County non-profits, you belong here.
          </h2>
          <p className="text-[15px] md:text-base text-body-text leading-relaxed mb-6 max-w-2xl">
            Foundations, civic clubs, giving circles, faith-based grant programs, professional
            associations — anyone who resources the organizations doing direct community work.
            Email the committee and we&apos;ll get you listed.
          </p>
          <a
            href="mailto:committee@carteretassisthub.org"
            className="inline-flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors"
          >
            <Mail className="h-4 w-4" />
            committee@carteretassisthub.org
          </a>
          <div className="mt-8 pt-8 border-t border-divider flex items-center gap-4 flex-wrap">
            <Link
              href="/sectors"
              className="text-sm text-body-text hover:text-primary font-medium"
            >
              Browse the 13 sectors →
            </Link>
            <Link
              href="/about"
              className="text-sm text-body-text hover:text-primary font-medium"
            >
              About the hub →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

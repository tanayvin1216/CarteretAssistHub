import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SECTORS } from '@/lib/sectors';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [sectorsRes, orgsRes, needsRes, appsRes] = await Promise.all([
    supabase.from('sectors').select('id, slug, name, status, accent_color, numeral'),
    supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('volunteer_needs').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('volunteer_applications')
      .select('id, status', { count: 'exact' })
      .order('created_at', { ascending: false }),
  ]);

  const sectors = (sectorsRes.data ?? []) as Array<{ id: string; slug: string; name: string; status: string; accent_color: string; numeral: string }>;
  const applications = (appsRes.data ?? []) as Array<{ id: string; status: string }>;
  const pending = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="px-8 py-10 max-w-6xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">
        · Overview
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Stat label="Sectors" value={sectors.length || 13} note={`${sectors.filter((s) => s.status === 'active').length} active`} />
        <Stat label="Organizations" value={orgsRes.count ?? 0} />
        <Stat label="Open volunteer roles" value={needsRes.count ?? 0} />
        <Stat label="Applications" value={appsRes.count ?? 0} note={pending > 0 ? `${pending} pending` : undefined} />
      </div>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Sectors</h2>
          <Link href="/admin/sectors" className="text-sm text-muted-text hover:text-ink">
            Manage →
          </Link>
        </div>
        <ol className="border-t border-rule/40 bg-card rounded-sm overflow-hidden">
          {SECTORS.map((meta) => {
            const row = sectors.find((s) => s.slug === meta.slug);
            return (
              <li key={meta.slug} className="border-b border-rule/40">
                <Link
                  href={`/admin/sectors#${meta.slug}`}
                  className="grid grid-cols-12 items-center gap-4 px-5 py-3.5 hover:bg-ivory-deep/40 transition-colors"
                >
                  <span
                    className="col-span-1 inline-block w-2 h-2 rounded-[1px]"
                    style={{ backgroundColor: row?.accent_color ?? meta.accentHex }}
                  />
                  <span className="col-span-1 sector-numeral text-xs text-rule tabular-nums">
                    {meta.numeral}
                  </span>
                  <span className="col-span-7 font-display text-base text-ink">{meta.name}</span>
                  <span className="col-span-2 text-[10px] uppercase tracking-[0.18em] text-muted-text">
                    {row?.status ?? 'not seeded'}
                  </span>
                  <ArrowUpRight className="col-span-1 h-4 w-4 text-rule justify-self-end" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="bg-card border border-rule/40 p-5 rounded-sm">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-text mb-2">{label}</p>
      <p className="font-display text-4xl text-ink tabular-nums leading-none">{value}</p>
      {note && <p className="text-[11px] text-muted-text mt-2">{note}</p>}
    </div>
  );
}

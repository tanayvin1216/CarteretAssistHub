'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Sector } from '@/types/database';
import { SECTORS } from '@/lib/sectors';
import { AdminPageHeader } from './AdminPageHeader';

export function SectorsAdmin({ sectors: initial }: { sectors: Sector[] }) {
  const [sectors, setSectors] = useState<Sector[]>(initial);

  const onStatusChange = async (id: string, next: Sector['status']) => {
    const prev = sectors.find((s) => s.id === id)?.status;
    setSectors((cur) => cur.map((s) => (s.id === id ? { ...s, status: next } : s)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('sectors') as any)
      .update({ status: next })
      .eq('id', id);
    if (error) {
      // Roll back so UI matches DB — avoids silent drift when RLS blocks the write.
      if (prev !== undefined) {
        setSectors((cur) => cur.map((s) => (s.id === id ? { ...s, status: prev } : s)));
      }
      toast.error('Update failed.');
      console.error(error);
    } else {
      toast.success('Status updated.');
    }
  };

  return (
    <div className="px-8 py-10 max-w-6xl">
      <AdminPageHeader eyebrow="Manage" title="Sectors" />
      <table className="w-full bg-card border border-rule/40 rounded-sm overflow-hidden">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-text border-b border-rule/40">
            <th className="px-4 py-3 w-14">No.</th>
            <th className="px-4 py-3">Sector</th>
            <th className="px-4 py-3 w-28">Accent</th>
            <th className="px-4 py-3 w-40">Status</th>
          </tr>
        </thead>
        <tbody>
          {SECTORS.map((meta) => {
            const row = sectors.find((s) => s.slug === meta.slug);
            return (
              <tr key={meta.slug} id={meta.slug} className="border-b border-rule/40 hover:bg-ivory-deep/30">
                <td className="px-4 py-3 sector-numeral text-xs text-rule tabular-nums">
                  {meta.numeral}
                </td>
                <td className="px-4 py-3">
                  <p className="font-display text-base text-ink">{meta.name}</p>
                  <p className="text-xs text-muted-text">{meta.shortDescription}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-[1px]"
                      style={{ backgroundColor: row?.accent_color ?? meta.accentHex }}
                    />
                    <code className="text-xs text-muted-text">{row?.accent_color ?? meta.accentHex}</code>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row ? (
                    <select
                      value={row.status}
                      onChange={(e) => onStatusChange(row.id, e.target.value as Sector['status'])}
                      className="h-8 px-2 text-xs bg-card border border-rule/60 rounded-sm"
                    >
                      <option value="forming">Forming</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  ) : (
                    <span className="text-xs text-muted-text">Not seeded — run seed.sql</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sectors.length === 0 && (
        <p className="mt-6 text-sm text-muted-text">
          No sectors in the database yet. Run{' '}
          <code className="text-ink">supabase/seed.sql</code> to populate the 13 canonical sectors.
        </p>
      )}
    </div>
  );
}

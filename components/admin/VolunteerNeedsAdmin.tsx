'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { VolunteerNeed } from '@/types/database';
import { AdminPageHeader } from './AdminPageHeader';
import { sectorBySlug } from '@/lib/sectors';

type NeedWithOrg = VolunteerNeed & {
  organization?: { id: string; name: string; sector_slug: string | null } | null;
};

interface Props {
  needs: NeedWithOrg[];
  organizations: Array<{ id: string; name: string; sector_slug: string | null }>;
}

type Draft = Partial<VolunteerNeed> & {
  organization_id: string;
  title: string;
  description: string;
  is_active: boolean;
};

const EMPTY: Draft = {
  organization_id: '',
  title: '',
  description: '',
  time_commitment: '',
  is_active: true,
};

export function VolunteerNeedsAdmin({ needs: initial, organizations }: Props) {
  const [needs, setNeeds] = useState<NeedWithOrg[]>(initial);
  const [editing, setEditing] = useState<Draft | null>(null);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.organization_id || !editing.title || !editing.description) {
      toast.error('Organization, title, and description are required.');
      return;
    }
    const org = organizations.find((o) => o.id === editing.organization_id);
    const payload = {
      organization_id: editing.organization_id,
      title: editing.title,
      description: editing.description,
      time_commitment: editing.time_commitment || null,
      needed_date: editing.needed_date || null,
      is_active: editing.is_active,
      sector_slug: org?.sector_slug ?? null,
      contact_email: editing.contact_email || null,
    };

    const supabase = createClient();
    if (editing.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('volunteer_needs') as any;
      const { data, error } = await builder.update(payload).eq('id', editing.id).select('*, organization:organizations(id, name, sector_slug)').single();
      if (error) { toast.error(error.message); return; }
      setNeeds((cur) => cur.map((n) => (n.id === editing.id ? (data as NeedWithOrg) : n)));
      toast.success('Updated.');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('volunteer_needs') as any;
      const { data, error } = await builder.insert(payload).select('*, organization:organizations(id, name, sector_slug)').single();
      if (error) { toast.error(error.message); return; }
      setNeeds((cur) => [data as NeedWithOrg, ...cur]);
      toast.success('Role posted.');
    }
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this volunteer role?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('volunteer_needs').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setNeeds((cur) => cur.filter((n) => n.id !== id));
    toast.success('Deleted.');
  };

  return (
    <div className="px-8 py-10 max-w-6xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Volunteer roles"
        action={
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-ivory text-sm font-medium rounded-full hover:bg-navy transition-colors"
          >
            <Plus className="h-4 w-4" /> New role
          </button>
        }
      />

      <table className="w-full bg-card border border-rule/40 rounded-sm overflow-hidden">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-text border-b border-rule/40">
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 w-52">Organization</th>
            <th className="px-4 py-3 w-32">Sector</th>
            <th className="px-4 py-3 w-24">Status</th>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {needs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-sm text-muted-text text-center">
                No volunteer roles posted yet.
              </td>
            </tr>
          ) : needs.map((n) => {
            const sector = n.sector_slug ? sectorBySlug(n.sector_slug) : null;
            return (
              <tr key={n.id} className="border-b border-rule/40 hover:bg-ivory-deep/30">
                <td className="px-4 py-3">
                  <p className="font-display text-base text-ink">{n.title}</p>
                  <p className="text-xs text-muted-text line-clamp-1 mt-0.5">
                    {n.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm">{n.organization?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  {sector && (
                    <span
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: sector.accentHex }}
                    >
                      {sector.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {n.is_active ? (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-sector-environment">Open</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-text">Closed</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing({
                    id: n.id,
                    organization_id: n.organization_id,
                    title: n.title,
                    description: n.description,
                    time_commitment: n.time_commitment,
                    needed_date: n.needed_date,
                    is_active: n.is_active,
                    contact_email: n.contact_email,
                  })} className="text-muted-text hover:text-ink mr-2">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => onDelete(n.id)} className="text-muted-text hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto">
          <div className="bg-ivory w-full max-w-xl rounded-sm shadow-xl my-8">
            <div className="px-6 py-4 border-b border-rule/40 flex items-center justify-between">
              <h3 className="font-display text-xl text-ink">
                {editing.id ? 'Edit role' : 'New volunteer role'}
              </h3>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-auto">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
                  Organization
                </label>
                <select
                  value={editing.organization_id}
                  onChange={(e) => setEditing({ ...editing, organization_id: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-rule/60 rounded-sm text-sm"
                >
                  <option value="">— pick an org —</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">Title</label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-rule/60 rounded-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={5}
                  className="w-full p-3 bg-card border border-rule/60 rounded-sm text-sm leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">Time commitment</label>
                  <input
                    value={editing.time_commitment ?? ''}
                    onChange={(e) => setEditing({ ...editing, time_commitment: e.target.value })}
                    placeholder="e.g. 3 hrs / week"
                    className="w-full h-10 px-3 bg-card border border-rule/60 rounded-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">Needed by (date)</label>
                  <input
                    type="date"
                    value={editing.needed_date ?? ''}
                    onChange={(e) => setEditing({ ...editing, needed_date: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-rule/60 rounded-sm text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Open / visible on public site
              </label>
            </div>
            <div className="px-6 py-4 border-t border-rule/40 flex items-center justify-end gap-3">
              <button onClick={() => setEditing(null)} className="h-10 px-4 text-sm text-muted-text">
                Cancel
              </button>
              <button
                onClick={onSave}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-ivory text-sm font-medium rounded-full"
              >
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

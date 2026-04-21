'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { SubcommitteeLead } from '@/types/database';
import { AdminPageHeader } from './AdminPageHeader';

interface Sector {
  id: string;
  slug: string;
  name: string;
  accent_color: string;
  numeral: string;
}

type Draft = Partial<SubcommitteeLead> & {
  sector_id: string;
  name: string;
  role: SubcommitteeLead['role'];
};

export function SubcommitteeLeadsAdmin({
  sectors,
  leads: initial,
}: {
  sectors: Sector[];
  leads: SubcommitteeLead[];
}) {
  const [leads, setLeads] = useState<SubcommitteeLead[]>(initial);
  const [editing, setEditing] = useState<Draft | null>(null);

  const onSave = async () => {
    if (!editing || !editing.sector_id || !editing.name) {
      toast.error('Sector + name required');
      return;
    }
    const supabase = createClient();
    const payload = {
      sector_id: editing.sector_id,
      name: editing.name,
      role: editing.role,
      email: editing.email || null,
      phone: editing.phone || null,
      affiliation: editing.affiliation || null,
      bio: editing.bio || null,
      display_order: editing.display_order ?? 0,
    };
    if (editing.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('subcommittee_leads') as any;
      const { data, error } = await builder.update(payload).eq('id', editing.id).select('*').single();
      if (error) { toast.error(error.message); return; }
      setLeads((cur) => cur.map((l) => (l.id === editing.id ? (data as SubcommitteeLead) : l)));
      toast.success('Saved.');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('subcommittee_leads') as any;
      const { data, error } = await builder.insert(payload).select('*').single();
      if (error) { toast.error(error.message); return; }
      setLeads((cur) => [...cur, data as SubcommitteeLead]);
      toast.success('Lead added.');
    }
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Remove this person?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('subcommittee_leads').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setLeads((cur) => cur.filter((l) => l.id !== id));
    toast.success('Removed.');
  };

  return (
    <div className="px-8 py-10 max-w-6xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Subcommittee leadership"
        action={
          <button
            onClick={() =>
              setEditing({ sector_id: sectors[0]?.id ?? '', name: '', role: 'lead', display_order: 0 })
            }
            className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full"
          >
            <Plus className="h-4 w-4" /> Add person
          </button>
        }
      />

      <div className="space-y-8">
        {sectors.map((sector) => {
          const rows = leads.filter((l) => l.sector_id === sector.id);
          return (
            <section key={sector.id}>
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="inline-block w-2 h-2 rounded-[1px]"
                  style={{ backgroundColor: sector.accent_color }}
                />
                <span className="text-xs text-rule tabular-nums">
                  {sector.numeral}
                </span>
                <h2 className="text-xl text-ink">{sector.name}</h2>
                <span className="text-xs text-muted-text">({rows.length})</span>
              </div>
              {rows.length === 0 ? (
                <p className="text-xs text-muted-text italic ml-6">No leads assigned yet.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                  {rows.map((lead) => (
                    <li key={lead.id} className="bg-card border border-divider p-4 rounded-sm">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-text">
                        {lead.role}
                      </p>
                      <p className="text-base text-ink leading-tight mt-1">
                        {lead.name}
                      </p>
                      {lead.affiliation && (
                        <p className="text-xs text-muted-text italic">{lead.affiliation}</p>
                      )}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-divider">
                        <button onClick={() => setEditing(lead as Draft)} className="text-xs text-muted-text hover:text-ink flex items-center gap-1">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button onClick={() => onDelete(lead.id)} className="text-xs text-muted-text hover:text-destructive flex items-center gap-1">
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-canvas w-full max-w-lg rounded-sm shadow-xl">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <h3 className="text-xl text-ink">{editing.id ? 'Edit person' : 'Add person'}</h3>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-auto">
              <Row label="Sector">
                <select
                  value={editing.sector_id}
                  onChange={(e) => setEditing({ ...editing, sector_id: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                >
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Row>
              <Row label="Role">
                <select
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value as SubcommitteeLead['role'] })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                >
                  <option value="lead">Lead</option>
                  <option value="co-lead">Co-Lead</option>
                  <option value="member">Member</option>
                </select>
              </Row>
              <Row label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </Row>
              <Row label="Affiliation">
                <input
                  value={editing.affiliation ?? ''}
                  onChange={(e) => setEditing({ ...editing, affiliation: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </Row>
              <div className="grid grid-cols-2 gap-4">
                <Row label="Email">
                  <input
                    value={editing.email ?? ''}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </Row>
                <Row label="Phone">
                  <input
                    value={editing.phone ?? ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </Row>
              </div>
              <Row label="Bio (optional)">
                <textarea
                  value={editing.bio ?? ''}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-card border border-divider rounded-sm text-sm"
                />
              </Row>
            </div>
            <div className="px-6 py-4 border-t border-divider flex items-center justify-end gap-3">
              <button onClick={() => setEditing(null)} className="h-10 px-4 text-sm text-muted-text">
                Cancel
              </button>
              <button
                onClick={onSave}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full"
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">{label}</label>
      {children}
    </div>
  );
}

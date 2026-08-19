'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { VolunteerNeed } from '@/types/database';

type Draft = {
  id?: string;
  title: string;
  title_es: string;
  description: string;
  description_es: string;
  time_commitment: string;
  needed_date: string;
  contact_email: string;
  is_active: boolean;
};

const EMPTY: Draft = {
  title: '',
  title_es: '',
  description: '',
  description_es: '',
  time_commitment: '',
  needed_date: '',
  contact_email: '',
  is_active: true,
};

const FIELD =
  'w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink';

export function OrgRolesManager({
  needs: initial,
  organizationId,
  sectorSlug,
}: {
  needs: VolunteerNeed[];
  organizationId: string;
  sectorSlug: string | null;
}) {
  const [needs, setNeeds] = useState<VolunteerNeed[]>(initial);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.description.trim()) {
      toast.error('A role needs a title and a description.');
      return;
    }
    setSaving(true);

    const payload = {
      organization_id: organizationId,
      title: editing.title.trim(),
      title_es: editing.title_es.trim() || null,
      description: editing.description.trim(),
      description_es: editing.description_es.trim() || null,
      time_commitment: editing.time_commitment.trim() || null,
      needed_date: editing.needed_date || null,
      contact_email: editing.contact_email.trim() || null,
      is_active: editing.is_active,
      // Roles inherit the organization's sector so they appear on the right
      // sector page without a join on every read.
      sector_slug: sectorSlug,
    };

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder = supabase.from('volunteer_needs') as any;

    if (editing.id) {
      const { data, error } = await builder
        .update(payload)
        .eq('id', editing.id)
        .select('*')
        .single();
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      setNeeds((cur) => cur.map((n) => (n.id === editing.id ? (data as VolunteerNeed) : n)));
      toast.success('Role updated.');
    } else {
      const { data, error } = await builder.insert(payload).select('*').single();
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      setNeeds((cur) => [data as VolunteerNeed, ...cur]);
      toast.success('Role posted. It is live on the volunteer board.');
    }
    setEditing(null);
  };

  const onToggle = async (need: VolunteerNeed) => {
    const next = !need.is_active;
    setNeeds((cur) => cur.map((n) => (n.id === need.id ? { ...n, is_active: next } : n)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('volunteer_needs') as any)
      .update({ is_active: next })
      .eq('id', need.id);
    if (error) {
      setNeeds((cur) => cur.map((n) => (n.id === need.id ? { ...n, is_active: !next } : n)));
      toast.error(error.message);
      return;
    }
    toast.success(next ? 'Role reopened.' : 'Role closed.');
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this role? Applications already received are kept.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('volunteer_needs').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNeeds((cur) => cur.filter((n) => n.id !== id));
    toast.success('Deleted.');
  };

  return (
    <div className="px-8 py-10 max-w-4xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· Manage</p>
          <h1 className="text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight">
            Volunteer roles
          </h1>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New role
        </button>
      </div>

      <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-8">
        Anything you post here goes straight onto the countywide volunteer board, and the people who
        apply land in your Applications tab.
      </p>

      <div className="bg-card border border-divider rounded-sm overflow-hidden">
        {needs.length === 0 ? (
          <p className="p-10 text-sm text-muted-text text-center">
            No roles posted yet. Click <em>New role</em> to put one on the board.
          </p>
        ) : (
          <ol>
            {needs.map((need) => (
              <li
                key={need.id}
                className="flex items-start gap-4 px-5 py-4 border-b border-divider last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-base text-ink">{need.title}</p>
                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] ${
                        need.is_active ? 'text-sector-environment' : 'text-muted-text'
                      }`}
                    >
                      {need.is_active ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-text line-clamp-2 leading-relaxed">
                    {need.description}
                  </p>
                  {need.time_commitment && (
                    <p className="text-xs text-muted-text mt-1.5">{need.time_commitment}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggle(need)}
                    className="h-8 px-2.5 text-xs text-muted-text hover:text-ink transition-colors"
                  >
                    {need.is_active ? 'Close' : 'Reopen'}
                  </button>
                  <button
                    onClick={() =>
                      setEditing({
                        id: need.id,
                        title: need.title,
                        title_es: need.title_es ?? '',
                        description: need.description,
                        description_es: need.description_es ?? '',
                        time_commitment: need.time_commitment ?? '',
                        needed_date: need.needed_date ?? '',
                        contact_email: need.contact_email ?? '',
                        is_active: need.is_active,
                      })
                    }
                    aria-label="Edit"
                    className="p-1.5 text-muted-text hover:text-ink transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(need.id)}
                    aria-label="Delete"
                    className="p-1.5 text-muted-text hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto">
          <div className="bg-canvas w-full max-w-xl rounded-sm shadow-xl my-8">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <h3 className="text-xl text-ink">{editing.id ? 'Edit role' : 'New volunteer role'}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-text hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-auto">
              <Field label="Title">
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Saturday pantry helper"
                  className={FIELD}
                />
              </Field>
              <Field label="Title in Spanish" hint="Optional.">
                <input
                  value={editing.title_es}
                  onChange={(e) => setEditing({ ...editing, title_es: e.target.value })}
                  className={FIELD}
                />
              </Field>
              <Field label="Description" hint="What the volunteer will actually do, and what they need to bring or know.">
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={5}
                  className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed"
                />
              </Field>
              <Field label="Description in Spanish" hint="Optional.">
                <textarea
                  value={editing.description_es}
                  onChange={(e) => setEditing({ ...editing, description_es: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Time commitment">
                  <input
                    value={editing.time_commitment}
                    onChange={(e) => setEditing({ ...editing, time_commitment: e.target.value })}
                    placeholder="3 hrs / week"
                    className={FIELD}
                  />
                </Field>
                <Field label="Needed by">
                  <input
                    type="date"
                    value={editing.needed_date}
                    onChange={(e) => setEditing({ ...editing, needed_date: e.target.value })}
                    className={FIELD}
                  />
                </Field>
              </div>
              <Field label="Contact email for this role" hint="Optional — otherwise applications come to you here.">
                <input
                  value={editing.contact_email}
                  onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })}
                  className={FIELD}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Open — show on the public volunteer board
              </label>
            </div>
            <div className="px-6 py-4 border-t border-divider flex items-center justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="h-10 px-4 text-sm text-muted-text hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-text">{hint}</p>}
    </div>
  );
}

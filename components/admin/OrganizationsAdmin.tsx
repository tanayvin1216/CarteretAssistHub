'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil, Check, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Organization } from '@/types/database';
import { SECTORS, sectorBySlug } from '@/lib/sectors';
import { AdminPageHeader } from './AdminPageHeader';

interface Props {
  organizations: Organization[];
  sectors: Array<{ id: string; slug: string; name: string }>;
}

type Draft = {
  id?: string;
  name: string;
  town: string;
  zip: string;
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  mission?: string | null;
  assistance_types: string[];
  spanish_available: boolean;
  is_active: boolean;
  is_featured: boolean;
  display_order: number | null;
  sector_slug: string | null;
};

const EMPTY_DRAFT: Draft = {
  name: '',
  town: '',
  zip: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  mission: '',
  assistance_types: [],
  spanish_available: false,
  is_active: true,
  is_featured: false,
  display_order: null,
  sector_slug: null,
};

export function OrganizationsAdmin({ organizations: initial, sectors }: Props) {
  const [orgs, setOrgs] = useState<Organization[]>(initial);
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Draft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      if (sectorFilter !== 'all' && o.sector_slug !== sectorFilter) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.town.toLowerCase().includes(q) ||
        (o.email ?? '').toLowerCase().includes(q)
      );
    });
  }, [orgs, query, sectorFilter]);

  const startNew = () => setEditing({ ...EMPTY_DRAFT });
  const startEdit = (o: Organization) =>
    setEditing({
      id: o.id,
      name: o.name,
      town: o.town,
      zip: o.zip,
      address: o.address,
      phone: o.phone,
      email: o.email,
      website: o.website,
      mission: o.mission,
      assistance_types: o.assistance_types ?? [],
      spanish_available: o.spanish_available,
      is_active: o.is_active,
      is_featured: o.is_featured ?? false,
      display_order: o.display_order ?? null,
      sector_slug: o.sector_slug,
    });

  const toggleFeatured = async (o: Organization) => {
    const next = !o.is_featured;
    setOrgs((cur) => cur.map((x) => (x.id === o.id ? { ...x, is_featured: next } : x)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('organizations') as any)
      .update({ is_featured: next })
      .eq('id', o.id);
    if (error) {
      setOrgs((cur) => cur.map((x) => (x.id === o.id ? { ...x, is_featured: o.is_featured } : x)));
      toast.error('Update failed.');
    } else {
      toast.success(next ? 'Featured.' : 'Unfeatured.');
    }
  };

  const onSave = async () => {
    if (!editing) return;
    const supabase = createClient();
    const sectorId = editing.sector_slug
      ? sectors.find((s) => s.slug === editing.sector_slug)?.id ?? null
      : null;

    const payload = {
      name: editing.name,
      town: editing.town,
      zip: editing.zip || '',
      address: editing.address || '',
      phone: editing.phone || '',
      email: editing.email || null,
      website: editing.website || null,
      mission: editing.mission || null,
      assistance_types: editing.assistance_types,
      spanish_available: editing.spanish_available,
      is_active: editing.is_active,
      is_featured: editing.is_featured,
      display_order: editing.display_order,
      sector_slug: editing.sector_slug,
      sector_id: sectorId,
    };

    if (editing.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('organizations') as any;
      const { data, error } = await builder.update(payload).eq('id', editing.id).select('*').single();
      if (error) {
        toast.error(error.message);
        return;
      }
      setOrgs((cur) => cur.map((o) => (o.id === editing.id ? (data as Organization) : o)));
      toast.success('Saved.');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder = supabase.from('organizations') as any;
      // Stamp the FoodAssist partition column so committee orgs never surface on
      // the FoodAssist site (which lists only sector = 'food_insecurity').
      const { data, error } = await builder.insert({ ...payload, sector: 'other' }).select('*').single();
      if (error) {
        toast.error(error.message);
        return;
      }
      setOrgs((cur) => [...cur, data as Organization].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Organization added.');
    }
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this organization? This cannot be undone.')) return;
    const supabase = createClient();
    const { error } = await supabase.from('organizations').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOrgs((cur) => cur.filter((o) => o.id !== id));
    toast.success('Deleted.');
  };

  return (
    <div className="px-8 py-10 max-w-7xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Organizations"
        action={
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New organization
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rule" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, town, email…"
            className="w-full h-10 pl-10 pr-4 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="h-10 px-3 bg-card border border-divider rounded-sm text-sm"
        >
          <option value="all">All sectors</option>
          {SECTORS.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <p className="text-xs text-muted-text ml-auto">{filtered.length} of {orgs.length}</p>
      </div>

      <table className="w-full bg-card border border-divider rounded-sm overflow-hidden">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-text border-b border-divider">
            <th className="px-4 py-3 w-12"></th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 w-40">Sector</th>
            <th className="px-4 py-3 w-32">Town</th>
            <th className="px-4 py-3 w-24">Status</th>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-sm text-muted-text text-center">
                No organizations. Click <em>New organization</em> to add one.
              </td>
            </tr>
          ) : (
            filtered.map((o) => {
              const sector = o.sector_slug ? sectorBySlug(o.sector_slug) : null;
              return (
                <tr key={o.id} className="border-b border-divider hover:bg-sand/50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(o)}
                      aria-label={o.is_featured ? 'Unfeature' : 'Feature'}
                      title={o.is_featured ? 'Featured — shown first' : 'Feature this org'}
                      className="inline-flex items-center justify-center w-7 h-7 transition-colors"
                    >
                      <Star
                        className={`h-4 w-4 ${o.is_featured ? 'fill-warm-600 text-warm-600' : 'text-rule hover:text-warm-600'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-base text-ink">{o.name}</p>
                    {o.mission && (
                      <p className="text-xs text-muted-text italic line-clamp-1">{o.mission}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {sector ? (
                      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: sector.accentHex }}>
                        {sector.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-text">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">{o.town}</td>
                  <td className="px-4 py-3">
                    {o.is_active ? (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-sector-environment">Active</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-text">Hidden</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(o)}
                      className="inline-flex items-center justify-center w-7 h-7 text-muted-text hover:text-ink transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(o.id)}
                      className="inline-flex items-center justify-center w-7 h-7 text-muted-text hover:text-destructive transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto">
          <div className="bg-canvas w-full max-w-2xl rounded-sm shadow-xl my-8">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-text">
                  {editing.id ? 'Edit' : 'New'}
                </p>
                <h3 className="text-xl text-ink">
                  {editing.id ? editing.name || 'Untitled organization' : 'New organization'}
                </h3>
              </div>
              <button onClick={() => setEditing(null)} className="text-muted-text hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-auto">
              <DraftField label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </DraftField>
              <DraftField label="Sector">
                <select
                  value={editing.sector_slug ?? ''}
                  onChange={(e) => setEditing({ ...editing, sector_slug: e.target.value || null })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                >
                  <option value="">—</option>
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </DraftField>
              <div className="grid grid-cols-2 gap-4">
                <DraftField label="Town">
                  <input
                    value={editing.town}
                    onChange={(e) => setEditing({ ...editing, town: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </DraftField>
                <DraftField label="Zip">
                  <input
                    value={editing.zip}
                    onChange={(e) => setEditing({ ...editing, zip: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </DraftField>
              </div>
              <DraftField label="Address">
                <input
                  value={editing.address}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </DraftField>
              <div className="grid grid-cols-2 gap-4">
                <DraftField label="Phone">
                  <input
                    value={editing.phone}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </DraftField>
                <DraftField label="Email">
                  <input
                    value={editing.email ?? ''}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </DraftField>
              </div>
              <DraftField label="Website">
                <input
                  value={editing.website ?? ''}
                  onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                  placeholder="https://…"
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </DraftField>
              <DraftField label="Mission">
                <textarea
                  value={editing.mission ?? ''}
                  onChange={(e) => setEditing({ ...editing, mission: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-card border border-divider rounded-sm text-sm"
                />
              </DraftField>
              <DraftField label="Services offered (comma-separated)">
                <input
                  value={editing.assistance_types.join(', ')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      assistance_types: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                />
              </DraftField>
              <div className="grid grid-cols-2 gap-4">
                <DraftField label="Display order (lower = first; blank = A–Z)">
                  <input
                    type="number"
                    value={editing.display_order ?? ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        display_order: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    placeholder="—"
                    className="w-full h-10 px-3 bg-card border border-divider rounded-sm text-sm"
                  />
                </DraftField>
                <label className="flex items-center gap-2 text-sm self-end pb-2.5">
                  <input
                    type="checkbox"
                    checked={editing.is_featured}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  />
                  Featured (pinned to top)
                </label>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.spanish_available}
                    onChange={(e) => setEditing({ ...editing, spanish_available: e.target.checked })}
                  />
                  Spanish available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  />
                  Active (visible on public site)
                </label>
              </div>
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
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-ink text-white text-sm font-medium rounded-full hover:bg-primary-500 transition-colors"
              >
                <Check className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraftField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

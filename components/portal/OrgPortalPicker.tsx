'use client';

import { useMemo, useState, useTransition } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { enterOrgPortal } from '@/lib/portal/assist-actions';

interface Org {
  id: string;
  name: string;
  town: string;
  sector_slug: string | null;
  is_active: boolean;
}

export function OrgPortalPicker({ organizations }: { organizations: Org[] }) {
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  const [opening, setOpening] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter(
      (o) => o.name.toLowerCase().includes(q) || (o.town ?? '').toLowerCase().includes(q),
    );
  }, [organizations, query]);

  const open = (id: string) => {
    setOpening(id);
    // enterOrgPortal redirects to /portal on success, so there is no success
    // path back into this component to reset the pending state.
    startTransition(async () => {
      await enterOrgPortal(id);
    });
  };

  if (organizations.length === 0) return null;

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizations…"
          className="w-full h-11 pl-10 pr-3 bg-card border border-divider rounded-sm text-sm focus:outline-none focus:border-ink"
        />
      </div>

      <div className="border border-divider bg-card rounded-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-sm text-muted-text text-center">
            No organization matches “{query}”.
          </p>
        ) : (
          filtered.map((org) => (
            <button
              key={org.id}
              onClick={() => open(org.id)}
              disabled={pending}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-left border-b border-divider last:border-b-0 hover:bg-sand/60 transition-colors disabled:opacity-50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base text-ink truncate">{org.name}</p>
                <p className="text-xs text-muted-text">
                  {org.town || 'No town listed'}
                  {!org.is_active && ' · hidden from the directory'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0">
                {opening === org.id ? 'Opening…' : 'Open portal'}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

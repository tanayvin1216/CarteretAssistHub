'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { VolunteerApplication } from '@/types/database';
import { AdminPageHeader } from './AdminPageHeader';

type AppWithContext = VolunteerApplication & {
  organization?: { id: string; name: string } | null;
  volunteer_need?: { id: string; title: string } | null;
};

type Status = VolunteerApplication['status'];
const STATUSES: Status[] = ['pending', 'contacted', 'approved', 'rejected'];

export function ApplicationsAdmin({ applications: initial }: { applications: AppWithContext[] }) {
  const [apps, setApps] = useState<AppWithContext[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  const setStatus = async (id: string, next: Status) => {
    setApps((cur) => cur.map((a) => (a.id === id ? { ...a, status: next } : a)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder = supabase.from('volunteer_applications') as any;
    const { error } = await builder
      .update({ status: next, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Marked ${next}.`);
    }
  };

  return (
    <div className="px-8 py-10 max-w-6xl">
      <AdminPageHeader eyebrow="Review" title="Applications" />

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', ...STATUSES] as const).map((s) => {
          const count = s === 'all' ? apps.length : apps.filter((a) => a.status === s).length;
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active ? 'bg-ink text-white border-ink' : 'border-divider text-muted-text hover:border-ink hover:text-ink'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-divider rounded-sm overflow-hidden">
        {visible.length === 0 ? (
          <p className="p-10 text-sm text-muted-text text-center">No applications yet.</p>
        ) : (
          <ol>
            {visible.map((app) => {
              const isOpen = expanded === app.id;
              return (
                <li key={app.id} className="border-b border-divider last:border-b-0">
                  <button
                    onClick={() => setExpanded(isOpen ? null : app.id)}
                    className="w-full grid grid-cols-12 gap-4 px-5 py-4 text-left hover:bg-sand/50 transition-colors"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <p className="text-base text-ink">{app.applicant_name}</p>
                      <p className="text-xs text-muted-text">{app.applicant_email}</p>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm">
                      {app.volunteer_need ? (
                        <>
                          <p className="text-ink">{app.volunteer_need.title}</p>
                          <p className="text-xs text-muted-text">{app.organization?.name}</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-text italic">General application</p>
                      )}
                    </div>
                    <div className="col-span-6 md:col-span-2 text-xs text-muted-text flex items-center">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="col-span-6 md:col-span-2 flex items-center justify-end">
                      <StatusBadge status={app.status} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 grid grid-cols-12 gap-6 bg-sand/40 border-t border-divider">
                      <div className="col-span-12 md:col-span-8">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-2 mt-4">
                          What they&apos;re willing to do
                        </p>
                        <p className="text-sm text-body-text leading-relaxed whitespace-pre-line mb-4">
                          {app.willing_to_do}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-text">
                          {app.applicant_phone && <span>Phone: {app.applicant_phone}</span>}
                          {app.hours_per_week && <span>Hours: {app.hours_per_week}</span>}
                          {app.availability && <span>Availability: {app.availability}</span>}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 mt-4 md:mt-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-3">
                          Status
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(app.id, s)}
                              className={`h-9 text-xs rounded-sm border transition-colors ${
                                app.status === s
                                  ? 'bg-ink text-white border-ink'
                                  : 'border-divider text-muted-text hover:border-ink hover:text-ink'
                              }`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const color =
    status === 'pending' ? 'var(--color-sector-arts)' :
    status === 'contacted' ? 'var(--color-sector-housing)' :
    status === 'approved' ? 'var(--color-sector-environment)' :
    'var(--color-muted-text)';
  return (
    <span
      className="text-[10px] uppercase tracking-[0.18em] border px-2 py-0.5 rounded-sm"
      style={{ color, borderColor: color }}
    >
      {status}
    </span>
  );
}

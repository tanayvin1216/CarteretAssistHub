'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Mail, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { VolunteerApplication } from '@/types/database';

type AppWithNeed = VolunteerApplication & {
  volunteer_need?: { id: string; title: string } | null;
};

type Status = VolunteerApplication['status'];
const STATUSES: Status[] = ['pending', 'contacted', 'approved', 'rejected'];

const STATUS_LABELS: Record<Status, string> = {
  pending: 'New',
  contacted: 'Reached out',
  approved: 'Taken on',
  rejected: 'Passed',
};

export function OrgApplications({ applications: initial }: { applications: AppWithNeed[] }) {
  const [apps, setApps] = useState<AppWithNeed[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const visible = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  const setStatus = async (id: string, next: Status) => {
    const previous = apps.find((a) => a.id === id)?.status;
    setApps((cur) => cur.map((a) => (a.id === id ? { ...a, status: next } : a)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('volunteer_applications') as any)
      .update({ status: next, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      if (previous) setApps((cur) => cur.map((a) => (a.id === id ? { ...a, status: previous } : a)));
      toast.error(error.message);
      return;
    }
    toast.success(`Marked ${STATUS_LABELS[next].toLowerCase()}.`);
  };

  const saveNotes = async (id: string) => {
    const notes = notesDraft[id] ?? '';
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('volunteer_applications') as any)
      .update({ review_notes: notes || null })
      .eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setApps((cur) => cur.map((a) => (a.id === id ? { ...a, review_notes: notes || null } : a)));
    toast.success('Note saved.');
  };

  return (
    <div className="px-8 py-10 max-w-5xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· Review</p>
      <h1 className="text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight mb-3">
        Applications
      </h1>
      <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-8">
        Everyone who applied to one of your roles, or who wrote to you from your listing. These are
        yours to work — the committee does not chase them for you.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', ...STATUSES] as const).map((s) => {
          const count = s === 'all' ? apps.length : apps.filter((a) => a.status === s).length;
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? 'bg-ink text-white border-ink'
                  : 'border-divider text-muted-text hover:border-ink hover:text-ink'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-divider rounded-sm overflow-hidden">
        {visible.length === 0 ? (
          <p className="p-10 text-sm text-muted-text text-center">
            {apps.length === 0
              ? 'No applications yet. Post a volunteer role and they will land here.'
              : 'Nothing in this category.'}
          </p>
        ) : (
          <ol>
            {visible.map((app) => {
              const isOpen = expanded === app.id;
              return (
                <li key={app.id} className="border-b border-divider last:border-b-0">
                  <button
                    onClick={() => {
                      setExpanded(isOpen ? null : app.id);
                      if (!isOpen) {
                        setNotesDraft((cur) => ({ ...cur, [app.id]: app.review_notes ?? '' }));
                      }
                    }}
                    className="w-full grid grid-cols-12 gap-4 px-5 py-4 text-left hover:bg-sand/50 transition-colors"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <p className="text-base text-ink">{app.applicant_name}</p>
                      <p className="text-xs text-muted-text break-all">{app.applicant_email}</p>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm">
                      {app.volunteer_need ? (
                        <p className="text-ink">{app.volunteer_need.title}</p>
                      ) : (
                        <p className="text-xs text-muted-text italic">
                          Wrote to you directly — no specific role
                        </p>
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
                      <div className="col-span-12 md:col-span-7">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-2 mt-4">
                          What they&apos;re willing to do
                        </p>
                        <p className="text-sm text-body-text leading-relaxed whitespace-pre-line mb-4">
                          {app.willing_to_do}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-text mb-5">
                          {app.hours_per_week && <span>Hours: {app.hours_per_week}</span>}
                          {app.availability && <span>Availability: {app.availability}</span>}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`mailto:${app.applicant_email}`}
                            className="inline-flex items-center gap-1.5 h-9 px-3 bg-card border border-divider rounded-sm text-xs text-ink hover:border-ink transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email {app.applicant_name.split(' ')[0]}
                          </a>
                          {app.applicant_phone && (
                            <a
                              href={`tel:${app.applicant_phone}`}
                              className="inline-flex items-center gap-1.5 h-9 px-3 bg-card border border-divider rounded-sm text-xs text-ink hover:border-ink transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              {app.applicant_phone}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-5 mt-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-3">
                          Where this stands
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-5">
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
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-2">
                          Your notes
                        </p>
                        <textarea
                          value={notesDraft[app.id] ?? ''}
                          onChange={(e) =>
                            setNotesDraft((cur) => ({ ...cur, [app.id]: e.target.value }))
                          }
                          rows={3}
                          placeholder="Left a voicemail Tuesday…"
                          className="w-full p-3 bg-card border border-divider rounded-sm text-sm leading-relaxed mb-2"
                        />
                        <button
                          onClick={() => saveNotes(app.id)}
                          className="h-9 px-3 bg-ink text-white text-xs rounded-sm hover:bg-primary-500 transition-colors"
                        >
                          Save note
                        </button>
                        <p className="text-[10px] text-muted-text mt-2 leading-relaxed">
                          Only your organization and the committee can see this.
                        </p>
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
    status === 'pending'
      ? 'var(--color-sector-arts)'
      : status === 'contacted'
        ? 'var(--color-sector-housing)'
        : status === 'approved'
          ? 'var(--color-sector-environment)'
          : 'var(--color-muted-text)';
  return (
    <span
      className="text-[10px] uppercase tracking-[0.18em] border px-2 py-0.5 rounded-sm"
      style={{ color, borderColor: color }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

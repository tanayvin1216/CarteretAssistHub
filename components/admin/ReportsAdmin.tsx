'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { sectorBySlug } from '@/lib/sectors';
import type { CommunityReport } from '@/types/database';
import { AdminPageHeader } from './AdminPageHeader';

type ReportWithContext = CommunityReport & {
  organization?: { id: string; name: string } | null;
};

type Status = CommunityReport['status'];
type ReportType = CommunityReport['report_type'];

const STATUSES: Status[] = ['new', 'reviewing', 'resolved', 'dismissed'];

const TYPE_LABELS: Record<ReportType, string> = {
  listing_issue: 'Listing issue',
  unmet_need: 'Unmet need',
  other: 'Other',
};

export function ReportsAdmin({ reports: initial }: { reports: ReportWithContext[] }) {
  const [reports, setReports] = useState<ReportWithContext[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = filter === 'all' ? reports : reports.filter((r) => r.status === filter);

  const setStatus = async (id: string, next: Status) => {
    setReports((cur) => cur.map((r) => (r.id === id ? { ...r, status: next } : r)));
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder = supabase.from('community_reports') as any;
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
      <AdminPageHeader eyebrow="Review" title="Reports" />

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', ...STATUSES] as const).map((s) => {
          const count = s === 'all' ? reports.length : reports.filter((r) => r.status === s).length;
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
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-divider rounded-sm overflow-hidden">
        {visible.length === 0 ? (
          <p className="p-10 text-sm text-muted-text text-center">No reports yet.</p>
        ) : (
          <ol>
            {visible.map((report) => {
              const isOpen = expanded === report.id;
              const sector = report.sector_slug ? sectorBySlug(report.sector_slug) : null;
              return (
                <li key={report.id} className="border-b border-divider last:border-b-0">
                  <button
                    onClick={() => setExpanded(isOpen ? null : report.id)}
                    className="w-full grid grid-cols-12 gap-4 px-5 py-4 text-left hover:bg-sand/50 transition-colors"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <p className="text-base text-ink">{TYPE_LABELS[report.report_type]}</p>
                      <p className="text-xs text-muted-text">
                        {report.reporter_name || report.reporter_email || 'Anonymous'}
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm">
                      {report.organization ? (
                        <p className="text-ink">{report.organization.name}</p>
                      ) : sector ? (
                        <p className="text-ink">{sector.name}</p>
                      ) : (
                        <p className="text-xs text-muted-text italic">Unassigned</p>
                      )}
                      <p className="text-xs text-muted-text line-clamp-1">{report.details}</p>
                    </div>
                    <div className="col-span-6 md:col-span-2 text-xs text-muted-text flex items-center">
                      {format(new Date(report.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="col-span-6 md:col-span-2 flex items-center justify-end">
                      <StatusBadge status={report.status} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 grid grid-cols-12 gap-6 bg-sand/40 border-t border-divider">
                      <div className="col-span-12 md:col-span-8">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-text mb-2 mt-4">
                          Details
                        </p>
                        <p className="text-sm text-body-text leading-relaxed whitespace-pre-line mb-4">
                          {report.details}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-text">
                          {sector && <span>Sector: {sector.name}</span>}
                          {report.organization && <span>Org: {report.organization.name}</span>}
                          {report.reporter_email && <span>Email: {report.reporter_email}</span>}
                          {report.reporter_phone && <span>Phone: {report.reporter_phone}</span>}
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
                              onClick={() => setStatus(report.id, s)}
                              className={`h-9 text-xs rounded-sm border transition-colors ${
                                report.status === s
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
    status === 'new' ? 'var(--color-sector-arts)' :
    status === 'reviewing' ? 'var(--color-sector-housing)' :
    status === 'resolved' ? 'var(--color-sector-environment)' :
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

'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { messages, type MessageKey } from '@/lib/i18n/dictionary';
import { EDITABLE_COPY, type SiteContentRow } from '@/lib/siteContent';
import { AdminPageHeader } from './AdminPageHeader';

type FieldValue = { en: string; es: string };

/**
 * Edits admin-overridable site copy. Each field shows the current effective
 * text (DB override if present, else the hardcoded dictionary default). Saving
 * upserts overrides into site_content; clearing a field falls back to the
 * dictionary default on the public site.
 */
export function ContentAdmin({ rows }: { rows: SiteContentRow[] }) {
  const overrides = useMemo(() => {
    const map = new Map<string, SiteContentRow>();
    for (const r of rows) map.set(r.key, r);
    return map;
  }, [rows]);

  const initial = useMemo(() => {
    const state: Record<string, FieldValue> = {};
    for (const group of EDITABLE_COPY) {
      for (const field of group.fields) {
        const row = overrides.get(field.key);
        state[field.key] = {
          en: row?.value_en ?? messages.en[field.key] ?? '',
          es: row?.value_es ?? messages.es[field.key] ?? '',
        };
      }
    }
    return state;
  }, [overrides]);

  const [values, setValues] = useState<Record<string, FieldValue>>(initial);
  // The saved baseline the dirty check compares against. Held in state rather
  // than read straight off `initial` so a successful save can move it forward
  // without mutating a memoized value.
  const [baseline, setBaseline] = useState<Record<string, FieldValue>>(initial);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () =>
      Object.keys(values).some(
        (k) => values[k].en !== baseline[k]?.en || values[k].es !== baseline[k]?.es,
      ),
    [values, baseline],
  );

  const setField = (key: string, locale: 'en' | 'es', text: string) =>
    setValues((cur) => ({ ...cur, [key]: { ...cur[key], [locale]: text } }));

  const reset = (key: MessageKey, locale: 'en' | 'es') =>
    setField(key, locale, messages[locale][key] ?? '');

  const onSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const changed = Object.keys(values).filter(
      (k) => values[k].en !== baseline[k]?.en || values[k].es !== baseline[k]?.es,
    );
    const payload = changed.map((key) => ({
      key,
      value_en: values[key].en,
      value_es: values[key].es,
      updated_at: new Date().toISOString(),
      updated_by: userData.user?.id ?? null,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('site_content') as any).upsert(payload, {
      onConflict: 'key',
    });
    setSaving(false);
    if (error) {
      toast.error('Save failed.');
      console.error(error);
    } else {
      toast.success(`Saved ${payload.length} field${payload.length === 1 ? '' : 's'}. Live in ~5 min.`);
      // Reflect saved state as the new baseline without a reload.
      setBaseline(values);
    }
  };

  return (
    <div className="px-8 py-10 max-w-4xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Site content"
        action={
          <button
            onClick={onSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 h-10 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      <p className="text-sm text-muted-text mb-8 -mt-3 max-w-2xl">
        Edit the public-facing copy. Leave a field on its default to keep the built-in text.
        Changes appear on the live site within about five minutes.
      </p>

      <div className="space-y-10">
        {EDITABLE_COPY.map((group) => (
          <section key={group.group}>
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4 pb-2 border-b border-divider">
              {group.group}
            </h2>
            <div className="space-y-6">
              {group.fields.map((field) => (
                <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['en', 'es'] as const).map((loc) => {
                    const isDefault = values[field.key][loc] === (messages[loc][field.key] ?? '');
                    return (
                      <div key={loc}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-body-text">
                            {field.label}{' '}
                            <span className="text-muted-text uppercase">{loc}</span>
                          </label>
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => reset(field.key, loc)}
                              className="text-[11px] text-muted-text hover:text-primary-600"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        {field.multiline ? (
                          <textarea
                            value={values[field.key][loc]}
                            onChange={(e) => setField(field.key, loc, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm bg-card border border-divider rounded-md text-ink focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all resize-y"
                          />
                        ) : (
                          <input
                            type="text"
                            value={values[field.key][loc]}
                            onChange={(e) => setField(field.key, loc, e.target.value)}
                            className="w-full h-10 px-3 text-sm bg-card border border-divider rounded-md text-ink focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

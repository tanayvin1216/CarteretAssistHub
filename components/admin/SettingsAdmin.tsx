'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { messages } from '@/lib/i18n/dictionary';
import { SETTING_KEYS, type SiteContentRow } from '@/lib/siteContent';
import { DEFAULT_SETTINGS } from '@/contexts/SiteSettingsContext';
import { AdminPageHeader } from './AdminPageHeader';

const BUCKET = 'site-assets';

export function SettingsAdmin({ rows }: { rows: SiteContentRow[] }) {
  const byKey = useMemo(() => new Map(rows.map((r) => [r.key, r])), [rows]);

  const [contactEmail, setContactEmail] = useState(
    byKey.get('footer.contactEmail')?.value_en ?? messages.en['footer.contactEmail'],
  );
  const [missionEn, setMissionEn] = useState(
    byKey.get('footer.mission')?.value_en ?? messages.en['footer.mission'],
  );
  const [missionEs, setMissionEs] = useState(
    byKey.get('footer.mission')?.value_es ?? messages.es['footer.mission'],
  );
  const [sisterUrl, setSisterUrl] = useState(
    byKey.get(SETTING_KEYS.sisterUrl)?.value_en ?? DEFAULT_SETTINGS.sisterSiteUrl,
  );
  const [heroUrl, setHeroUrl] = useState(
    byKey.get(SETTING_KEYS.heroImage)?.value_en ?? DEFAULT_SETTINGS.heroImageUrl,
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `hero-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, cacheControl: '3600' });
    if (error) {
      setUploading(false);
      toast.error('Upload failed.');
      console.error(error);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setHeroUrl(data.publicUrl);
    setUploading(false);
    toast.success('Image uploaded. Save to publish.');
  };

  const onSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const now = new Date().toISOString();
    const uid = userData.user?.id ?? null;
    const payload = [
      { key: 'footer.contactEmail', value_en: contactEmail, value_es: contactEmail, updated_at: now, updated_by: uid },
      { key: 'footer.mission', value_en: missionEn, value_es: missionEs, updated_at: now, updated_by: uid },
      { key: SETTING_KEYS.sisterUrl, value_en: sisterUrl, value_es: null, updated_at: now, updated_by: uid },
      { key: SETTING_KEYS.heroImage, value_en: heroUrl, value_es: null, updated_at: now, updated_by: uid },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('site_content') as any).upsert(payload, {
      onConflict: 'key',
    });
    setSaving(false);
    if (error) {
      toast.error('Save failed.');
      console.error(error);
    } else {
      toast.success('Settings saved. Live in ~5 min.');
    }
  };

  return (
    <div className="px-8 py-10 max-w-3xl">
      <AdminPageHeader
        eyebrow="Manage"
        title="Settings"
        action={
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 h-10 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      <div className="space-y-10">
        <section>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4 pb-2 border-b border-divider">
            Homepage hero image
          </h2>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-divider bg-sand mb-4">
            <Image
              src={heroUrl}
              alt="Hero preview"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              unoptimized={heroUrl.startsWith('http')}
              className="object-cover"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 h-10 px-4 bg-card border border-divider text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload new image'}
            </button>
            <p className="text-xs text-muted-text">JPG, PNG, or AVIF. Wide landscape works best.</p>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4 pb-2 border-b border-divider">
            Contact & links
          </h2>
          <div className="space-y-5">
            <Field label="Committee contact email">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Sister site URL (Food Assist)">
              <input
                type="url"
                value={sisterUrl}
                onChange={(e) => setSisterUrl(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4 pb-2 border-b border-divider">
            Footer mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Mission EN">
              <textarea
                value={missionEn}
                onChange={(e) => setMissionEn(e.target.value)}
                rows={3}
                className={`${inputCls} resize-y py-2 h-auto`}
              />
            </Field>
            <Field label="Mission ES">
              <textarea
                value={missionEs}
                onChange={(e) => setMissionEs(e.target.value)}
                rows={3}
                className={`${inputCls} resize-y py-2 h-auto`}
              />
            </Field>
          </div>
        </section>
      </div>
    </div>
  );
}

const inputCls =
  'w-full h-10 px-3 text-sm bg-card border border-divider rounded-md text-ink focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-body-text mb-1.5">{label}</label>
      {children}
    </div>
  );
}

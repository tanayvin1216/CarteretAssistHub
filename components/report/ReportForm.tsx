'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';
import {
  communityReportSchema,
  REPORT_TYPES,
  type CommunityReportInput,
} from '@/lib/validations/community-report';
import { createClient } from '@/lib/supabase/client';
import { SECTORS } from '@/lib/sectors';

export interface ReportOrganization {
  id: string;
  name: string;
  town: string;
}

const INPUT_CLASS =
  'w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all';

export function ReportForm({ organizations }: { organizations: ReportOrganization[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CommunityReportInput>({
    resolver: zodResolver(communityReportSchema),
  });

  const reportType = watch('report_type');

  const onSubmit = async (values: CommunityReportInput) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        report_type: values.report_type,
        sector_slug: values.sector_slug || null,
        organization_id: values.organization_id || null,
        details: values.details,
        reporter_name: values.reporter_name || null,
        reporter_email: values.reporter_email || null,
        reporter_phone: values.reporter_phone || null,
        status: 'new',
      };
      const { error } = await supabase
        .from('community_reports')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any);
      if (error) {
        toast.error(t('report.form.error'));
        console.error(error);
        setSubmitting(false);
        return;
      }
      toast.success(t('report.form.success'));
      router.push('/report/thanks');
    } catch (e) {
      console.error(e);
      toast.error(t('report.form.error'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-10 md:py-14 max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            {t('report.eyebrow')}
          </p>
          <h1 className="font-display text-4xl md:text-[3rem] leading-[1.1] text-ink mb-3">
            {t('report.title')}
          </h1>
          <p className="text-base text-body-text leading-relaxed max-w-2xl">
            {t('report.lede')}
          </p>
        </div>
      </section>

      <section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container-readable max-w-2xl py-10 md:py-12 space-y-6"
        >
          <fieldset>
            <legend className="block text-sm font-semibold text-ink mb-3">
              {t('report.form.type')}
            </legend>
            <div className="space-y-2">
              {REPORT_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-start gap-3 p-3.5 bg-surface border border-divider rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-seafoam-tint/40 transition-colors"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register('report_type')}
                    className="mt-0.5 h-4 w-4 accent-primary-600 shrink-0"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {t(`report.type.${type}` as const)}
                    </span>
                    <span className="block text-xs text-muted-text mt-0.5">
                      {t(`report.type.${type}Hint` as const)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.report_type && (
              <p className="mt-1.5 text-xs text-destructive">{errors.report_type.message}</p>
            )}
          </fieldset>

          {reportType === 'listing_issue' && organizations.length > 0 && (
            <Field
              label={t('report.form.organization')}
              hint={t('report.form.organizationHint')}
              error={errors.organization_id?.message}
            >
              <select {...register('organization_id')} className={INPUT_CLASS}>
                <option value="">{t('report.form.none')}</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} · {org.town}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field
            label={t('report.form.sector')}
            hint={t('report.form.sectorHint')}
            error={errors.sector_slug?.message}
          >
            <select {...register('sector_slug')} className={INPUT_CLASS}>
              <option value="">{t('report.form.none')}</option>
              {SECTORS.map((sector) => (
                <option key={sector.slug} value={sector.slug}>
                  {sector.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={t('report.form.details')}
            hint={t('report.form.detailsHint')}
            error={errors.details?.message}
          >
            <textarea
              {...register('details')}
              rows={6}
              className="w-full p-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 resize-y leading-relaxed transition-all"
            />
          </Field>

          <div className="pt-5 border-t border-divider">
            <p className="text-sm font-semibold text-ink mb-1">{t('report.form.contactTitle')}</p>
            <p className="text-xs text-muted-text mb-5">{t('report.form.contactLede')}</p>

            <div className="space-y-5">
              <Field label={t('report.form.name')} error={errors.reporter_name?.message}>
                <input type="text" {...register('reporter_name')} className={INPUT_CLASS} />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label={t('report.form.email')} error={errors.reporter_email?.message}>
                  <input type="email" {...register('reporter_email')} className={INPUT_CLASS} />
                </Field>
                <Field label={t('report.form.phone')} error={errors.reporter_phone?.message}>
                  <input type="tel" {...register('reporter_phone')} className={INPUT_CLASS} />
                </Field>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-divider flex items-center justify-end gap-3">
            <Link href="/" className="text-sm text-muted-text hover:text-ink transition-colors">
              {t('common.back')}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 h-11 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-60 shadow-sm"
            >
              {submitting ? t('common.loading') : t('report.form.submit')}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-2">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-text">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

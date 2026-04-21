'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Send } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { volunteerApplicationSchema, type VolunteerApplicationInput } from '@/lib/validations/volunteer-application';
import { createClient } from '@/lib/supabase/client';
import { sectorBySlug } from '@/lib/sectors';

interface NeedContext {
  id: string;
  title: string;
  description: string;
  sector_slug: string | null;
  organization_id: string;
  organization?: { id: string; name: string; town: string } | null;
}

interface Props {
  needContext: NeedContext | null;
  orgContext: { id: string; name: string; town: string } | null;
}

export function VolunteerApplyForm({ needContext, orgContext }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const sector = needContext?.sector_slug ? sectorBySlug(needContext.sector_slug) : null;
  const accent = sector?.accentHex ?? '#1E3A5F';

  const { register, handleSubmit, formState: { errors } } = useForm<VolunteerApplicationInput>({
    resolver: zodResolver(volunteerApplicationSchema),
    defaultValues: {
      volunteer_need_id: needContext?.id ?? null,
      organization_id: needContext?.organization_id ?? orgContext?.id ?? null,
    },
  });

  const onSubmit = async (values: VolunteerApplicationInput) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        applicant_name: values.applicant_name,
        applicant_email: values.applicant_email,
        applicant_phone: values.applicant_phone || null,
        willing_to_do: values.willing_to_do,
        hours_per_week: values.hours_per_week || null,
        availability: values.availability || null,
        volunteer_need_id: values.volunteer_need_id ?? null,
        organization_id: values.organization_id ?? null,
        status: 'pending',
      };
      const { error } = await supabase
        .from('volunteer_applications')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any);
      if (error) {
        toast.error(t('volunteer.applyForm.error'));
        console.error(error);
        setSubmitting(false);
        return;
      }
      toast.success(t('volunteer.applyForm.success'));
      router.push('/volunteer/apply/thanks');
    } catch (e) {
      console.error(e);
      toast.error(t('volunteer.applyForm.error'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section
        className="border-b border-rule/40"
        style={{ backgroundColor: `${accent}08` }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: accent }} aria-hidden />
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-text hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3" />
            {t('nav.volunteer')}
          </Link>
          <p className="text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>
            {t('volunteer.applyForm.title')}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[0.98] tracking-[-0.02em] text-ink">
            {needContext ? needContext.title : t('volunteer.applyGeneral')}
          </h1>
          {needContext?.organization && (
            <p className="mt-4 text-sm text-body-text">
              <span className="font-medium text-ink">{needContext.organization.name}</span> ·{' '}
              {needContext.organization.town}
              {sector && (
                <>
                  {' '}· <span style={{ color: accent }}>{sector.name}</span>
                </>
              )}
            </p>
          )}
          <p className="mt-4 text-sm text-body-text max-w-xl leading-relaxed">
            {t('volunteer.applyForm.lede')}
          </p>
        </div>
      </section>

      <section>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl px-6 py-12 space-y-8">
          <Field label={t('volunteer.applyForm.name')} error={errors.applicant_name?.message}>
            <input
              type="text"
              {...register('applicant_name')}
              className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
            />
          </Field>

          <Field label={t('volunteer.applyForm.email')} error={errors.applicant_email?.message}>
            <input
              type="email"
              {...register('applicant_email')}
              className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
            />
          </Field>

          <Field label={t('volunteer.applyForm.phone')} error={errors.applicant_phone?.message}>
            <input
              type="tel"
              {...register('applicant_phone')}
              className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
            />
          </Field>

          <Field
            label={t('volunteer.applyForm.willing')}
            hint={t('volunteer.applyForm.willingHint')}
            error={errors.willing_to_do?.message}
          >
            <textarea
              {...register('willing_to_do')}
              rows={5}
              className="w-full p-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink resize-y leading-relaxed"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label={t('volunteer.applyForm.hours')} error={errors.hours_per_week?.message}>
              <input
                type="text"
                {...register('hours_per_week')}
                placeholder="e.g. 2-4 hrs/week"
                className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
              />
            </Field>
            <Field label={t('volunteer.applyForm.availability')} error={errors.availability?.message}>
              <input
                type="text"
                {...register('availability')}
                placeholder="e.g. Weekday mornings"
                className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
              />
            </Field>
          </div>

          <div className="pt-4 border-t border-rule/40 flex items-center justify-end gap-4">
            <Link
              href="/volunteer"
              className="text-sm text-muted-text hover:text-ink transition-colors"
            >
              {t('common.back')}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 h-11 px-5 bg-ink text-ivory text-sm font-medium rounded-full hover:bg-navy transition-colors disabled:opacity-60"
              style={submitting ? {} : { backgroundColor: accent }}
            >
              {submitting ? t('common.loading') : t('volunteer.applyForm.submit')}
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
      <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-2">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-text">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

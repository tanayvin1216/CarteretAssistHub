'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';
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
      <section className="bg-sand border-b border-divider">
        <div className="container-readable py-10 md:py-14 max-w-3xl mx-auto">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('nav.volunteer')}
          </Link>

          {sector && (
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: sector.accentHex }}
              />
              <span className="text-xs text-muted-text">{sector.name}</span>
            </div>
          )}
          <h1 className="font-display text-4xl md:text-[3rem] leading-[1.1] text-ink leading-tight mb-3">
            {needContext ? needContext.title : t('volunteer.applyGeneral')}
          </h1>
          {needContext?.organization && (
            <p className="text-sm text-body-text mb-4">
              <span className="font-semibold text-ink">{needContext.organization.name}</span> · {needContext.organization.town}
            </p>
          )}
          <p className="text-base text-body-text leading-relaxed max-w-2xl">
            {t('volunteer.applyForm.lede')}
          </p>
        </div>
      </section>

      <section>
        <form onSubmit={handleSubmit(onSubmit)} className="container-readable max-w-2xl py-10 md:py-12 space-y-6">
          <Field label={t('volunteer.applyForm.name')} error={errors.applicant_name?.message}>
            <input
              type="text"
              {...register('applicant_name')}
              className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label={t('volunteer.applyForm.email')} error={errors.applicant_email?.message}>
              <input
                type="email"
                {...register('applicant_email')}
                className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </Field>
            <Field label={t('volunteer.applyForm.phone')} error={errors.applicant_phone?.message}>
              <input
                type="tel"
                {...register('applicant_phone')}
                className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </Field>
          </div>

          <Field
            label={t('volunteer.applyForm.willing')}
            hint={t('volunteer.applyForm.willingHint')}
            error={errors.willing_to_do?.message}
          >
            <textarea
              {...register('willing_to_do')}
              rows={5}
              className="w-full p-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 resize-y leading-relaxed transition-all"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label={t('volunteer.applyForm.hours')} error={errors.hours_per_week?.message}>
              <input
                type="text"
                {...register('hours_per_week')}
                placeholder="e.g. 2-4 hrs/week"
                className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </Field>
            <Field label={t('volunteer.applyForm.availability')} error={errors.availability?.message}>
              <input
                type="text"
                {...register('availability')}
                placeholder="e.g. Weekday mornings"
                className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </Field>
          </div>

          <div className="pt-5 border-t border-divider flex items-center justify-end gap-3">
            <Link href="/volunteer" className="text-sm text-muted-text hover:text-ink transition-colors">
              {t('common.back')}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 h-11 px-5 bg-seafoam text-ink text-sm font-semibold rounded-lg hover:bg-seafoam-deep transition-colors disabled:opacity-60 shadow-sm"
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
      <label className="block text-sm font-semibold text-ink mb-2">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-text">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

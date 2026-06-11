'use client';

import { useTranslation } from '@/contexts/LocaleContext';
import type { MessageKey } from '@/lib/i18n/dictionary';

/** Editorial page header (eyebrow + serif title + lede), all editable copy. */
export function PageHero({
  eyebrowKey,
  titleKey,
  ledeKey,
  width = 'max-w-3xl',
}: {
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  ledeKey: MessageKey;
  width?: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-sand border-b border-divider">
      <div className={`container-readable ${width} py-14 md:py-20`}>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-4">
          <span aria-hidden className="h-px w-8 bg-seafoam-deep" />
          {t(eyebrowKey)}
        </p>
        <h1 className="font-display text-4xl md:text-[3.5rem] text-ink leading-[1.08] mb-5">
          {t(titleKey)}
        </h1>
        <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
          {t(ledeKey)}
        </p>
      </div>
    </section>
  );
}

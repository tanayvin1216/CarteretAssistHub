'use client';

import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const { setLocale } = useTranslation();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg border border-divider bg-surface p-[3px]',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map(({ code, label }) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            className={cn(
              'h-6.5 px-2.5 rounded-[5px] text-[11px] font-semibold tracking-wide transition-colors duration-150',
              isActive
                ? 'bg-ink text-surface'
                : 'text-muted-text hover:text-ink hover:bg-sand',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

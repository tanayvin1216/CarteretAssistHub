'use client';

import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const { setLocale } = useTranslation();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 border border-divider rounded-full bg-ivory-deep/40 p-0.5',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={cn(
          'h-7 px-3 rounded-full text-xs font-medium transition-colors',
          locale === 'en'
            ? 'bg-navy text-ivory'
            : 'text-muted-text hover:text-navy',
        )}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('es')}
        className={cn(
          'h-7 px-3 rounded-full text-xs font-medium transition-colors',
          locale === 'es'
            ? 'bg-navy text-ivory'
            : 'text-muted-text hover:text-navy',
        )}
        aria-pressed={locale === 'es'}
      >
        ES
      </button>
    </div>
  );
}

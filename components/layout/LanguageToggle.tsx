'use client';

import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const { setLocale } = useTranslation();

  return (
    <div
      className={cn('inline-flex items-center rounded-md border border-divider bg-sand/60 p-0.5', className)}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={cn(
          'h-7 px-2.5 rounded text-[11px] font-semibold transition-colors',
          locale === 'en' ? 'bg-surface text-ink shadow-sm' : 'text-muted-text hover:text-ink',
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
        className={cn(
          'h-7 px-2.5 rounded text-[11px] font-semibold transition-colors',
          locale === 'es' ? 'bg-surface text-ink shadow-sm' : 'text-muted-text hover:text-ink',
        )}
      >
        ES
      </button>
    </div>
  );
}

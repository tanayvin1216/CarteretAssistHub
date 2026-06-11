'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Locale, MessageKey } from '@/lib/i18n/dictionary';
import { t as translate } from '@/lib/i18n/dictionary';

/** Admin-editable copy overrides, keyed by locale then message key. */
export type MessageOverrides = Partial<Record<Locale, Partial<Record<string, string>>>>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  overrides,
  children,
}: {
  initialLocale: Locale;
  overrides?: MessageOverrides;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      // Admin override wins when present and non-empty; otherwise fall back to
      // the hardcoded dictionary so a missing/blank row never blanks the page.
      t: (key) => {
        const override = overrides?.[locale]?.[key];
        return override && override.trim() ? override : translate(locale, key);
      },
    }),
    [locale, setLocale, overrides],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used inside LocaleProvider');
  return ctx;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx.locale;
}

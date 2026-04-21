'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Locale, MessageKey } from '@/lib/i18n/dictionary';
import { t as translate } from '@/lib/i18n/dictionary';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
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
      t: (key) => translate(locale, key),
    }),
    [locale, setLocale],
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

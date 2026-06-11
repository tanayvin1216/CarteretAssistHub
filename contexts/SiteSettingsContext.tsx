'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/siteContent';

export { DEFAULT_SETTINGS };
export type { SiteSettings };

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

import { cookies } from 'next/headers';
import type { Locale } from './dictionary';
import { LOCALES } from './dictionary';

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get('locale')?.value as Locale | undefined;
  if (value && LOCALES.includes(value)) return value;
  return 'en';
}

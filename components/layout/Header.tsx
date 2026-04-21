'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Shield, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/contexts/LocaleContext';
import { LanguageToggle } from './LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_ITEMS = [
  { href: '/sectors', labelKey: 'nav.directory' as const },
  { href: '/get-help', labelKey: 'nav.getHelp' as const },
  { href: '/volunteer', labelKey: 'nav.volunteer' as const },
  { href: '/about', labelKey: 'nav.about' as const },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-divider/60">
      <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="sector-numeral text-sm text-rule">00</span>
          <span className="font-display text-[1.4rem] tracking-[-0.01em] text-ink leading-none">
            Carteret <span className="italic text-sector-food">Assist</span> Hub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'text-ink font-medium'
                    : 'text-body-text hover:text-ink'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:inline-flex" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-ink border border-ink/30 rounded-full hover:bg-ink hover:text-ivory transition-colors"
                aria-label={t('nav.signIn')}
              >
                {t('nav.signIn')}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-text">
                {t('nav.signIn')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal/login" className="flex items-start gap-3 py-2 cursor-pointer">
                  <Building2 className="h-4 w-4 mt-0.5 text-ink" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t('nav.signInOrg')}</p>
                    <p className="text-xs text-muted-text">{t('nav.signInOrgHint')}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/login" className="flex items-start gap-3 py-2 cursor-pointer">
                  <Shield className="h-4 w-4 mt-0.5 text-ink" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t('nav.signInAdmin')}</p>
                    <p className="text-xs text-muted-text">{t('nav.signInAdminHint')}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden p-2 text-muted-text hover:text-ink transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-divider/60">
          <nav className="mx-auto px-6 py-4 flex flex-col gap-1 max-w-6xl">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base transition-colors ${
                    isActive ? 'text-ink font-medium' : 'text-body-text hover:text-ink'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <div className="mt-3 pt-3 border-t border-divider/60 flex items-center gap-3">
              <LanguageToggle />
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <Link
                href="/portal/login"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-body-text hover:text-ink flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" /> {t('nav.signInOrg')}
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-body-text hover:text-ink flex items-center gap-2"
              >
                <Shield className="h-4 w-4" /> {t('nav.signInAdmin')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

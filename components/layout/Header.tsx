'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, Shield, Building2, Heart } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="container-readable flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white"
          >
            <Heart className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-semibold text-ink text-[17px] tracking-tight">
            Assist Hub
          </span>
          <span className="hidden sm:inline text-xs text-muted-text font-medium ml-1">
            · Carteret County
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-ink bg-sand'
                    : 'text-body-text hover:text-ink hover:bg-sand/60'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-body-text hover:text-ink hover:bg-sand rounded-md transition-colors"
              >
                {t('nav.signIn')}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-xs font-medium text-muted-text">
                Sign in as
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal/login" className="flex items-start gap-3 py-2.5 cursor-pointer">
                  <Building2 className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t('nav.signInOrg')}</p>
                    <p className="text-xs text-muted-text mt-0.5">{t('nav.signInOrgHint')}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/login" className="flex items-start gap-3 py-2.5 cursor-pointer">
                  <Shield className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t('nav.signInAdmin')}</p>
                    <p className="text-xs text-muted-text mt-0.5">{t('nav.signInAdminHint')}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden p-2 text-body-text hover:text-ink transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-t border-divider">
          <nav className="container-readable py-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-3 text-base rounded-md transition-colors ${
                    isActive ? 'text-ink bg-sand font-medium' : 'text-body-text hover:bg-sand/60'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <div className="mt-2 pt-3 border-t border-divider flex items-center gap-3 px-3">
              <LanguageToggle />
            </div>
            <Link
              href="/portal/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 mt-1 text-sm text-body-text hover:bg-sand/60 rounded-md flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" /> {t('nav.signInOrg')}
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm text-body-text hover:bg-sand/60 rounded-md flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> {t('nav.signInAdmin')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

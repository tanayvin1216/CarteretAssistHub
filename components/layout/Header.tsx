'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, Shield, Building2, ArrowRight } from 'lucide-react';
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
  { href: '/allies', labelKey: 'nav.allies' as const },
  { href: '/about', labelKey: 'nav.about' as const },
  { href: '/report', labelKey: 'nav.report' as const },
];

/**
 * Quiet editorial bar: full-width white surface with a hairline rule.
 * The wordmark is the display serif with a seafoam tide-mark dot; nav is
 * sentence case with the active page in harbor teal. A soft shadow fades
 * in once content scrolls underneath — no floating pill, no chrome.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-divider transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_20px_-12px_rgba(28,31,38,0.18)]' : 'shadow-none'
      }`}
    >
      <div className="container-readable flex items-center gap-6 h-16 md:h-[72px]">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full bg-seafoam-deep group-hover:bg-primary-600 transition-colors"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[21px] md:text-[23px] text-ink tracking-tight">
              Assist Hub
            </span>
            <span className="text-[9px] font-sans font-semibold text-muted-text tracking-[0.22em] uppercase mt-1">
              Carteret County · NC
            </span>
          </span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-[14px] rounded-md transition-colors ${
                  isActive
                    ? 'text-primary-600 font-semibold'
                    : 'text-body-text font-medium hover:text-ink hover:bg-sand/70'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5 ml-auto md:ml-0 shrink-0">
          <LanguageToggle className="hidden sm:inline-flex" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden lg:inline-flex items-center gap-1 h-9 px-3 text-[13px] font-medium text-body-text hover:text-ink rounded-md hover:bg-sand/70 transition-colors">
                {t('nav.signIn')}
                <ChevronDown className="h-3 w-3 opacity-60" />
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

          {/* Primary CTA — seafoam carries ink, never white-on-teal */}
          <Link
            href="/get-help"
            className="hidden md:inline-flex items-center gap-2 h-10 px-4 bg-seafoam hover:bg-seafoam-deep text-ink text-[13.5px] font-semibold rounded-lg transition-colors group"
          >
            {t('hero.ctaHelp')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden p-2 text-body-text hover:text-ink transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-divider bg-surface">
          <nav className="container-readable py-3 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-3 text-base rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-seafoam-tint font-semibold'
                      : 'text-body-text hover:bg-sand/70'
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
              className="px-3 py-2.5 mt-1 text-sm text-body-text hover:bg-sand/70 rounded-lg flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" /> {t('nav.signInOrg')}
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm text-body-text hover:bg-sand/70 rounded-lg flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> {t('nav.signInAdmin')}
            </Link>
            <Link
              href="/get-help"
              onClick={() => setOpen(false)}
              className="mt-2 mb-1 mx-3 inline-flex items-center justify-center gap-2 h-11 bg-seafoam text-ink text-sm font-semibold rounded-lg"
            >
              {t('hero.ctaHelp')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

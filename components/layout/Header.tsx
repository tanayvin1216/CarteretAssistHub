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
  { href: '/about', labelKey: 'nav.about' as const },
];

/**
 * Floating pill header with graceful scroll behavior:
 * - At top: the outer band is transparent so the pill appears to float on
 *   the hero's warm sand background.
 * - Once scrolled past ~20px: the outer band fades in a frosted-glass
 *   backdrop (background/75 + blur) plus a hairline border. Content slides
 *   underneath smoothly rather than jumping around the pill edges.
 * - The pill itself slightly compacts (less outer padding) so the overall
 *   header "settles" into place instead of staying oversized.
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
      className={`sticky top-0 z-40 w-full transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-out ${
        scrolled
          ? 'bg-background/75 backdrop-blur-md border-b border-divider/60 shadow-[0_1px_0_0_rgba(28,31,38,0.02)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div
        className={`container-readable transition-[padding] duration-300 ease-out ${
          scrolled ? 'pt-2 md:pt-3 pb-2 md:pb-3' : 'pt-4 md:pt-6 pb-0'
        }`}
      >
        <div
          className={`flex items-center gap-2 bg-surface border border-divider rounded-full px-3 md:px-4 transition-[height,box-shadow] duration-300 ease-out ${
            scrolled
              ? 'h-12 md:h-14 shadow-[0_2px_16px_-6px_rgba(28,31,38,0.12)]'
              : 'h-14 md:h-16 shadow-[0_2px_24px_-8px_rgba(28,31,38,0.08)]'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-0.5 pr-2 md:pr-3 shrink-0">
            <span
              className={`font-extrabold tracking-tight text-ink leading-none transition-[font-size] duration-300 ease-out ${
                scrolled ? 'text-[20px] md:text-[22px]' : 'text-[22px] md:text-[26px]'
              }`}
            >
              Assist
            </span>
            <span
              className={`font-extrabold tracking-tight text-primary leading-none transition-[font-size] duration-300 ease-out ${
                scrolled ? 'text-[20px] md:text-[22px]' : 'text-[22px] md:text-[26px]'
              }`}
            >
              Hub
            </span>
            <span className="hidden md:inline text-[9px] font-semibold text-muted-text tracking-widest ml-1 uppercase">
              NC
            </span>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5 mx-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wider rounded-full transition-colors ${
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

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
            <LanguageToggle className="hidden sm:inline-flex" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden lg:inline-flex items-center gap-1 h-9 px-3 text-[12px] font-semibold uppercase tracking-wider text-body-text hover:text-ink rounded-full transition-colors">
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

            {/* Primary CTA */}
            <Link
              href="/get-help"
              className="hidden md:inline-flex items-center gap-2 h-10 pl-4 pr-1 bg-sand hover:bg-sand-deep rounded-full transition-colors group"
            >
              <span className="text-[12px] font-semibold uppercase tracking-wider text-ink">
                {t('hero.ctaHelp')}
              </span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white group-hover:bg-primary transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
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
          <div className="md:hidden mt-2 bg-surface border border-divider rounded-2xl shadow-[0_2px_24px_-8px_rgba(28,31,38,0.08)] p-3">
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-3 text-base rounded-lg transition-colors ${
                      isActive ? 'text-ink bg-sand font-semibold' : 'text-body-text hover:bg-sand/60'
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
                className="px-3 py-2.5 mt-1 text-sm text-body-text hover:bg-sand/60 rounded-lg flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" /> {t('nav.signInOrg')}
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-body-text hover:bg-sand/60 rounded-lg flex items-center gap-2"
              >
                <Shield className="h-4 w-4" /> {t('nav.signInAdmin')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

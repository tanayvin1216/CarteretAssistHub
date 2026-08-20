'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { ExternalLink, Globe, Mail, MapPin, Phone, Printer, Search, X } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';
import { SECTORS } from '@/lib/sectors';
import { fold, localized, noteLines, phoneLinks } from '@/lib/resources';
import type { Resource, ResourceCategory } from '@/types/database';

interface Props {
  categories: ResourceCategory[];
  resources: Resource[];
}

export function ResourceDirectory({ categories, resources }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [town, setTown] = useState<string>('');
  const deferredQuery = useDeferredValue(query);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const towns = useMemo(
    () =>
      Array.from(new Set(resources.map((r) => r.town).filter((v): v is string => !!v))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [resources],
  );

  /**
   * One folded haystack per resource, built once. It spans both languages so a
   * Spanish speaker searching "despensa" and an English speaker searching
   * "pantry" both land on the same entry.
   */
  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of resources) {
      const category = categoryById.get(r.category_id);
      map.set(
        r.id,
        fold(
          [
            r.name,
            r.name_es,
            r.address,
            r.address_es,
            r.town,
            r.notes,
            r.notes_es,
            category?.name,
            category?.name_es,
          ]
            .filter(Boolean)
            .join(' '),
        ),
      );
    }
    return map;
  }, [resources, categoryById]);

  const filtered = useMemo(() => {
    const needle = fold(deferredQuery);
    return resources.filter((r) => {
      if (categorySlug && categoryById.get(r.category_id)?.slug !== categorySlug) return false;
      if (town && r.town !== town) return false;
      if (needle && !(haystacks.get(r.id) ?? '').includes(needle)) return false;
      return true;
    });
  }, [resources, categorySlug, town, deferredQuery, haystacks, categoryById]);

  /** Filtered resources regrouped under their category, in booklet order. */
  const groups = useMemo(() => {
    const byCategory = new Map<string, Resource[]>();
    for (const r of filtered) {
      const list = byCategory.get(r.category_id);
      if (list) list.push(r);
      else byCategory.set(r.category_id, [r]);
    }
    return categories
      .map((category) => ({ category, items: byCategory.get(category.id) ?? [] }))
      .filter((group) => group.items.length > 0);
  }, [filtered, categories]);

  /**
   * Per-category counts that honour the search and town filters but ignore the
   * category filter — the rail and the category select are what set it, so
   * they have to keep showing every option and what it would yield.
   */
  const countsBySlug = useMemo(() => {
    const needle = fold(deferredQuery);
    const counts = new Map<string, number>();
    for (const r of resources) {
      if (town && r.town !== town) continue;
      if (needle && !(haystacks.get(r.id) ?? '').includes(needle)) continue;
      const slug = categoryById.get(r.category_id)?.slug;
      if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return counts;
  }, [resources, categoryById, town, deferredQuery, haystacks]);

  const isFiltered = Boolean(query || categorySlug || town);
  const clearAll = () => {
    setQuery('');
    setCategorySlug('');
    setTown('');
  };

  return (
    <div>
      <section className="bg-sand border-b border-divider print:hidden">
        <div className="container-readable py-14 md:py-20">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600 mb-4">
            <span aria-hidden className="h-px w-8 bg-seafoam-deep" />
            {t('nav.resources')}
          </p>
          <h1 className="font-display text-4xl md:text-[3.5rem] text-ink leading-[1.08] mb-5 max-w-3xl">
            {t('resources.title')}
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
            {t('resources.lede')}
          </p>
          <p className="mt-6 font-mono text-xs text-muted-text tabular-nums">
            {resources.length} · {categories.length}{' '}
            {locale === 'es' ? 'categorías' : 'categories'}
          </p>
        </div>
      </section>

      {/* Filters — sticky under the header so search stays reachable while scrolling. */}
      <section className="sticky top-16 md:top-[72px] z-30 bg-background/95 backdrop-blur-sm border-b border-divider print:hidden">
        <div className="container-readable py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[15rem]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('resources.searchPlaceholder')}
              aria-label={t('resources.searchPlaceholder')}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-divider rounded-lg text-sm text-ink placeholder:text-muted-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            aria-label={t('resources.allCategories')}
            className="h-11 px-3 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 max-w-[16rem]"
          >
            <option value="">{t('resources.allCategories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {localized(c.name, c.name_es, locale)} ({countsBySlug.get(c.slug) ?? 0})
              </option>
            ))}
          </select>

          <select
            value={town}
            onChange={(e) => setTown(e.target.value)}
            aria-label={t('resources.filterTown')}
            className="h-11 px-3 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
          >
            <option value="">{t('resources.allTowns')}</option>
            {towns.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 h-11 px-3 text-sm text-muted-text hover:text-ink transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t('resources.clear')}
            </button>
          )}

          <span className="font-mono text-xs text-muted-text tabular-nums ml-auto">
            {filtered.length} {filtered.length === 1 ? t('resources.result') : t('resources.results')}
          </span>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable py-10 md:py-14 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          {/* Category rail — a table of contents mirroring the printed booklet. */}
          <nav aria-label={t('resources.jumpTo')} className="hidden lg:block print:hidden">
            <div className="sticky top-[9.5rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text mb-3">
                {t('resources.jumpTo')}
              </p>
              <ul className="space-y-0.5 max-h-[calc(100vh-13rem)] overflow-y-auto scrollbar-hide pr-1">
                {categories.map((c) => {
                  const count = countsBySlug.get(c.slug) ?? 0;
                  const isActive = categorySlug === c.slug;
                  return (
                    <li key={c.id}>
                      <a
                        href={`#cat-${c.slug}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={(e) => {
                          // With a category pinned, the other sections are not
                          // rendered, so there is nothing to scroll to — switch
                          // the filter instead of following a dead anchor.
                          if (categorySlug) {
                            e.preventDefault();
                            setCategorySlug(c.slug);
                          }
                        }}
                        className={`flex items-baseline justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                          isActive
                            ? 'text-primary-600 font-semibold bg-seafoam-tint'
                            : count === 0
                              ? 'text-muted-text/60'
                              : 'text-body-text hover:text-ink hover:bg-sand/70'
                        }`}
                      >
                        <span>{localized(c.name, c.name_es, locale)}</span>
                        <span className="font-mono text-[11px] text-muted-text tabular-nums shrink-0">
                          {count}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div>
            {groups.length === 0 ? (
              <div className="bg-sand border border-divider rounded-xl p-10 text-center">
                <p className="text-sm text-body-text">{t('resources.noResults')}</p>
                <button
                  onClick={clearAll}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <X className="h-3.5 w-3.5" />
                  {t('resources.clear')}
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {groups.map(({ category, items }) => (
                  <section key={category.id} id={`cat-${category.slug}`} className="scroll-mt-40">
                    <header className="flex items-baseline gap-3 pb-3 mb-5 border-b border-divider">
                      <h2 className="font-display text-2xl md:text-[1.75rem] text-ink leading-tight">
                        {localized(category.name, category.name_es, locale)}
                      </h2>
                      <span className="font-mono text-xs text-muted-text tabular-nums ml-auto shrink-0">
                        {items.length}
                      </span>
                    </header>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((r) => (
                        <ResourceCard key={r.id} resource={r} locale={locale} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            <footer className="mt-14 pt-8 border-t border-divider flex flex-wrap items-center gap-4 print:hidden">
              <p className="text-xs text-muted-text leading-relaxed max-w-xl flex-1 min-w-[16rem]">
                {t('resources.source')}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/report"
                  className="inline-flex items-center h-10 px-4 border border-divider rounded-lg text-[13px] font-semibold text-ink hover:bg-sand transition-colors"
                >
                  {t('nav.report')}
                </Link>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 h-10 px-4 bg-seafoam hover:bg-seafoam-deep text-ink text-[13px] font-semibold rounded-lg transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  {t('resources.print')}
                </button>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResourceCard({ resource: r, locale }: { resource: Resource; locale: string }) {
  const { t } = useTranslation();
  const name = localized(r.name, r.name_es, locale);
  const address = localized(r.address, r.address_es, locale);
  const notes = localized(r.notes, r.notes_es, locale);
  const sector = SECTORS.find((s) => s.slug === r.sector_slug);
  const sectorName = sector && (locale === 'es' ? sector.nameEs : sector.name);
  const phones = phoneLinks(r.phone);

  return (
    <li className="bg-surface border border-divider rounded-xl p-5 flex flex-col print:break-inside-avoid">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[1.05rem] text-ink leading-snug">{name}</h3>
        {sector && (
          <span
            title={`${t('resources.relatedSector')}: ${sectorName}`}
            className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: sector.accentHex }}
          >
            <span className="sr-only">
              {t('resources.relatedSector')}: {sectorName}
            </span>
          </span>
        )}
      </div>

      {address && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-text leading-relaxed">
          <MapPin className="h-3 w-3 mt-0.5 shrink-0" aria-hidden />
          <span>{address}</span>
        </p>
      )}

      {notes && (
        /* The booklet breaks some notes across lines; `|` marks that break. */
        <p className="mt-2 text-xs text-body-text leading-relaxed">
          {noteLines(notes).map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      )}

      {(phones.length > 0 || r.website || r.email) && (
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {phones.map((tel) => (
            <a
              key={tel.href}
              href={tel.href}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Phone className="h-3 w-3" aria-hidden />
              <span className="sr-only">{t('resources.call')} </span>
              {tel.label}
            </a>
          ))}
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Globe className="h-3 w-3" aria-hidden />
              {t('resources.visit')}
              <ExternalLink className="h-2.5 w-2.5 opacity-60" aria-hidden />
            </a>
          )}
          {r.email && (
            <a
              href={`mailto:${r.email}`}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline break-all"
            >
              <Mail className="h-3 w-3 shrink-0" aria-hidden />
              {r.email}
            </a>
          )}
        </div>
      )}
    </li>
  );
}

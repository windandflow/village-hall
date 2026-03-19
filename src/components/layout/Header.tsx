'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { RequestModal } from '@/components/invite-request/RequestModal';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  const NAV_LINKS = [
    { href: '/about', labelKey: 'nav.about' as const },
    { href: '/events', labelKey: 'nav.events' as const },
    { href: '/nim', labelKey: 'nav.members' as const },
    { href: '/sodo', labelKey: 'nav.sodo' as const },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-wf-border bg-wf-warm/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* 로고 */}
        <Link
          href="/"
          className="text-sm font-medium tracking-widest text-wf-text"
          onClick={() => setMenuOpen(false)}
        >
          wind &amp; flow
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-wf-text-light transition-colors hover:text-wf-text"
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {/* 언어 토글 */}
          <button
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="rounded-md px-2 py-1 text-xs font-medium text-wf-text-light transition-colors hover:bg-wf-cream hover:text-wf-text"
            aria-label="Toggle language"
          >
            {locale === 'ko' ? 'EN' : '한'}
          </button>

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="rounded-md px-2 py-1 text-sm transition-colors hover:bg-wf-cream"
            aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <RequestModal />

          <Link
            href="/my"
            className="rounded-full bg-wf-navy px-4 py-1.5 text-sm text-white transition-opacity hover:opacity-80"
          >
            {t('common.my_passport')}
          </Link>
        </nav>

        {/* 모바일 우측 */}
        <div className="flex items-center gap-2 md:hidden">
          {/* 언어 토글 */}
          <button
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="rounded-md px-2 py-1 text-xs font-medium text-wf-text-light"
          >
            {locale === 'ko' ? 'EN' : '한'}
          </button>

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="rounded-md px-1 py-1 text-sm"
            aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* 햄버거 */}
          <button
            className="flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t('nav.menu_close') : t('nav.menu_open')}
          >
            {menuOpen ? (
              <X className="h-5 w-5 text-wf-text" />
            ) : (
              <Menu className="h-5 w-5 text-wf-text" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="border-t border-wf-border bg-wf-warm md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-wf-text-light hover:text-wf-text"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              href="/my"
              className="mt-2 rounded-full bg-wf-navy px-4 py-2 text-center text-sm text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t('common.my_passport')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/about', label: '소개' },
  { href: '/events', label: '이벤트' },
  { href: '/nim', label: '구성원' },
  { href: '/sodo', label: '소도' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              {link.label}
            </Link>
          ))}
          <Link
            href="/my"
            className="rounded-full bg-wf-navy px-4 py-1.5 text-sm text-white transition-opacity hover:opacity-80"
          >
            내 여권
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {menuOpen ? (
            <X className="h-5 w-5 text-wf-text" />
          ) : (
            <Menu className="h-5 w-5 text-wf-text" />
          )}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="border-t border-wf-border bg-wf-warm md:hidden">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-wf-text-light hover:text-wf-text"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/my"
              className="mt-2 rounded-full bg-wf-navy px-4 py-2 text-center text-sm text-white"
              onClick={() => setMenuOpen(false)}
            >
              내 여권
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

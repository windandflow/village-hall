'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getAvatarGradient, getAvatarInitial } from '@/lib/utils/avatar';

interface NimEntry {
  entityId: string;
  displayName: string;
  slug: string;
  bio?: string;
  level: number;
  stateId: string;
}

interface SodoStats {
  totalMembers: number;
  totalVisas: number;
  totalElders: number;
}

export default function HomePage() {
  const { t } = useLocale();

  const [nims, setNims] = useState<NimEntry[]>([]);
  const [nimsLoading, setNimsLoading] = useState(true);

  const [stats, setStats] = useState<SodoStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/nim?stateId=newmoon')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: NimEntry[]) => setNims(data.slice(0, 8)))
      .catch(() => setNims([]))
      .finally(() => setNimsLoading(false));

    fetch('/api/admin/stats?stateId=newmoon')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setStats({
            totalMembers: data.totalMembers ?? 0,
            totalVisas: data.totalVisas ?? 0,
            totalElders: data.totalElders ?? 0,
          });
        }
      })
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero — Fullscreen video + cinematic typography */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[hsl(201,100%,13%)] text-white">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 md:pb-40 md:pt-32">
          <h1 className="animate-fade-rise max-w-4xl text-3xl font-normal leading-[0.95] tracking-[-1.5px] text-white sm:text-5xl md:text-7xl lg:text-8xl">
            {t('landing.hero.cinematic_pre')}
            <em className="not-italic text-white/50">
              {t('landing.hero.cinematic_em')}
            </em>
          </h1>

          <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
            {t('landing.hero.description')}
          </p>

          <p className="animate-fade-rise-delay mt-3 text-xs tracking-widest text-white/30">
            {t('common.philosophy')}
          </p>

          <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="liquid-glass rounded-full px-6 py-3 text-sm text-white transition-transform hover:scale-[1.03] md:px-8 md:py-4"
            >
              {t('landing.hero.manifesto')}
            </Link>
            <Link
              href="/onboarding/sign"
              className="liquid-glass rounded-full bg-wf-celadon/20 px-8 py-4 text-sm text-white transition-transform hover:scale-[1.03]"
            >
              {t('common.request_invite_long')}
            </Link>
          </div>
        </div>
      </section>

      {/* 소도 네트워크 */}
      <section className="bg-wf-cream px-4 py-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between px-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
                {t('landing.sodo.label')}
              </span>
              <h2 className="mt-1 text-xl font-bold text-wf-navy md:text-2xl">
                {t('landing.sodo.title')}
              </h2>
            </div>
            <Link
              href="/sodo"
              className="text-xs font-medium text-wf-celadon hover:underline"
            >
              {t('common.view_all')}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 달뜨는마을 — Active */}
            <Link
              href="/sodo/newmoon"
              className="group rounded-[10px] bg-wf-warm p-6 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(27,58,92,0.14)]"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-cream text-xl">
                    🌙
                  </div>
                  <div>
                    <h3 className="font-bold text-wf-navy">
                      {t('landing.sodo.newmoon')}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-wf-text-faint">
                      {t('landing.sodo.newmoon_location')}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-wf-celadon/10 px-2 py-1 text-[10px] font-bold text-wf-celadon">
                  {t('common.active')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-wf-navy/5 pt-4">
                <div className="text-center">
                  <p className="text-[10px] text-wf-text-faint">
                    {t('landing.sodo.stat_members')}
                  </p>
                  {statsLoading ? (
                    <div className="mx-auto mt-1 h-5 w-8 animate-pulse rounded bg-wf-border" />
                  ) : (
                    <p className="font-bold text-wf-navy">
                      {stats?.totalMembers ?? '—'}
                    </p>
                  )}
                </div>
                <div className="border-x border-wf-navy/5 text-center">
                  <p className="text-[10px] text-wf-text-faint">
                    {t('landing.sodo.stat_residents')}
                  </p>
                  {statsLoading ? (
                    <div className="mx-auto mt-1 h-5 w-8 animate-pulse rounded bg-wf-border" />
                  ) : (
                    <p className="font-bold text-wf-navy">
                      {stats?.totalVisas ?? '—'}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-wf-text-faint">
                    {t('landing.sodo.stat_elders')}
                  </p>
                  {statsLoading ? (
                    <div className="mx-auto mt-1 h-5 w-8 animate-pulse rounded bg-wf-border" />
                  ) : (
                    <p className="font-bold text-wf-navy">
                      {stats?.totalElders ?? '—'}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            {/* 하회마을 — Coming Soon */}
            <div className="flex cursor-default items-center gap-4 rounded-[10px] bg-wf-warm/60 p-6 opacity-40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-border text-xl">
                🏛
              </div>
              <div>
                <h3 className="font-bold text-wf-navy">
                  {t('landing.sodo.hwahoe')}
                </h3>
                <p className="text-[10px] text-wf-text-faint">
                  {t('landing.sodo.hwahoe_location')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NIMs */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-lg font-bold tracking-tight text-wf-navy">
              {t('landing.nims.title')}
            </h2>
            <Link
              href="/nim"
              className="text-xs font-medium text-wf-celadon hover:underline"
            >
              {t('common.all')}
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 md:gap-6">
            {nimsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-shrink-0 flex-col items-center">
                  <div className="mb-2 h-16 w-16 animate-pulse rounded-full bg-wf-border" />
                  <div className="mt-1 h-3 w-12 animate-pulse rounded bg-wf-border" />
                  <div className="mt-1 h-2.5 w-10 animate-pulse rounded bg-wf-border" />
                </div>
              ))
            ) : (
              nims.map((nim) => {
                const [from, to] = getAvatarGradient(nim.entityId);
                const initial = getAvatarInitial(nim.displayName);
                return (
                  <Link
                    key={nim.entityId}
                    href={`/nim/${nim.slug}`}
                    className="flex flex-shrink-0 flex-col items-center"
                  >
                    <div
                      className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-lg font-bold text-white shadow-sm dark:border-wf-border"
                      style={{
                        background: `linear-gradient(to bottom right, ${from}, ${to})`,
                      }}
                    >
                      {initial}
                    </div>
                    <span className="text-[11px] font-medium text-wf-navy">
                      {nim.displayName} {t('passport.nim')}
                    </span>
                    <span className="text-[10px] text-wf-text-faint">
                      @{nim.slug}
                    </span>
                  </Link>
                );
              })
            )}
            {/* Join placeholder */}
            <Link
              href="/sodo/newmoon"
              className="flex flex-shrink-0 flex-col items-center"
            >
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-wf-celadon/30 text-2xl text-wf-celadon">
                +
              </div>
              <span className="text-[11px] font-medium text-wf-navy">
                {t('common.join')}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[20px] bg-wf-navy p-10 text-center md:p-14 dark:bg-[#122240]">
            <div className="relative z-10">
              <h3 className="whitespace-pre-line text-xl font-bold leading-snug text-wf-warm md:text-2xl dark:text-white">
                {t('landing.cta.title')}
              </h3>
              <p className="mt-3 text-xs text-wf-warm/60 dark:text-white/50">
                {t('landing.cta.description')}
              </p>
              <Link
                href="/onboarding/sign"
                className="mt-6 inline-block liquid-glass rounded-full px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                {t('common.request_invite_long')}
              </Link>
            </div>
            {/* Decorative blur */}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

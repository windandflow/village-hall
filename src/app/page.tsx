'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';

const FEATURED_NIMS = [
  { name: '범선', handle: '@bumsun', initial: '범', gradient: 'from-[#8BBFBC] to-[#6BA3A0]' },
  { name: '한석', handle: '@hahnryu', initial: '한', gradient: 'from-[#C4A265] to-[#D4B275]' },
  { name: '지연', handle: '@jiyeon', initial: '지', gradient: 'from-[#7AA3C4] to-[#8AB3D4]' },
  { name: '희문', handle: '@heemun', initial: '희', gradient: 'from-[#A4C47A] to-[#B4D48A]' },
];

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col">
      {/* Hero — Background image + overlay */}
      <section className="relative bg-wf-navy px-6 py-24 text-center text-white md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero1.png')" }}
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        <div className="relative z-10">
          <h1 className="text-3xl font-light tracking-[0.15em] md:text-5xl">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-2 text-sm tracking-widest text-white/50">
            {t('common.tagline')}
          </p>
          <p className="mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed text-white/80 md:max-w-md md:text-base">
            {t('landing.hero.description')}
          </p>
          <p className="mt-3 text-xs text-white/40">{t('common.philosophy')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="rounded-[10px] border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {t('landing.hero.manifesto')}
            </Link>
            <Link
              href="/sodo/newmoon"
              className="rounded-[10px] bg-wf-celadon px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
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
                  <p className="font-bold text-wf-navy">23</p>
                </div>
                <div className="border-x border-wf-navy/5 text-center">
                  <p className="text-[10px] text-wf-text-faint">
                    {t('landing.sodo.stat_residents')}
                  </p>
                  <p className="font-bold text-wf-navy">18</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-wf-text-faint">
                    {t('landing.sodo.stat_elders')}
                  </p>
                  <p className="font-bold text-wf-navy">3</p>
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
          <div className="flex gap-6 overflow-x-auto pb-4">
            {FEATURED_NIMS.map((nim) => (
              <Link
                key={nim.handle}
                href={`/nim/${nim.handle.slice(1)}`}
                className="flex flex-shrink-0 flex-col items-center"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${nim.gradient} mb-2 border-2 border-white text-lg font-bold text-white shadow-sm dark:border-wf-border`}
                >
                  {nim.initial}
                </div>
                <span className="text-[11px] font-medium text-wf-navy">
                  {nim.name}
                </span>
                <span className="text-[10px] text-wf-text-faint">
                  {nim.handle}
                </span>
              </Link>
            ))}
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
                href="/sodo/newmoon"
                className="mt-6 inline-block rounded-[10px] bg-wf-celadon px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-80"
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

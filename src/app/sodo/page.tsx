'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';

const SODO_LIST = [
  {
    slug: 'newmoon',
    nameKey: 'landing.sodo.newmoon' as const,
    locationKey: 'landing.sodo.newmoon_location' as const,
    emoji: '🌙',
    active: true,
  },
  {
    slug: 'hahoe',
    nameKey: 'landing.sodo.hwahoe' as const,
    locationKey: 'landing.sodo.hwahoe_location' as const,
    emoji: '🏛',
    active: false,
  },
];

export default function SodoListPage() {
  const { t } = useLocale();
  const [stats, setStats] = useState<Record<string, { totalMembers: number; totalVisas: number; pendingRequests: number }>>({});

  useEffect(() => {
    // Fetch stats for active sodo only
    SODO_LIST.filter((s) => s.active).forEach((sodo) => {
      fetch(`/api/admin/stats?stateId=${sodo.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setStats((prev) => ({ ...prev, [sodo.slug]: data }));
        })
        .catch(() => {
          // silently fail, will show fallback
        });
    });
  }, []);

  return (
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* 미니 히어로 */}
        <div className="mb-8 rounded-[10px] bg-wf-navy p-8 text-center text-white">
          <h1 className="text-2xl font-bold">{t('sodo.title')}</h1>
          <p className="mt-2 text-sm text-white/60">
            {t('sodo.hero_description')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SODO_LIST.map((sodo) => (
            sodo.active ? (
              <Link
                key={sodo.slug}
                href={`/sodo/${sodo.slug}`}
                className="group rounded-[10px] bg-wf-cream p-6 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(27,58,92,0.14)] dark:bg-[#0F1F2E]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-warm text-xl dark:bg-[#0A1628]">
                    {sodo.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-wf-navy">{t(sodo.nameKey)}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-wf-text-faint">
                      {t(sodo.locationKey)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-wf-border pt-3">
                  <span className="text-xs text-wf-text-faint">
                    {t('sodo.members_count')}: <strong className="text-wf-navy">{stats[sodo.slug]?.totalVisas ?? '–'}</strong>
                  </span>
                  <span className="rounded-full bg-wf-celadon/10 px-2 py-0.5 text-[10px] font-bold text-wf-celadon">
                    {t('common.active')}
                  </span>
                </div>
              </Link>
            ) : (
              <div
                key={sodo.slug}
                className="flex items-center gap-4 rounded-[10px] bg-wf-cream/60 p-6 opacity-40 dark:bg-[#0F1F2E]/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-border text-xl">
                  {sodo.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-wf-navy">{t(sodo.nameKey)}</h3>
                  <p className="text-[10px] text-wf-text-faint">{t('sodo.coming_soon')}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

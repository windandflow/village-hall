'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getAvatarGradient, getAvatarInitial } from '@/lib/utils/avatar';
import { VisaLevel } from '@/components/visa/VisaLevel';

interface NimEntry {
  entityId: string;
  displayName: string;
  slug: string;
  bio?: string;
  level: number;
  stateId: string;
}

export default function NimDirectoryPage() {
  const { t } = useLocale();
  const [search, setSearch] = useState('');
  const [nims, setNims] = useState<NimEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/nim?stateId=newmoon')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNims(data))
      .catch(() => setNims([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = nims.filter(
    (n) =>
      n.displayName.toLowerCase().includes(search.toLowerCase()) ||
      n.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* 미니 히어로 */}
        <div className="mb-8 rounded-[10px] bg-wf-navy p-8 text-center text-white">
          <h1 className="text-2xl font-bold">{t('nim.title')}</h1>
          <p className="mt-2 text-sm text-white/60">
            {t('nim.hero_description')}
          </p>
        </div>

        {/* 검색 */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('nim.search')}
          className="mb-6 w-full rounded-[10px] border border-wf-border bg-wf-cream px-4 py-3 text-sm text-wf-text placeholder:text-wf-text-faint focus:border-wf-celadon focus:outline-none dark:bg-[#0F1F2E]"
        />

        {/* 목록 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-wf-text-faint">
            {search ? t('nim.no_results') : t('nim.empty')}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((nim) => {
              const [from, to] = getAvatarGradient(nim.entityId);
              return (
                <Link
                  key={nim.entityId}
                  href={`/nim/${nim.slug || nim.entityId}`}
                  className="flex items-center gap-4 rounded-[10px] bg-wf-cream p-4 transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] dark:bg-[#0F1F2E]"
                >
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  >
                    {getAvatarInitial(nim.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-wf-navy">
                        {nim.displayName} {t('passport.nim')}
                      </span>
                      <VisaLevel level={nim.level} />
                    </div>
                    {nim.slug && (
                      <p className="text-xs text-wf-text-faint">@{nim.slug}</p>
                    )}
                    {nim.bio && (
                      <p className="mt-0.5 truncate text-xs text-wf-text-light">{nim.bio}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
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

// 더미 데이터 (추후 direct.ts → SDK로 교체)
const MOCK_NIMS: NimEntry[] = [
  { entityId: 'a1b2c3d4-0001', displayName: '범선', slug: 'bumsun', bio: '풍류회 대표', level: 4, stateId: 'newmoon' },
  { entityId: 'a1b2c3d4-0002', displayName: '한석', slug: 'hahnryu', bio: 'Node One 대표', level: 3, stateId: 'newmoon' },
  { entityId: 'a1b2c3d4-0003', displayName: '지연', slug: 'jiyeon', bio: '달뜨는마을 주민', level: 2, stateId: 'newmoon' },
  { entityId: 'a1b2c3d4-0004', displayName: '희문', slug: 'heemun', bio: '인제 신월리', level: 1, stateId: 'newmoon' },
  { entityId: 'a1b2c3d4-0005', displayName: '도훈', slug: 'dohun', bio: 'Studio Kado', level: 1, stateId: 'newmoon' },
  { entityId: 'a1b2c3d4-0006', displayName: '카야', slug: 'kaya', bio: 'Studio Kado', level: 1, stateId: 'newmoon' },
];

export default function NimDirectoryPage() {
  const { t } = useLocale();
  const [search, setSearch] = useState('');

  const filtered = MOCK_NIMS.filter(
    (n) =>
      n.displayName.toLowerCase().includes(search.toLowerCase()) ||
      n.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-6 text-lg font-bold text-wf-navy">{t('nim.title')}</h1>

        {/* 검색 */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('nim.search')}
          className="mb-6 w-full rounded-[10px] border border-wf-border bg-wf-cream px-4 py-3 text-sm text-wf-text placeholder:text-wf-text-faint focus:border-wf-celadon focus:outline-none dark:bg-[#0F1F2E]"
        />

        {/* 목록 */}
        {filtered.length === 0 ? (
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
                  href={`/nim/${nim.slug}`}
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
                    <p className="text-xs text-wf-text-faint">@{nim.slug}</p>
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

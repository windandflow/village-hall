'use client';

import { useParams } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PassportBooklet } from '@/components/passport/PassportBooklet';

// 더미 데이터 (추후 direct.ts → getEntityBySlug로 교체)
const MOCK_PROFILES: Record<string, {
  entityId: string;
  displayName: string;
  slug: string;
  bio?: string;
  passportNumber: number;
  issuedAt: string;
  visas: Array<{ stateId: string; stateName: string; level: number; levelLabel: string; joinedAt: string }>;
  links: Array<{ label: string; url: string }>;
  bonds: Array<{ entityId: string; displayName: string; slug?: string }>;
}> = {
  bumsun: {
    entityId: 'a1b2c3d4-0001',
    displayName: '범선',
    slug: 'bumsun',
    bio: '풍류회 대표. 매니페스토 저자.\n\n"바람처럼 자유롭게, 물처럼 흐르며."',
    passportNumber: 1,
    issuedAt: '2026-03-20',
    visas: [{ stateId: 'newmoon', stateName: '달뜨는마을', level: 4, levelLabel: 'Elder', joinedAt: '2026-03-20' }],
    links: [{ label: '풍류회', url: 'https://pungryu.kr' }],
    bonds: [
      { entityId: 'a1b2c3d4-0002', displayName: '한석', slug: 'hahnryu' },
      { entityId: 'a1b2c3d4-0003', displayName: '지연', slug: 'jiyeon' },
    ],
  },
  hahnryu: {
    entityId: 'a1b2c3d4-0002',
    displayName: '한석',
    slug: 'hahnryu',
    bio: 'Node One 대표. W&F 기술 총괄.',
    passportNumber: 2,
    issuedAt: '2026-03-20',
    visas: [{ stateId: 'newmoon', stateName: '달뜨는마을', level: 3, levelLabel: 'Steward', joinedAt: '2026-03-20' }],
    links: [{ label: 'GitHub', url: 'https://github.com/hahnryu' }],
    bonds: [
      { entityId: 'a1b2c3d4-0001', displayName: '범선', slug: 'bumsun' },
    ],
  },
};

export default function NimProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLocale();

  const profile = MOCK_PROFILES[slug];

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="text-4xl">🔍</div>
        <p className="text-sm text-wf-text-light">{t('nim.profile_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* NIM 미니히어로 (공유) */}
        <div className="mb-8 rounded-[10px] bg-wf-navy p-8 text-center text-white">
          <h1 className="text-2xl font-bold">{t('nim.title')}</h1>
          <p className="mt-2 text-sm text-white/60">
            {t('nim.hero_description')}
          </p>
        </div>

        {/* NIM = 기본 열린 상태 (커버 없이 바로 5페이지) */}
        <PassportBooklet data={profile} />
      </div>
    </div>
  );
}

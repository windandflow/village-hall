'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PassportCover } from '@/components/passport/PassportCover';
import { PassportBooklet } from '@/components/passport/PassportBooklet';

export default function MyPage() {
  const { entityId, displayName, loading, authenticated, login, logout } = useAuth();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="text-4xl">📘</div>
        <h1 className="text-lg font-bold text-wf-navy">
          {t('common.my_passport')}
        </h1>
        <p className="text-sm text-wf-text-light">{t('my.login_prompt')}</p>
        <button
          onClick={login}
          className="rounded-[10px] bg-wf-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('common.login')}
        </button>
      </div>
    );
  }

  // TODO: passport 존재 여부 확인 (Phase 2 완성 시 direct.ts에서 조회)
  const hasPassport = !!entityId;

  if (!hasPassport) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="text-4xl">📘</div>
        <h1 className="text-lg font-bold text-wf-navy">{t('my.no_passport')}</h1>
        <Link
          href="/onboarding/sign"
          className="rounded-[10px] bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('my.issue_passport')}
        </Link>
      </div>
    );
  }

  // 더미 데이터 (추후 direct.ts/SDK에서 실제 데이터 조회)
  const passportData = {
    entityId: entityId!,
    displayName: displayName || 'Member',
    slug: undefined as string | undefined,
    bio: undefined as string | undefined,
    passportNumber: 1,
    issuedAt: '2026-03-20',
    visas: [
      {
        stateId: 'newmoon',
        stateName: '달뜨는마을',
        level: 1,
        levelLabel: 'Participant',
        joinedAt: '2026-03-20',
      },
    ],
    links: [] as Array<{ label: string; url: string }>,
    bonds: [] as Array<{ entityId: string; displayName: string; slug?: string }>,
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-14">
      {isOpen ? (
        <>
          <PassportBooklet data={passportData} />
          <div className="flex gap-3">
            <Link
              href="/my/edit"
              className="rounded-[10px] border border-wf-border px-6 py-2 text-sm text-wf-text-light transition-colors hover:bg-wf-cream"
            >
              {t('my.edit_profile')}
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-[10px] border border-wf-border px-6 py-2 text-sm text-wf-text-faint transition-colors hover:bg-wf-cream"
            >
              {t('passport.nim') ? '닫기' : 'Close'}
            </button>
          </div>
        </>
      ) : (
        <PassportCover onClick={() => setIsOpen(true)} />
      )}

      <button
        onClick={logout}
        className="mt-4 text-xs text-wf-text-faint transition-colors hover:text-wf-text-light"
      >
        {t('my.logout')}
      </button>
    </div>
  );
}

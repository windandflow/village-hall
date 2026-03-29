'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PassportCover } from '@/components/passport/PassportCover';
import { PassportBooklet } from '@/components/passport/PassportBooklet';

interface ProfileData {
  entityId: string;
  displayName: string;
  slug?: string;
  bio?: string;
  passportNumber: number | null;
  issuedAt: string | null;
  hasPassport: boolean;
  visas: Array<{ stateId: string; stateName: string; level: number; levelLabel: string; joinedAt: string }>;
  links: Array<{ label: string; url: string }>;
  bonds: Array<{ entityId: string; displayName: string; slug?: string }>;
}

export default function MyPage() {
  const { entityId, displayName, loading, authenticated, login, logout } = useAuth();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;
    setProfileLoading(true);
    fetch(`/api/profile?entityId=${entityId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, [entityId]);

  if (loading || profileLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
      </div>
    );
  }

  // 비로그인 → 로그인 유도 + 여권발급 안내
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
        <Link
          href="/onboarding/sign"
          className="text-sm text-wf-celadon hover:underline"
        >
          {t('my.issue_passport')}
        </Link>
      </div>
    );
  }

  const passportData = {
    entityId: profile?.entityId || entityId || 'unknown',
    displayName: profile?.displayName || displayName || 'Member',
    slug: profile?.slug,
    bio: profile?.bio,
    passportNumber: profile?.passportNumber ?? undefined,
    issuedAt: profile?.issuedAt || new Date().toISOString().split('T')[0],
    visas: profile?.visas || [],
    links: profile?.links || [],
    bonds: profile?.bonds || [],
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-14">
      {isOpen ? (
        <>
          <PassportBooklet data={passportData} />
          <div className="flex gap-3">
            <Link
              href="/my/edit"
              className="liquid-glass rounded-full px-6 py-2 text-sm text-wf-text-light transition-transform hover:scale-[1.03]"
            >
              {t('my.edit_profile')}
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-wf-border px-6 py-2 text-sm text-wf-text-faint transition-colors hover:bg-wf-cream"
            >
              ✕
            </button>
          </div>
        </>
      ) : (
        <PassportCover onClick={() => setIsOpen(true)} />
      )}

      <div className="flex gap-4">
        <Link
          href="/my/invite"
          className="text-xs text-wf-celadon hover:underline"
        >
          {t('invite.title')}
        </Link>
        <button
          onClick={logout}
          className="text-xs text-wf-text-faint transition-colors hover:text-wf-text-light"
        >
          {t('my.logout')}
        </button>
      </div>
    </div>
  );
}

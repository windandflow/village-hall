'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PassportBooklet } from '@/components/passport/PassportBooklet';

interface ProfileData {
  entityId: string;
  displayName: string;
  slug?: string;
  bio?: string;
  passportNumber?: number;
  issuedAt?: string;
  visas: Array<{ stateId: string; stateName: string; level: number; levelLabel: string; joinedAt: string }>;
  links: Array<{ label: string; url: string }>;
  bonds: Array<{ entityId: string; displayName: string; slug?: string }>;
}

export default function NimProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLocale();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/profile/${slug}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
      </div>
    );
  }

  if (notFound || !profile) {
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
        {/* NIM 미니히어로 */}
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

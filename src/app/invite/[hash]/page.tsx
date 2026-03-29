'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function InviteAcceptPage() {
  const params = useParams();
  const hash = params.hash as string;
  const router = useRouter();
  const { authenticated, login, loading } = useAuth();
  const { t } = useLocale();

  const [status, setStatus] = useState<'idle' | 'accepting' | 'accepted' | 'invalid'>('idle');

  // TODO: hash로 초대 정보 조회 (direct.ts)
  const inviterName = '범선'; // 더미
  const isValid = hash && hash.length > 0;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="text-4xl">❌</div>
        <p className="text-sm text-wf-text-light">{t('invite.invalid')}</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
        <div className="text-4xl">✉️</div>
        <h1 className="text-lg font-bold text-wf-navy">{t('invite.accept_title')}</h1>
        <p className="text-sm text-wf-text-light">
          <strong>{inviterName}</strong>{t('invite.accept_description')}
        </p>
        <p className="text-xs text-wf-text-faint">{t('invite.login_first')}</p>
        <button
          onClick={login}
          className="rounded-[10px] bg-wf-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('common.login')}
        </button>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
        <div className="text-4xl">🎉</div>
        <h1 className="text-lg font-bold text-wf-navy">{t('invite.accepted')}</h1>
        <button
          onClick={() => router.push('/onboarding/sign')}
          className="rounded-[10px] bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('invite.accepted_next')} →
        </button>
      </div>
    );
  }

  async function handleAccept() {
    setStatus('accepting');
    try {
      // TODO: /api/invitation/accept 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('accepted');
    } catch {
      setStatus('invalid');
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
      <div className="text-4xl">✉️</div>
      <h1 className="text-lg font-bold text-wf-navy">{t('invite.accept_title')}</h1>
      <p className="text-sm text-wf-text-light">
        <strong>{inviterName}</strong>{t('invite.accept_description')}
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          disabled={status === 'accepting'}
          className="rounded-[10px] bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {status === 'accepting' ? t('invite.accepting') : t('invite.accept_button')}
        </button>
        <button
          onClick={() => router.push('/')}
          className="rounded-[10px] border border-wf-border px-6 py-3 text-sm text-wf-text-light transition-colors hover:bg-wf-cream"
        >
          {t('invite.decline_button')}
        </button>
      </div>
    </div>
  );
}

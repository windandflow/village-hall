'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';

/**
 * 매니페스토 서약 페이지
 * EIP-712 서명은 Phase 2 완성 시 Privy embedded wallet으로 구현.
 * 현재는 동의 체크 + 서명 버튼으로 플로우만 구현.
 */
export default function OnboardingSignPage() {
  const { authenticated, login, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'signing' | 'success'>('idle');

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

  async function handleSign() {
    if (!agreed) return;
    setStatus('signing');
    try {
      // TODO: EIP-712 서명 구현
      // const signature = await privy.signTypedData(...)
      // await fetch('/api/manifesto/sign', { ... })
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
        <div className="text-4xl">🕊️</div>
        <h1 className="text-lg font-bold text-wf-navy">
          {t('onboarding.sign.success')}
        </h1>
        <button
          onClick={() => router.push('/my')}
          className="rounded-[10px] bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('onboarding.sign.next')} →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-14">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 text-lg font-bold text-wf-navy">
          {t('onboarding.sign.title')}
        </h1>
        <p className="mb-8 whitespace-pre-line text-sm text-wf-text-light">
          {t('onboarding.sign.description')}
        </p>

        {/* 매니페스토 */}
        <div className="rounded-[10px] bg-wf-cream p-8 dark:bg-[#0F1F2E]">
          <h2 className="mb-4 text-base font-bold text-wf-navy">
            {t('onboarding.sign.manifesto_title')}
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-wf-text-light">
            <p>{t('about.manifesto.p1')}</p>
            <p>{t('about.manifesto.p2')}</p>
            <p>{t('about.manifesto.p3')}</p>
            <p className="font-semibold text-wf-navy">
              {t('about.manifesto.p4')}
            </p>
          </div>
        </div>

        {/* 동의 */}
        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-wf-celadon"
          />
          <span className="text-sm text-wf-text">
            {t('onboarding.sign.agree')}
          </span>
        </label>

        {/* 서명 버튼 */}
        <button
          onClick={handleSign}
          disabled={!agreed || status === 'signing'}
          className="mt-6 w-full rounded-[10px] bg-wf-navy px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {status === 'signing'
            ? t('onboarding.sign.signing')
            : t('onboarding.sign.button')}
        </button>
      </div>
    </div>
  );
}

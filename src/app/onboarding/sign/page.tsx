'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ErrorMessage } from '@/components/ui/error-message';

/**
 * 매니페스토 서약 페이지
 * 1. 매니페스토 읽기 + 동의 체크
 * 2. EIP-712 서명 (Privy embedded wallet)
 * 3. 서명 검증 → DB 저장
 * 4. Passport SBT 민팅
 */
export default function OnboardingSignPage() {
  const { entityId, authenticated, login, loading } = useAuth();
  const { t } = useLocale();
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'signing' | 'minting' | 'success' | 'error'>(
    'idle',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);

  if (loading || !ready) {
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
    if (!agreed || !entityId) return;
    setStatus('signing');
    setErrorMsg('');

    try {
      // 1. 서명 도메인/타입 정보 가져오기
      const infoRes = await fetch('/api/manifesto/sign');
      const { domain, types, manifestoHash } = await infoRes.json();

      // 2. Privy embedded wallet 가져오기
      const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
      if (!embeddedWallet) {
        throw new Error('Wallet not found. Please try logging in again.');
      }

      // 3. EIP-712 서명
      const eip1193Provider = await embeddedWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(eip1193Provider);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const timestamp = Math.floor(Date.now() / 1000);

      const value = {
        signer: walletAddress,
        manifestoHash,
        timestamp,
      };

      const signature = await signer.signTypedData(domain, types, value);

      // 4. 서버로 서명 전송 → 검증 + DB 저장
      const signRes = await fetch('/api/manifesto/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          walletAddress,
          signature,
          timestamp,
        }),
      });

      if (!signRes.ok) {
        const err = await signRes.json();
        throw new Error(err.error || 'Signature verification failed');
      }

      // 5. Passport SBT 민팅
      setStatus('minting');
      const mintRes = await fetch('/api/passport/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, walletAddress }),
      });

      if (mintRes.ok) {
        const mintData = await mintRes.json();
        setTxHash(mintData.txHash || null);
      }
      // 민팅 실패해도 서명은 완료 → success로 처리

      setStatus('success');
    } catch (err) {
      console.error('Sign error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }

  if (status === 'success') {
    const chain = process.env.NEXT_PUBLIC_CHAIN || 'base-sepolia';
    const explorerBase =
      chain === 'base' ? 'https://basescan.org' : 'https://sepolia.basescan.org';

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
        <div className="text-4xl">🕊️</div>
        <h1 className="text-lg font-bold text-wf-navy">
          {t('onboarding.sign.success')}
        </h1>
        {txHash && (
          <a
            href={`${explorerBase}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-wf-celadon hover:underline"
          >
            {t('passport.view_record')} ↗
          </a>
        )}
        <Link
          href="/my"
          className="rounded-full bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('onboarding.sign.next')} →
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <ErrorMessage
          onRetry={() => {
            setStatus('idle');
            setErrorMsg('');
          }}
        />
        {errorMsg && (
          <p className="max-w-sm text-center text-xs text-wf-text-faint">{errorMsg}</p>
        )}
      </div>
    );
  }

  const statusText = () => {
    if (status === 'signing') return t('onboarding.sign.signing');
    if (status === 'minting') return t('onboarding.sign.minting') || '여권을 발급하고 있습니다...';
    return t('onboarding.sign.button');
  };

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
          disabled={!agreed || status === 'signing' || status === 'minting'}
          className="mt-6 w-full rounded-[10px] bg-wf-navy px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {statusText()}
        </button>
      </div>
    </div>
  );
}

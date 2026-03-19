'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function MyPage() {
  const { entityId, displayName, loading, authenticated, login, logout } =
    useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-wf-text-faint">Loading...</p>
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
        <p className="text-sm text-wf-text-light">
          로그인하여 여권을 확인하세요.
        </p>
        <button
          onClick={login}
          className="rounded-[10px] bg-wf-navy px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          {t('common.login')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-14">
      <div className="text-4xl">📘</div>
      <h1 className="text-lg font-bold text-wf-navy">
        {t('common.my_passport')}
      </h1>

      {/* Auth 정보 (테스트용) */}
      <div className="w-full max-w-sm rounded-[10px] bg-wf-cream p-6 text-sm dark:bg-[#0F1F2E]">
        <div className="mb-3 flex justify-between">
          <span className="text-wf-text-faint">Status</span>
          <span className="font-medium text-green-600">Authenticated ✓</span>
        </div>
        {entityId && (
          <div className="mb-3 flex justify-between">
            <span className="text-wf-text-faint">Entity ID</span>
            <span className="font-mono text-xs text-wf-text-light">
              {entityId.slice(0, 8)}...
            </span>
          </div>
        )}
        {displayName && (
          <div className="mb-3 flex justify-between">
            <span className="text-wf-text-faint">Name</span>
            <span className="text-wf-text">{displayName}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-wf-text-faint">
        Phase 2에서 Passport 컴포넌트로 교체됩니다.
      </p>

      <button
        onClick={logout}
        className="rounded-[10px] border border-wf-border px-6 py-2 text-sm text-wf-text-light transition-colors hover:bg-wf-cream"
      >
        로그아웃
      </button>
    </div>
  );
}

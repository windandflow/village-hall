'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

interface ErrorMessageProps {
  onRetry?: () => void;
}

export function ErrorMessage({ onRetry }: ErrorMessageProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm text-wf-text-light">{t('common.error')}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-[10px] border border-wf-border px-6 py-2 text-sm text-wf-text-light transition-colors hover:bg-wf-cream"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/components/providers/LocaleProvider';

interface RequestModalProps {
  trigger?: React.ReactNode;
}

export function RequestModal({ trigger }: RequestModalProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [reason, setReason] = useState('');
  const [consent, setConsent] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('request.validation.name');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t('request.validation.email');
    if (!reason.trim()) errs.reason = t('request.validation.reason');
    if (!consent) errs.consent = t('request.validation.consent');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      // TODO: Phase 3에서 /api/invite-request 연결
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStatus('idle');
      setErrors({});
      setName('');
      setEmail('');
      setRegion('');
      setReason('');
      setConsent(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        {trigger ?? (
          <button className="rounded-full bg-wf-celadon px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80">
            {t('common.request_invite')}
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('request.title')}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {t('request.description')}
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="py-6 text-center">
            <div className="mb-3 text-3xl">🕊️</div>
            <h3 className="mb-2 font-semibold text-wf-navy">
              {t('request.success_title')}
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-wf-text-light">
              {t('request.success')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="req-name">{t('request.name')}</Label>
              <Input
                id="req-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('request.name_placeholder')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="req-email">{t('request.email')}</Label>
              <Input
                id="req-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('request.email_placeholder')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="req-region">{t('request.region')}</Label>
              <Input
                id="req-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t('request.region_placeholder')}
              />
            </div>

            <div>
              <Label htmlFor="req-reason">{t('request.reason')}</Label>
              <Textarea
                id="req-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('request.reason_placeholder')}
                rows={3}
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-red-500">{errors.reason}</p>
              )}
            </div>

            {/* 동의 체크박스 */}
            <div className="rounded-lg bg-wf-cream p-4 dark:bg-[#0F1F2E]">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-wf-celadon"
                />
                <span className="text-sm leading-relaxed text-wf-text">
                  {t('request.consent')}
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-xs text-red-500">{errors.consent}</p>
              )}
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-500">{t('request.error')}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-[10px] bg-wf-celadon px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              disabled={status === 'submitting'}
            >
              {status === 'submitting'
                ? t('request.submitting')
                : t('request.submit')}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

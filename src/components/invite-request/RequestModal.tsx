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
  const [reason, setReason] = useState('');

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('request.validation.name');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t('request.validation.email');
    if (!reason.trim()) errs.reason = t('request.validation.reason');
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
      // reset on close
      setStatus('idle');
      setErrors({});
      setName('');
      setEmail('');
      setReason('');
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
            <div className="mb-3 text-3xl">✅</div>
            <p className="text-sm text-wf-text-light">{t('request.success')}</p>
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
              <Label htmlFor="req-reason">{t('request.reason')}</Label>
              <Textarea
                id="req-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('request.reason_placeholder')}
                rows={4}
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-red-500">{errors.reason}</p>
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

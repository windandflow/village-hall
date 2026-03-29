'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';

interface Invitation {
  invitation_id: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  accepted_entity?: { display_name: string; slug?: string } | null;
}

export default function MyInvitePage() {
  const { entityId, authenticated, login, loading } = useAuth();
  const { t } = useLocale();
  const [copied, setCopied] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadInvitations = useCallback(() => {
    if (!entityId) return;
    fetch(`/api/invitation?entityId=${entityId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInvitations(data))
      .catch(() => setInvitations([]))
      .finally(() => setDataLoading(false));
  }, [entityId]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  if (loading || dataLoading) {
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

  const pendingCount = invitations.filter((i) => i.status === 'pending').length;

  function copyLink(code: string) {
    const url = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch('/api/invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, stateId: 'newmoon' }),
      });
      if (res.ok) {
        loadInvitations();
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  }

  const statusLabel = (s: Invitation['status']) => {
    if (s === 'pending') return t('invite.status_pending');
    if (s === 'accepted') return t('invite.status_accepted');
    return t('invite.status_expired');
  };

  const statusColor = (s: Invitation['status']) => {
    if (s === 'accepted') return 'text-wf-celadon';
    if (s === 'expired' || s === 'declined') return 'text-wf-text-faint';
    return 'text-wf-gold';
  };

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-14">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-wf-navy">{t('invite.title')}</h1>
          <span className="text-sm text-wf-text-faint">
            {t('invite.status_pending')}: <strong className="text-wf-navy">{pendingCount}</strong>
          </span>
        </div>

        {/* 새 초대장 버튼 */}
        <button
          className="mb-6 w-full rounded-[10px] bg-wf-celadon px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          disabled={creating}
          onClick={handleCreate}
        >
          {creating ? '...' : `+ ${t('invite.create')}`}
        </button>

        {/* 초대 목록 */}
        {invitations.length === 0 ? (
          <p className="text-center text-sm text-wf-text-faint">{t('invite.no_invites')}</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv.invitation_id}
                className="rounded-[10px] bg-wf-cream p-4 dark:bg-[#0F1F2E]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    {inv.accepted_entity?.display_name && (
                      <p className="text-sm font-medium text-wf-navy">
                        {inv.accepted_entity.display_name} {t('passport.nim')}
                      </p>
                    )}
                    <p className="text-[11px] text-wf-text-faint">
                      {new Date(inv.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${statusColor(inv.status)}`}>
                    {statusLabel(inv.status)}
                  </span>
                </div>
                {inv.status === 'pending' && (
                  <button
                    onClick={() => copyLink(inv.invite_code)}
                    className="mt-3 w-full rounded-lg border border-wf-border py-2 text-xs text-wf-text-light transition-colors hover:bg-wf-warm"
                  >
                    {copied === inv.invite_code ? t('invite.copied') : t('invite.copy')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Link
          href="/my"
          className="mt-6 block text-center text-sm text-wf-text-faint hover:text-wf-text-light"
        >
          ← {t('common.my_passport')}
        </Link>
      </div>
    </div>
  );
}

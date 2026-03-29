'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { VisaLevel } from '@/components/visa/VisaLevel';
import { ErrorMessage } from '@/components/ui/error-message';

type AdminTab = 'dashboard' | 'members' | 'content' | 'requests' | 'reports';

const TABS: { key: AdminTab; labelKey: string }[] = [
  { key: 'dashboard', labelKey: 'admin.dashboard' },
  { key: 'members', labelKey: 'admin.members' },
  { key: 'content', labelKey: 'admin.content' },
  { key: 'requests', labelKey: 'admin.requests' },
  { key: 'reports', labelKey: 'admin.reports' },
];

interface Stats {
  totalMembers: number;
  totalVisas: number;
  pendingRequests: number;
  totalPosts: number;
}

interface Member {
  entityId: string;
  displayName: string;
  slug: string | null;
  level: number;
  joinedAt: string;
}

interface InviteRequest {
  request_id: string;
  name: string;
  email: string;
  reason: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const { entityId, authenticated, login, loading } = useAuth();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<InviteRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  const loadData = useCallback(() => {
    if (!authenticated) return;
    setDataLoading(true);
    setDataError(false);
    Promise.all([
      fetch('/api/admin/stats?stateId=newmoon').then((r) => r.json()),
      fetch('/api/admin/members?stateId=newmoon').then((r) => r.json()),
      fetch('/api/admin/invite-requests').then((r) => r.json()),
    ])
      .then(([s, m, r]) => {
        setStats(s);
        setMembers(Array.isArray(m) ? m : []);
        setRequests(Array.isArray(r) ? r : []);
      })
      .catch(() => setDataError(true))
      .finally(() => setDataLoading(false));
  }, [authenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleRequestAction(requestId: string, status: 'approved' | 'rejected') {
    try {
      const res = await fetch('/api/admin/invite-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, reviewedBy: entityId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // silent
    }
  }

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
        <p className="text-sm text-wf-text-light">{t('admin.unauthorized')}</p>
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
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-lg font-bold text-wf-navy">{t('admin.title')}</h1>

        {/* 탭 */}
        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-wf-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-wf-navy text-wf-navy'
                  : 'text-wf-text-faint hover:text-wf-text-light'
              }`}
            >
              {t(tab.labelKey as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-wf-navy border-t-transparent" />
          </div>
        ) : dataError ? (
          <ErrorMessage onRetry={loadData} />
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { labelKey: 'admin.total_members', value: stats.totalMembers },
                  { labelKey: 'admin.total_visas', value: stats.totalVisas },
                  { labelKey: 'admin.pending_requests', value: stats.pendingRequests },
                  { labelKey: 'admin.total_events', value: stats.totalPosts },
                ].map((stat) => (
                  <div
                    key={stat.labelKey}
                    className="rounded-[10px] bg-wf-cream p-5 dark:bg-[#0F1F2E]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-wf-text-faint">
                      {t(stat.labelKey as Parameters<typeof t>[0])}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-wf-navy">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Members */}
            {activeTab === 'members' && (
              <div className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-center text-sm text-wf-text-faint">멤버가 없습니다.</p>
                ) : (
                  members.map((m) => (
                    <div
                      key={m.entityId}
                      className="flex items-center justify-between rounded-[10px] bg-wf-cream p-4 dark:bg-[#0F1F2E]"
                    >
                      <div>
                        <span className="font-medium text-wf-navy">{m.displayName} {t('passport.nim')}</span>
                        <p className="text-xs text-wf-text-faint">
                          {m.slug ? `@${m.slug}` : ''} · {new Date(m.joinedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <VisaLevel level={m.level} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Content */}
            {activeTab === 'content' && (
              <div className="rounded-[10px] bg-wf-cream p-6 text-center dark:bg-[#0F1F2E]">
                <p className="text-sm text-wf-text-faint">콘텐츠 관리 (Phase 4+)</p>
              </div>
            )}

            {/* Requests */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                {requests.length === 0 ? (
                  <p className="text-sm text-wf-text-faint">{t('admin.no_requests')}</p>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.request_id}
                      className="rounded-[10px] bg-wf-cream p-5 dark:bg-[#0F1F2E]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-wf-navy">{req.name}</p>
                          <p className="text-xs text-wf-text-faint">
                            {req.email} · {new Date(req.created_at).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestAction(req.request_id, 'approved')}
                            disabled={req.status !== 'pending'}
                            className="rounded-lg bg-wf-celadon px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                          >
                            {req.status === 'approved' ? '✓' : t('admin.approve')}
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.request_id, 'rejected')}
                            disabled={req.status !== 'pending'}
                            className="rounded-lg border border-wf-border px-3 py-1.5 text-xs text-wf-text-faint transition-colors hover:bg-wf-warm disabled:opacity-40"
                          >
                            {req.status === 'rejected' ? '✕' : t('admin.reject')}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-wf-text-light">{req.reason}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Reports */}
            {activeTab === 'reports' && (
              <div className="rounded-[10px] bg-wf-cream p-6 text-center dark:bg-[#0F1F2E]">
                <p className="mb-4 text-sm text-wf-text-light">소도 운영 보고서를 생성합니다.</p>
                <button className="rounded-[10px] bg-wf-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80">
                  {t('admin.generate_report')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

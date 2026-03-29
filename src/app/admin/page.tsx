'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/components/providers/LocaleProvider';
import { VisaLevel } from '@/components/visa/VisaLevel';

type AdminTab = 'dashboard' | 'members' | 'content' | 'requests' | 'reports';

const TABS: { key: AdminTab; labelKey: string }[] = [
  { key: 'dashboard', labelKey: 'admin.dashboard' },
  { key: 'members', labelKey: 'admin.members' },
  { key: 'content', labelKey: 'admin.content' },
  { key: 'requests', labelKey: 'admin.requests' },
  { key: 'reports', labelKey: 'admin.reports' },
];

// 더미 통계
const MOCK_STATS = { members: 23, visas: 18, pendingRequests: 3, events: 5 };

const MOCK_REQUESTS = [
  { id: '1', name: '김민수', email: 'minsu@example.com', reason: '인제 지역 활동에 관심이 있습니다.', createdAt: '2026-03-27' },
  { id: '2', name: '이서연', email: 'seoyeon@example.com', reason: '풍류도 철학에 공감합니다.', createdAt: '2026-03-28' },
  { id: '3', name: '박지호', email: 'jiho@example.com', reason: '달뜨는마을 방문 후 참여하고 싶습니다.', createdAt: '2026-03-29' },
];

const MOCK_MEMBERS = [
  { entityId: 'a1b2c3d4-0001', displayName: '범선', slug: 'bumsun', level: 4, email: 'bumsun@pungryu.kr' },
  { entityId: 'a1b2c3d4-0002', displayName: '한석', slug: 'hahnryu', level: 3, email: 'hahn@nodeone.io' },
  { entityId: 'a1b2c3d4-0003', displayName: '지연', slug: 'jiyeon', level: 2, email: 'jiyeon@example.com' },
];

export default function AdminPage() {
  const { authenticated, login, loading } = useAuth();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

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

  // TODO: 실제 L3+ 권한 체크

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

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { labelKey: 'admin.total_members', value: MOCK_STATS.members },
              { labelKey: 'admin.total_visas', value: MOCK_STATS.visas },
              { labelKey: 'admin.pending_requests', value: MOCK_STATS.pendingRequests },
              { labelKey: 'admin.total_events', value: MOCK_STATS.events },
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
            {MOCK_MEMBERS.map((m) => (
              <div
                key={m.entityId}
                className="flex items-center justify-between rounded-[10px] bg-wf-cream p-4 dark:bg-[#0F1F2E]"
              >
                <div>
                  <span className="font-medium text-wf-navy">{m.displayName} {t('passport.nim')}</span>
                  <p className="text-xs text-wf-text-faint">@{m.slug} · {m.email}</p>
                </div>
                <VisaLevel level={m.level} />
              </div>
            ))}
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
            {MOCK_REQUESTS.length === 0 ? (
              <p className="text-sm text-wf-text-faint">{t('admin.no_requests')}</p>
            ) : (
              MOCK_REQUESTS.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[10px] bg-wf-cream p-5 dark:bg-[#0F1F2E]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-wf-navy">{req.name}</p>
                      <p className="text-xs text-wf-text-faint">{req.email} · {req.createdAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-wf-celadon px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80">
                        {t('admin.approve')}
                      </button>
                      <button className="rounded-lg border border-wf-border px-3 py-1.5 text-xs text-wf-text-faint transition-colors hover:bg-wf-warm">
                        {t('admin.reject')}
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
      </div>
    </div>
  );
}

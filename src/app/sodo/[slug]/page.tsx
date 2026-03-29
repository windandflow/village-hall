'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';
import { RequestModal } from '@/components/invite-request/RequestModal';
import { getAvatarGradient, getAvatarInitial } from '@/lib/utils/avatar';
import { VisaLevel } from '@/components/visa/VisaLevel';

const TAB_KEYS = ['about', 'events', 'invite', 'members'] as const;

// 더미 데이터
const SODO_DATA: Record<string, {
  name: string;
  location: string;
  emoji: string;
  description: string;
  members: Array<{ entityId: string; displayName: string; slug: string; level: number }>;
  events: Array<{ title: string; date: string; location: string }>;
}> = {
  newmoon: {
    name: '달뜨는마을',
    location: '강원 인제군 · 신월리',
    emoji: '🌙',
    description: '인제 신월리에 위치한 W&F의 첫 번째 소도. 23명의 구성원이 자연과 함께 새로운 관계를 실험하고 있습니다.\n\n모심 · 살림 · 어울림의 원칙 위에, 디지털과 로컬이 만나는 공동체.',
    members: [
      { entityId: 'a1b2c3d4-0001', displayName: '범선', slug: 'bumsun', level: 4 },
      { entityId: 'a1b2c3d4-0002', displayName: '한석', slug: 'hahnryu', level: 3 },
      { entityId: 'a1b2c3d4-0003', displayName: '지연', slug: 'jiyeon', level: 2 },
      { entityId: 'a1b2c3d4-0004', displayName: '희문', slug: 'heemun', level: 1 },
      { entityId: 'a1b2c3d4-0005', displayName: '도훈', slug: 'dohun', level: 1 },
      { entityId: 'a1b2c3d4-0006', displayName: '카야', slug: 'kaya', level: 1 },
    ],
    events: [
      { title: '🌸 봄맞이 김치 워크숍', date: '2026-03-22', location: '폐교' },
    ],
  },
};

export default function SodoDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<typeof TAB_KEYS[number]>('about');

  const sodo = SODO_DATA[slug];

  if (!sodo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="text-4xl">🔍</div>
        <p className="text-sm text-wf-text-light">{t('nim.profile_not_found')}</p>
      </div>
    );
  }

  const tabLabels: Record<typeof TAB_KEYS[number], string> = {
    about: t('sodo.about'),
    events: t('sodo.events'),
    invite: t('sodo.invite'),
    members: t('sodo.members'),
  };

  return (
    <div className="flex flex-1 flex-col px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-wf-cream text-2xl dark:bg-[#0F1F2E]">
            {sodo.emoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-wf-navy">{sodo.name}</h1>
            <p className="text-xs uppercase tracking-wider text-wf-text-faint">{sodo.location}</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="mb-6 flex gap-1 border-b border-wf-border">
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'border-b-2 border-wf-navy text-wf-navy'
                  : 'text-wf-text-faint hover:text-wf-text-light'
              }`}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'about' && (
          <div className="rounded-[10px] bg-wf-cream p-6 dark:bg-[#0F1F2E]">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-wf-text-light">
              {sodo.description}
            </p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {sodo.events.length === 0 ? (
              <p className="text-sm text-wf-text-faint">{t('sodo.no_events')}</p>
            ) : (
              sodo.events.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 rounded-[10px] bg-wf-cream p-5 dark:bg-[#0F1F2E]"
                >
                  <div className="flex-shrink-0 text-center" style={{ minWidth: 36 }}>
                    <div className="text-lg font-bold text-wf-navy">
                      {event.date.split('-')[2]}
                    </div>
                    <div className="text-[10px] text-wf-text-faint">
                      {event.date.split('-')[1]}월
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-wf-navy">{event.title}</div>
                    <div className="text-xs text-wf-text-light">{sodo.name} · {event.location}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'invite' && (
          <div className="flex flex-col items-center gap-4 rounded-[10px] bg-wf-cream p-8 text-center dark:bg-[#0F1F2E]">
            <p className="text-sm text-wf-text-light">
              {sodo.name}에 참여하고 싶으신가요?
            </p>
            <RequestModal
              trigger={
                <button className="rounded-[10px] bg-wf-celadon px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80">
                  {t('common.request_invite_long')}
                </button>
              }
            />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="grid gap-3 md:grid-cols-2">
            {sodo.members.map((member) => {
              const [from, to] = getAvatarGradient(member.entityId);
              return (
                <Link
                  key={member.entityId}
                  href={`/nim/${member.slug}`}
                  className="flex items-center gap-3 rounded-[10px] bg-wf-cream p-4 transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] dark:bg-[#0F1F2E]"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  >
                    {getAvatarInitial(member.displayName)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-wf-navy">
                      {member.displayName} {t('passport.nim')}
                    </span>
                    <p className="text-[11px] text-wf-text-faint">@{member.slug}</p>
                  </div>
                  <VisaLevel level={member.level} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

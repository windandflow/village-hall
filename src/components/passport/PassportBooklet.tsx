'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getAvatarGradient, getAvatarInitial } from '@/lib/utils/avatar';
import { VisaStamp } from '@/components/visa/VisaStamp';
import type { MessageKey } from '@/i18n';

interface PassportData {
  entityId: string;
  displayName: string;
  slug?: string;
  bio?: string;
  passportNumber?: number;
  issuedAt?: string;
  visas?: Array<{
    stateId: string;
    stateName: string;
    level: number;
    levelLabel: string;
    joinedAt: string;
  }>;
  links?: Array<{ label: string; url: string }>;
  bonds?: Array<{
    entityId: string;
    displayName: string;
    slug?: string;
  }>;
}

interface PassportBookletProps {
  data: PassportData;
  className?: string;
}

const PAGE_LABELS = ['ID', 'About', 'Visa', 'Links', '1촌'] as const;

/**
 * Passport 책자 (5페이지)
 * Page 1: 신원  Page 2: About  Page 3: Visa Stamps  Page 4: Links  Page 5: 1촌
 */
export function PassportBooklet({ data, className }: PassportBookletProps) {
  const [activePage, setActivePage] = useState(0);
  const { t } = useLocale();
  const [from, to] = getAvatarGradient(data.entityId);
  const initial = getAvatarInitial(data.displayName);

  return (
    <div className={cn('mx-auto w-full max-w-[360px] md:max-w-[400px]', className)}>
      {/* 탭 네비 */}
      <div className="mb-3 flex gap-1">
        {PAGE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActivePage(i)}
            className={cn(
              'flex-1 rounded-t-lg py-2 text-[10px] font-medium tracking-wide transition-colors',
              activePage === i
                ? 'bg-wf-cream text-wf-navy dark:bg-[#0F1F2E]'
                : 'text-wf-text-faint hover:text-wf-text-light',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 페이지 콘텐츠 */}
      <div className="min-h-[400px] rounded-[10px] bg-wf-cream p-6 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] dark:bg-[#0F1F2E]">
        {activePage === 0 && (
          <PageIdentity data={data} initial={initial} from={from} to={to} t={t} />
        )}
        {activePage === 1 && <PageAbout bio={data.bio} t={t} />}
        {activePage === 2 && <PageVisa visas={data.visas} t={t} />}
        {activePage === 3 && <PageLinks links={data.links} t={t} />}
        {activePage === 4 && <PageBonds bonds={data.bonds} t={t} />}
      </div>
    </div>
  );
}

/* ─── Page 1: 신원 ─── */
function PageIdentity({
  data,
  initial,
  from,
  to,
  t,
}: {
  data: PassportData;
  initial: string;
  from: string;
  to: string;
  t: (key: MessageKey) => string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* 아바타 */}
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {initial}
      </div>

      {/* 이름 님 */}
      <h2 className="text-lg font-bold text-wf-navy">
        {data.displayName} {t('passport.nim')}
      </h2>

      {/* 핸들 */}
      {data.slug && (
        <p className="text-sm text-wf-text-light">@{data.slug}</p>
      )}

      {/* 메타 */}
      <div className="mt-4 w-full space-y-3 border-t border-wf-border pt-4">
        {data.passportNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-wf-text-faint">{t('passport.number')}</span>
            <span className="font-mono text-wf-text">#{String(data.passportNumber).padStart(4, '0')}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-wf-text-faint">{t('passport.issued')}</span>
          <span className="text-wf-text">{data.issuedAt ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-wf-text-faint">{t('passport.expires')}</span>
          <span className="text-wf-text">∞</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Page 2: About ─── */
function PageAbout({ bio, t }: { bio?: string; t: (key: MessageKey) => string }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-wf-gold">
        About
      </h3>
      {bio ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-wf-text-light">
          {bio}
        </p>
      ) : (
        <p className="text-sm text-wf-text-faint">{t('passport.no_bio')}</p>
      )}
    </div>
  );
}

/* ─── Page 3: Visa Stamps ─── */
function PageVisa({
  visas,
  t,
}: {
  visas?: PassportData['visas'];
  t: (key: MessageKey) => string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-wf-gold">
        Visa Stamps
      </h3>
      {!visas || visas.length === 0 ? (
        <p className="text-sm text-wf-text-faint">{t('passport.no_visa')}</p>
      ) : (
        <div className="space-y-4">
          {visas.map((v) => (
            <VisaStamp
              key={v.stateId}
              stateName={v.stateName}
              level={v.level}
              levelLabel={v.levelLabel}
              joinedAt={v.joinedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page 4: Links ─── */
function PageLinks({
  links,
  t,
}: {
  links?: PassportData['links'];
  t: (key: MessageKey) => string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-wf-gold">
        Links
      </h3>
      {!links || links.length === 0 ? (
        <p className="text-sm text-wf-text-faint">{t('passport.no_links')}</p>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-wf-warm p-3 text-sm transition-colors hover:bg-wf-border dark:bg-[#0A1628]"
            >
              <span className="text-wf-text">{link.label}</span>
              <span className="text-wf-text-faint">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page 5: 1촌 ─── */
function PageBonds({
  bonds,
  t,
}: {
  bonds?: PassportData['bonds'];
  t: (key: MessageKey) => string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-wf-gold">
        {t('passport.bonds_title')}
      </h3>
      {!bonds || bonds.length === 0 ? (
        <p className="text-sm text-wf-text-faint">{t('passport.no_bonds')}</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {bonds.map((bond) => {
            const [bFrom, bTo] = getAvatarGradient(bond.entityId);
            return (
              <div key={bond.entityId} className="flex flex-col items-center gap-1">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${bFrom}, ${bTo})` }}
                >
                  {getAvatarInitial(bond.displayName)}
                </div>
                <span className="text-[11px] text-wf-text">
                  {bond.displayName} {t('passport.nim')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';

interface VisaStampProps {
  stateName: string;
  level: number;
  levelLabel: string;
  joinedAt: string;
}

/**
 * Visa 카드 — 카도 디자인 적용
 * 레벨별 이미지: L0 미니멀, L1 연두 그라데이션, L3 옐로우~블루
 */

const VISA_IMAGES: Record<number, string> = {
  0: '/img/visa_lv0.png',
  1: '/img/visa_lv1_3.png',
  2: '/img/visa_lv1_2.png',
  3: '/img/visa_lv3.png',
  4: '/img/visa_lv3.png', // L4도 L3 이미지 사용 (별도 시안 없음)
};

export function VisaStamp({ stateName, level, levelLabel, joinedAt }: VisaStampProps) {
  const imgSrc = VISA_IMAGES[level] || VISA_IMAGES[0];

  return (
    <div className="relative overflow-hidden rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <Image
        src={imgSrc}
        alt={`${stateName} Visa - Level ${level}`}
        width={600}
        height={380}
        className="block w-full"
      />
      {/* 오버레이 정보 */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <div />
          <div className="text-right">
            <p className="text-sm font-semibold text-wf-text">Visa</p>
            <p className="text-base font-bold text-wf-text">{stateName}</p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-[11px] text-wf-text-light">
            {joinedAt}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-wf-text-light">
              Level {level} · {levelLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

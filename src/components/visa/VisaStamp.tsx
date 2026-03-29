'use client';

import { VisaLevel } from './VisaLevel';

interface VisaStampProps {
  stateName: string;
  level: number;
  joinedAt: string;
}

/**
 * Passport 내부 Visa Stamps 페이지에서 사용하는 개별 스탬프 카드
 */
export function VisaStamp({ stateName, level, joinedAt }: VisaStampProps) {
  return (
    <div className="rounded-lg bg-wf-warm p-4 dark:bg-[#0A1628]">
      <div className="flex items-center justify-between">
        <span className="font-medium text-wf-navy">{stateName}</span>
        <VisaLevel level={level} />
      </div>
      <p className="mt-1 text-[11px] text-wf-text-faint">{joinedAt}</p>
    </div>
  );
}

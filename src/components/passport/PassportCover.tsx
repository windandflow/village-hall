'use client';

import { cn } from '@/lib/utils';

interface PassportCoverProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Passport 커버 (닫힌 상태)
 * 개인 이름 없음. 로고 + 심볼 + PASSPORT만.
 */
export function PassportCover({ onClick, className }: PassportCoverProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative mx-auto flex aspect-[3/4] w-full max-w-[280px] flex-col items-center justify-center',
        'rounded-r-lg rounded-l-sm',
        'bg-gradient-to-br from-wf-navy to-[#0F2440]',
        'shadow-[4px_4px_20px_rgba(0,0,0,0.15),-2px_0_8px_rgba(0,0,0,0.05)]',
        'transition-transform duration-300 hover:scale-[1.02]',
        'cursor-pointer select-none',
        className,
      )}
    >
      {/* 책등 */}
      <div className="absolute top-0 bottom-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-[#0F2440] to-transparent" />

      <div className="flex flex-col items-center gap-6 px-8">
        {/* 4잎 심볼 */}
        <svg viewBox="0 0 48 48" className="h-14 w-14">
          <g fill="none" stroke="#C4A265" strokeWidth="1">
            <ellipse cx="24" cy="16" rx="6" ry="10" opacity="0.8" />
            <ellipse cx="24" cy="32" rx="6" ry="10" opacity="0.8" />
            <ellipse cx="16" cy="24" rx="10" ry="6" opacity="0.8" />
            <ellipse cx="32" cy="24" rx="10" ry="6" opacity="0.8" />
            <circle cx="24" cy="24" r="3" fill="#C4A265" opacity="0.6" />
          </g>
        </svg>

        {/* 로고 */}
        <p className="text-[11px] font-light tracking-[0.3em] text-wf-gold/80">
          wind &amp; flow
        </p>

        {/* PASSPORT */}
        <p className="text-[10px] font-bold tracking-[0.4em] text-white/60">
          PASSPORT
        </p>
      </div>

      {/* 탭 힌트 */}
      <p className="absolute bottom-6 text-[9px] tracking-wider text-white/20 transition-colors group-hover:text-white/40">
        tap to open
      </p>
    </button>
  );
}

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PassportCoverProps {
  onClick?: () => void;
  className?: string;
  variant?: 'gray' | 'celadon';
}

/**
 * Passport 커버 (닫힌 상태)
 * 카도 디자인 적용: 큰 4잎 심볼 엠보싱, wind & flow, PASSPORT
 * gray = 기본, celadon = 프리미엄 (Phase 2)
 */
export function PassportCover({ onClick, className, variant = 'gray' }: PassportCoverProps) {
  const src = variant === 'celadon' ? '/img/passport-celadon.jpg' : '/img/passport-gray.jpg';

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative mx-auto block w-full max-w-[280px] overflow-hidden',
        'rounded-r-lg rounded-l-sm',
        'shadow-[4px_4px_20px_rgba(0,0,0,0.15),-2px_0_8px_rgba(0,0,0,0.05)]',
        'transition-transform duration-300 hover:scale-[1.02]',
        'cursor-pointer select-none',
        className,
      )}
    >
      <Image
        src={src}
        alt="Wind & Flow Passport"
        width={560}
        height={747}
        className="block w-full"
        priority
      />

      {/* 책등 */}
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/10 to-transparent" />

      {/* 탭 힌트 */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-[9px] tracking-wider text-white/30 transition-colors group-hover:text-white/60">
        tap to open
      </p>
    </button>
  );
}

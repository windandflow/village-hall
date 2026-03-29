'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/components/providers/LocaleProvider';

const LEVEL_CONFIG = [
  { key: 'visa.l0' as const, color: 'bg-wf-text-faint/10 text-wf-text-faint' },
  { key: 'visa.l1' as const, color: 'bg-wf-celadon/10 text-wf-celadon' },
  { key: 'visa.l2' as const, color: 'bg-wf-celadon/20 text-wf-celadon' },
  { key: 'visa.l3' as const, color: 'bg-wf-gold/15 text-wf-gold' },
  { key: 'visa.l4' as const, color: 'bg-wf-navy/10 text-wf-navy' },
];

interface VisaLevelProps {
  level: number;
  className?: string;
}

export function VisaLevel({ level, className }: VisaLevelProps) {
  const { t } = useLocale();
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[0];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
        config.color,
        className,
      )}
    >
      L{level} {t(config.key)}
    </span>
  );
}

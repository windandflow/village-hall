'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-wf-navy px-6 py-14 text-wf-warm dark:bg-[#060E1A] dark:text-white">
      <div className="mx-auto max-w-5xl">
        {/* Links grid */}
        <div className="mb-10">
          <div className="mb-6 text-sm font-bold italic text-wf-gold">
            {t('footer.brand')}
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                {t('footer.network')}
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60 dark:text-white/50">
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    {t('footer.manifesto')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    {t('footer.protocol')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    {t('footer.wfos')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                {t('footer.community')}
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60 dark:text-white/50">
                <li>
                  <Link href="/events" className="transition-colors hover:text-wf-celadon">
                    {t('footer.events')}
                  </Link>
                </li>
                <li>
                  <Link href="/nim" className="transition-colors hover:text-wf-celadon">
                    {t('footer.members')}
                  </Link>
                </li>
                <li>
                  <Link href="/sodo" className="transition-colors hover:text-wf-celadon">
                    {t('footer.sodo')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                {t('footer.projects')}
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60 dark:text-white/50">
                <li>
                  <Link
                    href="/sodo/newmoon"
                    className="transition-colors hover:text-wf-celadon"
                  >
                    {t('footer.newmoon')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                {t('footer.opensource')}
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60 dark:text-white/50">
                <li>
                  <a
                    href="https://github.com/windandflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-wf-celadon"
                  >
                    {t('footer.github')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-3 border-t border-white/5 pt-6">
          <p className="text-center text-xs italic text-wf-warm/30 dark:text-white/25">
            {t('footer.quote')}
          </p>
          <div className="flex gap-4 text-[10px] text-wf-warm/40 dark:text-white/30">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
          </div>
          <p className="text-[10px] tracking-wider text-wf-warm/30 dark:text-white/25">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

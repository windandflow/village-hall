'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col">
      {/* Manifesto */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('about.manifesto.label')}
          </span>
          <div className="mt-6 rounded-[10px] bg-wf-cream p-8 md:p-12 dark:bg-[#0F1F2E]">
            <h1 className="mb-6 text-xl font-bold leading-snug text-wf-navy md:text-2xl">
              {t('about.manifesto.title')}
            </h1>
            <div className="space-y-4 text-sm leading-relaxed text-wf-text-light">
              <p>{t('about.manifesto.p1')}</p>
              <p>{t('about.manifesto.p2')}</p>
              <p>{t('about.manifesto.p3')}</p>
              <p className="font-semibold text-wf-navy">
                {t('about.manifesto.p4')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Protocol */}
      <section className="bg-wf-cream px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('about.protocol.label')}
          </span>
          <div className="mt-6 rounded-[10px] bg-wf-warm p-8 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] md:p-12">
            <p className="text-sm leading-relaxed text-wf-text-light">
              {t('about.protocol.description')}
            </p>
            <p className="mt-4 text-xs text-wf-text-faint">
              {t('about.protocol.detail')}
            </p>
          </div>
        </div>
      </section>

      {/* W&F OS */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('about.wfos.label')}
          </span>
          <div className="mt-6 rounded-[10px] bg-wf-cream p-8 md:p-12 dark:bg-[#0F1F2E]">
            <p className="text-sm leading-relaxed text-wf-text-light">
              {t('about.wfos.description')}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: '🪪', name: 'Identity' },
                { icon: '📘', name: 'Membership' },
                { icon: '🤝', name: 'Relationship' },
                { icon: '📋', name: 'Activity' },
                { icon: '💰', name: 'Economy' },
                { icon: '🏛', name: 'Governance' },
                { icon: '⚓', name: 'Anchor' },
              ].map((domain) => (
                <div
                  key={domain.name}
                  className="rounded-lg bg-wf-warm p-3 text-center dark:bg-[#0A1628]"
                >
                  <div className="text-lg">{domain.icon}</div>
                  <div className="mt-1 text-[10px] font-medium text-wf-navy">
                    {domain.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-wf-text-faint">
              {t('about.wfos.detail')}
            </p>
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section className="bg-wf-cream px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('about.contribute.label')}
          </span>
          <div className="mt-6 rounded-[10px] bg-wf-warm p-8 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] md:p-12">
            <p className="text-sm leading-relaxed text-wf-text-light">
              {t('about.contribute.description')}
            </p>
            <a
              href="https://github.com/windandflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-wf-celadon hover:underline"
            >
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/sodo/newmoon"
            className="inline-block w-full rounded-[10px] bg-wf-celadon px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-80"
          >
            {t('about.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}

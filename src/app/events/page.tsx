'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

const UPCOMING_EVENTS = [
  {
    day: '22',
    month: 'MAR',
    title: '🌸 봄맞이 김치 워크숍',
    titleEn: '🌸 Spring Kimchi Workshop',
    location: '달뜨는마을 · 폐교',
    locationEn: 'New Moon Village · Old School',
  },
];

const PAST_EVENTS = [
  {
    day: '01',
    month: 'MAR',
    title: '유먼 페스티벌',
    titleEn: 'Yuman Festival',
    location: '달뜨는마을',
    locationEn: 'New Moon Village',
  },
];

export default function EventsPage() {
  const { locale, t } = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="flex flex-col">
      {/* Upcoming */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('events.upcoming')}
          </span>
          <div className="mt-6 space-y-3">
            {UPCOMING_EVENTS.length === 0 ? (
              <p className="text-sm text-wf-text-faint">
                {t('events.no_upcoming')}
              </p>
            ) : (
              UPCOMING_EVENTS.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 rounded-[10px] bg-wf-cream p-5 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] dark:bg-[#0F1F2E]"
                >
                  <div className="flex-shrink-0 text-center" style={{ minWidth: 36 }}>
                    <div className="text-lg font-bold text-wf-navy">
                      {event.day}
                    </div>
                    <div className="text-[10px] text-wf-text-faint">
                      {event.month}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-wf-navy">
                      {isEn ? event.titleEn : event.title}
                    </div>
                    <div className="text-xs text-wf-text-light">
                      {isEn ? event.locationEn : event.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Past */}
      <section className="bg-wf-cream px-4 py-14 md:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
            {t('events.past')}
          </span>
          <div className="mt-6 space-y-3">
            {PAST_EVENTS.length === 0 ? (
              <p className="text-sm text-wf-text-faint">
                {t('events.no_past')}
              </p>
            ) : (
              PAST_EVENTS.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 rounded-[10px] bg-wf-warm p-5 opacity-50"
                >
                  <div className="flex-shrink-0 text-center" style={{ minWidth: 36 }}>
                    <div className="text-lg font-bold text-wf-text-light">
                      {event.day}
                    </div>
                    <div className="text-[10px] text-wf-text-faint">
                      {event.month}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-wf-text-light">
                      {isEn ? event.titleEn : event.title}
                    </div>
                    <div className="text-xs text-wf-text-faint">
                      {isEn ? event.locationEn : event.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

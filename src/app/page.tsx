import Link from 'next/link';

const FEATURED_NIMS = [
  { name: '범선', handle: '@bumsun', initial: '범', gradient: 'from-[#8BBFBC] to-[#6BA3A0]' },
  { name: '한석', handle: '@hahnryu', initial: '한', gradient: 'from-[#C4A265] to-[#D4B275]' },
  { name: '지연', handle: '@jiyeon', initial: '지', gradient: 'from-[#7AA3C4] to-[#8AB3D4]' },
  { name: '희문', handle: '@heemun', initial: '희', gradient: 'from-[#A4C47A] to-[#B4D48A]' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — Navy gradient */}
      <section className="bg-gradient-to-br from-wf-navy to-[#2A5A7A] px-6 py-20 text-center text-white md:py-28">
        <h1 className="text-3xl font-light tracking-[0.15em] md:text-5xl">
          WIND &amp; FLOW
        </h1>
        <p className="mt-2 text-sm tracking-widest text-white/50">
          바람과 흐름의 길
        </p>
        <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-white/80 md:max-w-md md:text-base">
          새로운 시대를 여는 디지털 소도(蘇塗) 네트워크.
          <br />
          우리는 더 자유롭고 고요한 연결을 꿈꿉니다.
        </p>
        <p className="mt-3 text-xs text-white/40">모심 · 살림 · 어울림</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/about"
            className="rounded-[10px] border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            매니페스토
          </Link>
          <Link
            href="/sodo/newmoon"
            className="rounded-[10px] bg-wf-celadon px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            초대 신청하기
          </Link>
        </div>
      </section>

      {/* 소도 네트워크 */}
      <section className="bg-wf-cream px-4 py-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between px-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wf-gold">
                The Network
              </span>
              <h2 className="mt-1 text-xl font-bold text-wf-navy md:text-2xl">
                소도 네트워크
              </h2>
            </div>
            <Link
              href="/sodo"
              className="text-xs font-medium text-wf-celadon hover:underline"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 달뜨는마을 — Active */}
            <Link
              href="/sodo/newmoon"
              className="group rounded-[10px] bg-wf-warm p-6 shadow-[0_10px_30px_-10px_rgba(27,58,92,0.08)] transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(27,58,92,0.14)]"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-cream text-xl">
                    🌙
                  </div>
                  <div>
                    <h3 className="font-bold text-wf-navy">달뜨는마을</h3>
                    <p className="text-[10px] uppercase tracking-wider text-wf-text-faint">
                      강원 인제군 · 신월리
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-wf-celadon/10 px-2 py-1 text-[10px] font-bold text-wf-celadon">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-wf-navy/5 pt-4">
                <div className="text-center">
                  <p className="text-[10px] text-wf-text-faint">구성원</p>
                  <p className="font-bold text-wf-navy">23</p>
                </div>
                <div className="border-x border-wf-navy/5 text-center">
                  <p className="text-[10px] text-wf-text-faint">주민</p>
                  <p className="font-bold text-wf-navy">18</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-wf-text-faint">원주민</p>
                  <p className="font-bold text-wf-navy">3</p>
                </div>
              </div>
            </Link>

            {/* 하회마을 — Coming Soon */}
            <div className="flex cursor-default items-center gap-4 rounded-[10px] bg-wf-warm/60 p-6 opacity-40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wf-border text-xl">
                🏛
              </div>
              <div>
                <h3 className="font-bold text-wf-navy">하회마을</h3>
                <p className="text-[10px] text-wf-text-faint">안동 · 2027</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NIMs */}
      <section className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-lg font-bold tracking-tight text-wf-navy">
              FEATURED NIMS
            </h2>
            <Link
              href="/nim"
              className="text-xs font-medium text-wf-celadon hover:underline"
            >
              전체 →
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {FEATURED_NIMS.map((nim) => (
              <Link
                key={nim.handle}
                href={`/nim/${nim.handle.slice(1)}`}
                className="flex flex-shrink-0 flex-col items-center"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${nim.gradient} mb-2 border-2 border-white text-lg font-bold text-white shadow-sm`}
                >
                  {nim.initial}
                </div>
                <span className="text-[11px] font-medium text-wf-navy">
                  {nim.name}
                </span>
                <span className="text-[10px] text-wf-text-faint">
                  {nim.handle}
                </span>
              </Link>
            ))}
            {/* Join placeholder */}
            <Link
              href="/sodo/newmoon"
              className="flex flex-shrink-0 flex-col items-center"
            >
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-wf-celadon/30 text-2xl text-wf-celadon">
                +
              </div>
              <span className="text-[11px] font-medium text-wf-navy">
                참여하기
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-14 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[20px] bg-wf-navy p-10 text-center md:p-14">
            <div className="relative z-10">
              <h3 className="text-xl font-bold leading-snug text-wf-warm md:text-2xl">
                W&amp;F에 참여하고
                <br />
                싶으신가요?
              </h3>
              <p className="mt-3 text-xs text-wf-warm/60">
                초대를 통해서만 구성원이 될 수 있습니다.
              </p>
              <Link
                href="/sodo/newmoon"
                className="mt-6 inline-block rounded-[10px] bg-wf-celadon px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-80"
              >
                초대 신청하기
              </Link>
            </div>
            {/* Decorative blur */}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

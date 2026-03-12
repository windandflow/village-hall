import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start justify-center px-4 py-24 md:py-36">
        <p className="mb-4 text-sm tracking-widest text-wf-text-light">
          달뜨는마을 · 인제 신월리
        </p>
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-wf-text md:text-6xl">
          관계 인구와 지역을
          <br />잇는 네트워크
        </h1>
        <p className="mb-10 max-w-lg text-lg leading-relaxed text-wf-text-light">
          Wind &amp; Flow는 도시와 농촌 사이 새로운 관계의 방식을 실험합니다.
          방문자가 아닌 참여자로, 손님이 아닌 이웃으로.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sodo/newmoon"
            className="rounded-full bg-wf-navy px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            달뜨는마을 보기
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-wf-border px-6 py-3 text-sm font-medium text-wf-text transition-colors hover:bg-wf-cream"
          >
            소개 읽기
          </Link>
        </div>
      </section>

      {/* 소도 섹션 */}
      <section className="border-t border-wf-border bg-wf-cream">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-wf-text-faint">
            소도 (所都)
          </h2>
          <p className="mb-8 text-2xl font-medium text-wf-text">
            첫 번째 소도: 달뜨는마을
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: '위치', value: '강원 인제군 인제읍 신월리' },
              { label: '개설', value: '2025년' },
              { label: '상태', value: '활성' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-wf-border bg-white p-5"
              >
                <p className="mb-1 text-xs text-wf-text-faint">{item.label}</p>
                <p className="text-sm font-medium text-wf-text">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-wf-border">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-wf-text">
            함께하고 싶으신가요?
          </h2>
          <p className="mb-8 text-wf-text-light">
            초대를 통해 구성원이 될 수 있습니다. 아직 초대장이 없다면 신청해주세요.
          </p>
          <Link
            href="/sodo/newmoon"
            className="rounded-full bg-wf-navy px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            참여 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}

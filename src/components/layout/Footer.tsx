import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-wf-border bg-wf-warm">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium tracking-widest text-wf-text">
              wind &amp; flow
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-wf-text-faint">
              관계 인구와 지역을 잇는 네트워크 스테이트.
              <br />첫 번째 소도: 달뜨는마을, 인제 신월리.
            </p>
          </div>

          {/* 링크 */}
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-wf-text-light">서비스</span>
              <Link href="/about" className="text-wf-text-faint hover:text-wf-text">소개</Link>
              <Link href="/events" className="text-wf-text-faint hover:text-wf-text">이벤트</Link>
              <Link href="/nim" className="text-wf-text-faint hover:text-wf-text">구성원</Link>
              <Link href="/sodo" className="text-wf-text-faint hover:text-wf-text">소도</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-wf-text-light">참여</span>
              <Link href="/sodo/newmoon" className="text-wf-text-faint hover:text-wf-text">달뜨는마을</Link>
              <Link href="/onboarding/sign" className="text-wf-text-faint hover:text-wf-text">서명하기</Link>
              <Link href="/my/invite" className="text-wf-text-faint hover:text-wf-text">초대하기</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-wf-border pt-6 text-xs text-wf-text-faint md:flex-row md:justify-between">
          <span>© 2026 Wind &amp; Flow. All rights reserved.</span>
          <span>windandflow.xyz</span>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-wf-navy px-6 py-14 text-wf-warm">
      <div className="mx-auto max-w-5xl">
        {/* Links grid */}
        <div className="mb-10">
          <div className="mb-6 text-sm font-bold italic text-wf-gold">
            W&amp;F Network
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                Network
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60">
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    Manifesto
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    Protocol
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-wf-celadon">
                    W&amp;F OS
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                Community
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60">
                <li>
                  <Link href="/events" className="transition-colors hover:text-wf-celadon">
                    이벤트
                  </Link>
                </li>
                <li>
                  <Link href="/nim" className="transition-colors hover:text-wf-celadon">
                    구성원
                  </Link>
                </li>
                <li>
                  <Link href="/sodo" className="transition-colors hover:text-wf-celadon">
                    소도
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                Projects
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60">
                <li>
                  <Link
                    href="/sodo/newmoon"
                    className="transition-colors hover:text-wf-celadon"
                  >
                    달뜨는마을
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-wf-celadon">
                Open Source
              </h4>
              <ul className="space-y-2 text-xs text-wf-warm/60">
                <li>
                  <a
                    href="https://github.com/windandflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-wf-celadon"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-3 border-t border-white/5 pt-6">
          <p className="text-center text-xs italic text-wf-warm/30">
            &ldquo;바람처럼 자유롭게, 물처럼 흐르며&rdquo;
          </p>
          <div className="flex gap-4 text-[10px] text-wf-warm/40">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
          </div>
          <p className="text-[10px] tracking-wider text-wf-warm/30">
            © 2026 Wind &amp; Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

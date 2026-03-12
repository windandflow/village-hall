# Village Hall (마을회관)

**Wind & Flow 네트워크의 첫 번째 L4 앱.**

온보딩, NIM 프로필, 소도(所都) 페이지, 관리 대시보드를 제공합니다.

> Built on [@windandflow/sdk](https://github.com/windandflow/wf-os/tree/main/packages/sdk)
> Deployed at [windandflow.xyz](https://windandflow.xyz)

## 라우트 구조

```
/                         랜딩 (히어로, 소도, CTA)
/about                    소개 (Manifesto / Protocol / WFOS / Contribute)
/events                   이벤트 목록
/onboarding/sign          매니페스토 서명
/onboarding/deposit       디포짓 (optional)
/my                       내 여권 (닫힘 → 펼침)
/my/edit                  프로필 편집
/my/invite                초대장 관리
/invite/[hash]            초대 수락
/nim                      NIM 디렉토리
/nim/[slug]               공개 프로필 (여권 열림)
/sodo                     소도 목록
/sodo/[slug]              소도 페이지
/admin                    관리 대시보드 (L3+ 전용)
```

## 기술 스택

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Privy (소셜 로그인 + 임베디드 월렛) |
| SDK | @windandflow/sdk (W&F OS L3) |
| Database | Supabase (SDK를 통해 접근) |
| Blockchain | Base L2 (SDK를 통해 접근) |
| AI | Claude API (@anthropic-ai/sdk) |
| Font | Pretendard Variable (self-hosted) |
| Deploy | Vercel → windandflow.xyz |

## 개발 시작

```bash
# 의존성 설치
npm install

# @windandflow/sdk 로컬 링크 (wf-os repo가 ../wf-os에 있을 때)
cd ../wf-os/packages/sdk && npm run build && npm link
cd - && npm link @windandflow/sdk

# 환경 변수 설정
cp .env.example .env.local
# .env.local 에 실제 값 입력

# Pretendard Variable 폰트 다운로드
# https://github.com/orioncactus/pretendard/releases
# PretendardVariable.woff2 → public/fonts/PretendardVariable.woff2

# 개발 서버 실행
npm run dev
```

## 환경 변수

`.env.example` 참조.

## 아키텍처 원칙

- 모든 DB/블록체인 접근은 `lib/wf.ts`의 WFClient를 통해서만.
- SDK에 없는 기능만 `lib/direct.ts`에서 Supabase 직접 호출.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드 API route 전용.
- UI에서 NFT, SBT, Blockchain 등 기술 용어 사용 금지.

## License

MIT

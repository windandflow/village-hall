# CLAUDE.md — Village Hall (마을회관)

> 이 파일은 Claude Code의 단일 진실 원천(Single Source of Truth)입니다.
> 모든 코딩 결정은 이 파일을 따릅니다. 의심되면 이 파일이 맞습니다.

## 프로젝트 요약

Village Hall은 Wind & Flow 네트워크의 첫 번째 L4 앱입니다.
W&F OS SDK (@windandflow/sdk)를 사용하여 온보딩, NIM 프로필, 소도 페이지, 관리 대시보드를 제공합니다.

첫 번째 소도: 달뜨는마을(New Moon Village), 인제 신월리.
도메인: windandflow.xyz

## 아키텍처

```
이 repo (village-hall) = L4 Application
  └── @windandflow/sdk = L3 Framework (github.com/windandflow/wf-os)
       ├── packages/db       = Supabase schema
       ├── packages/contracts = Solidity (Passport SBT, Visa NFT)
       ├── packages/sdk       = TypeScript SDK (이 앱이 사용)
       └── packages/config    = State configuration
```

village-hall은 SDK를 통해서만 W&F OS와 통신합니다.
DB 직접 접근, 컨트랙트 직접 호출은 이 repo에서 하지 않습니다.

---

## 기술 스택

| Layer | Technology | Note |
|-------|-----------|------|
| Framework | @windandflow/sdk | L3, wf-os repo에서 관리 |
| Frontend | Next.js 15 (App Router) | 이 repo |
| Styling | Tailwind CSS + shadcn/ui | 이 repo |
| Auth | Privy | 소셜 로그인 + 임베디드 월렛 |
| Database | Supabase (via SDK) | SDK를 통해 접근 |
| Blockchain | Base L2 (via SDK) | SDK를 통해 접근 |
| AI | Claude API (@anthropic-ai/sdk) | Markdown 변환 (이 repo에서 직접 호출) |
| Font | Pretendard Variable (self-hosted) | next/font/local |
| Deploy | Vercel | windandflow.xyz |

---

## 디렉토리 구조

```
src/
├── app/                          # 페이지
│   ├── layout.tsx                # Root layout (providers, nav, footer)
│   ├── page.tsx                  # / Landing
│   ├── about/page.tsx            # /about
│   ├── events/page.tsx           # /events
│   ├── onboarding/
│   │   ├── sign/page.tsx         # 매니페스토 서명
│   │   └── deposit/page.tsx      # 디포짓 (optional)
│   ├── my/
│   │   ├── page.tsx              # /my (내 여권)
│   │   ├── edit/page.tsx         # /my/edit
│   │   └── invite/page.tsx       # /my/invite
│   ├── invite/[hash]/page.tsx    # 초대 수락
│   ├── admin/page.tsx            # 소도 관리 (L3+)
│   ├── nim/
│   │   ├── page.tsx              # NIM 디렉토리
│   │   └── [slug]/page.tsx       # 공개 프로필
│   ├── sodo/
│   │   ├── page.tsx              # 소도 목록
│   │   └── [slug]/page.tsx       # 소도 페이지
│   └── api/
│       ├── auth/callback/route.ts
│       ├── invite-request/route.ts  # 초대 신청 (public)
│       ├── ai/markdown/route.ts     # AI 변환
│       ├── metadata/
│       │   ├── passport/[tokenId]/route.ts  # NFT metadata
│       │   └── visa/[tokenId]/route.ts
│       ├── og/
│       │   ├── passport/[slug]/route.ts     # OG 이미지
│       │   └── visa/[slug]/[stateSlug]/route.ts
│       └── admin/
│           ├── stats/route.ts
│           ├── invite-requests/route.ts
│           ├── members/route.ts
│           └── report/route.ts
├── components/
│   ├── providers/                # Privy, Supabase, React Query
│   ├── layout/
│   │   ├── Header.tsx            # 글로벌 네비 (모바일: 햄버거)
│   │   └── Footer.tsx            # 통일 푸터
│   ├── passport/
│   │   ├── PassportCover.tsx     # 커버 (이름 없음)
│   │   └── PassportBooklet.tsx   # 5페이지
│   ├── visa/
│   │   ├── VisaStamp.tsx
│   │   └── VisaLevel.tsx
│   ├── invite-request/
│   │   ├── RequestModal.tsx
│   │   └── RequestList.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostEditor.tsx        # AI markdown 미리보기
│   │   └── EventCard.tsx
│   ├── nim/
│   │   ├── NimDirectory.tsx
│   │   ├── LinksList.tsx
│   │   └── LinksEditor.tsx
│   └── dashboard/
│       ├── StatCard.tsx
│       └── ReportGenerator.tsx
├── lib/
│   ├── wf.ts                    # WFClient 인스턴스 (SDK 초기화)
│   ├── privy/config.ts
│   ├── ai.ts                    # Claude API wrapper
│   └── utils/
│       ├── avatar.ts            # handle hash -> gradient
│       └── validators.ts        # Zod schemas
└── types/
    └── index.ts                 # 앱 레벨 타입 (SDK 타입을 re-export + 확장)
```

**핵심**: 이 앱에는 supabase/, contracts/ 디렉토리가 없습니다.
모든 DB/블록체인 접근은 `lib/wf.ts`의 WFClient를 통해서만.

---

## MUST 규칙 (절대 위반 금지)

### 아키텍처
1. **SDK를 통해서만 데이터 접근**: 이 repo에서 supabase client를 직접 생성하지 않는다. `lib/wf.ts`의 WFClient 인스턴스만 사용한다.
2. **state_id 항상 전달**: SDK 함수 호출 시 state_id를 항상 전달한다. 생략하지 않는다.
3. **Event 로깅은 SDK가 처리**: SDK의 mutation 함수가 자동으로 event를 기록한다. 별도로 logEvent를 호출하지 않는다 (SDK가 안 하는 경우만 예외).
4. **API routes는 얇게**: API route에서는 auth 확인 + SDK 함수 호출 + 응답 반환만. 비즈니스 로직은 SDK에.
5. **Privy 토큰 검증**: 모든 authenticated API route에서 Privy 서버 SDK로 토큰 검증. 클라이언트 데이터를 신뢰하지 않는다.

### 보안
6. **SUPABASE_SERVICE_ROLE_KEY를 이 repo에 두지 않는다**. SDK가 관리.
7. **rehype-sanitize 필수**: Markdown 렌더링 시.
8. **invite_requests의 reason은 필수**: 빈 문자열 허용 안 함.

### UI/UX
9. **"님" 호칭**: 모든 Passport holder를 "[이름] 님"으로. 예외 없음.
10. **기술 용어 금지**: UI에 NFT, SBT, EIP, Base, Blockchain, Token, Mint 단어 금지.
    - "여권 발급" (not "SBT 민팅")
    - "디지털 증명서" (not "NFT")
    - "기록 확인 ↗" (not "Basescan")
    - "서명하기" (not "EIP-712 서명")
11. **Passport 커버에 개인 이름 없음**: 공식 로고 + 심볼 + "PASSPORT"만.
12. **Pretendard Variable**: next/font/local로 self-hosting.
13. **통일 푸터**: Footer 컴포넌트를 layout.tsx에 한 번만. 모든 페이지에 자동 적용.
14. **모바일 네비 = 햄버거**: 데스크탑에서만 링크 펼침.

---

## SHOULD 규칙

1. Server Actions for mutations, API routes for external-facing endpoints.
2. Zod validation on all inputs.
3. Optimistic UI with React Query.
4. Error boundaries on all pages.
5. AI 호출은 debounce 2000ms + 저장 시에만 최종 변환.
6. 핸들 중복 체크: 실시간 (debounce 500ms).
7. 핸들 예약어: admin, system, windandflow, wind, flow, nim, sodo, api, etc.

---

## SDK 사용법 (실제 wf-os API 기준)

```typescript
// lib/wf.ts
import { WFClient } from '@windandflow/sdk';

export const wf = new WFClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  contracts: {
    passportAddress: process.env.NEXT_PUBLIC_PASSPORT_CONTRACT!,
    visaAddress: process.env.NEXT_PUBLIC_VISA_CONTRACT!,
  },
  chain: 'base',
});
```

```typescript
// 사용 예시 (SDK의 실제 메서드)
import { wf } from '@/lib/wf';

// Identity
const entity = await wf.identity.createEntity({
  displayName: '한석',
  entityType: 'human',
  authProvider: 'privy',
  authProviderId: privyUserId,
  email: 'hahn@example.com',
});
const profile = await wf.identity.updateProfile(entityId, {
  display_name: '한석', bio: '노드원 대표', slug: 'hahnryu',
});

// Membership
const passport = await wf.membership.issuePassport({
  entityId, signature: eip712Signature,
});
const visa = await wf.membership.issueVisa({
  entityId, stateId: 'newmoon', invitedBy: inviterEntityId,
});
const state = await wf.membership.getState('newmoon');
const states = await wf.membership.listStates();

// Invitation
const invitation = await wf.membership.createInvitation({
  inviterId: entityId, stateId: 'newmoon',
});
const visa2 = await wf.membership.acceptInvitation({
  inviteCode: 'abc123', entityId: newEntityId,
});

// Relationship
const bonds = await wf.relationship.getBonds({
  entityId, stateId: 'newmoon',
});

// Activity
const events = await wf.activity.getEvents({
  stateId: 'newmoon', limit: 50,
});
```

**SDK에 아직 없는 것 (village-hall에서 직접 구현 필요):**
- invite_requests CRUD (SDK 업데이트 전까지 Supabase 직접 호출 허용)
- posts CRUD (같은 이유)
- AI markdown 변환 (Claude API, 이 앱에서 직접)
- Admin stats 집계 (같은 이유)
- slug 기반 entity 조회 (SDK에 getEntityBySlug 추가 전까지)

> SDK 업데이트 전까지 위 기능은 `lib/direct.ts`에 모아서 Supabase 직접 호출.
> SDK에 해당 기능이 추가되면 `lib/direct.ts`를 SDK 호출로 교체.
> `lib/direct.ts` 외에서는 절대 Supabase 직접 호출 금지.

```
Identity:     entities (+ slug, links 추가 필요), auth_methods, wallets
Membership:   states, passports, visas, invitations, invite_requests (신규)
Relationship: bonds
Activity:     events, checkin_spots, posts (신규)
Economy:      don_transfers, vouchers, themes (신규), entity_themes (신규)
Governance:   proposals, votes
Anchor:       anchors
```

핵심:
- state_id = TEXT slug ('newmoon', 'hahoe'). UUID 아님.
- entity_id = UUID (gen_random_uuid).
- bonds: entity_a_id < entity_b_id 순서 보장.
- passports: entity_id UNIQUE (1인 1여권).
- visas: (entity_id, state_id) UNIQUE.

Default State: `newmoon` (달뜨는마을)

---

## 컬러 팔레트 (Tailwind)

```
공식 (Brand Guideline):
  wf-black: #000000
  wf-gray-light: #CDD9D4
  wf-gray-blue: #D7D5CD

디지털 확장 (웹앱):
  wf-navy: #1B3A5C
  wf-celadon: #6BA3A0
  wf-cream: #F5F9F8
  wf-warm: #FAF8F5
  wf-gold: #C4A265
  wf-border: #E0E8E6
  wf-text: #2C3E3C
  wf-text-light: #7A8A87
  wf-text-faint: #A8B5B2
```

---

## Passport 구조

**닫힌 상태 (커버)**:
- 공식 W&F 로고 (소문자 wind & flow) + 4잎 심볼
- "PASSPORT" 텍스트
- 책등 표현
- 개인 이름 없음

**펼친 상태 (5페이지)**:
- Page 1: 신원 (사진, 이름 님, @handle, #, issued, expires ∞, badges, 기록확인)
- Page 2: About (Markdown)
- Page 3: Visa Stamps (소도별 스탬프 카드)
- Page 4: Links (linktree)
- Page 5: 1촌 (아바타 + 이름 님 + 뿌리 표시)

/nim/[slug] = 기본 열림 (커버 없이 바로 5페이지)
/my = 기본 닫힘 (커버 탭 -> 펼침)

---

## Visa Level

```
L0: 관심 인구 (Observer)
L1: 관계 인구 (Participant) - checkin 1+
L2: 반복 관계 인구 (Contributor) - checkin 3+
L3: 돌봄자 (Steward) - checkin 10+ → Admin 자동 부여
L4: 원주민 (Elder) - manual only
```

---

## NFT Metadata (동적)

온체인 tokenURI -> 서버 URL -> 동적 JSON + 이미지 반환.
이미지는 카도 템플릿 + 사용자 데이터로 서버에서 합성.
커버/레벨 변경 시 온체인 불변, 서버 응답만 변경.
ERC-4906 MetadataUpdate로 마켓플레이스에 알림.

---

## 3월 스코프 (하는 것)

- / (Landing + 히어로 + 소도 + Featured + CTA)
- /about (Manifesto/Protocol/WFOS/Contribute 4섹션)
- /events (다가오는/지난 이벤트)
- /join 온보딩 6단계 (로그인→프로필→서명→여권→비자→완료)
- /invite/[code] (초대 수락/거절)
- /my (Passport 닫힘→펼침, 1촌, 활동, 초대, 로그아웃)
- /my/edit (프로필, 링크, 공개범위, Featured 동의, AI 미리보기)
- /my/invite (초대장 관리, 링크 복사)
- /nim (NIM 디렉토리, 검색, 필터)
- /nim/[slug] (Passport 열림, 공개 프로필)
- /sodo (소도 목록)
- /sodo/[slug] (소도 페이지: 소개/이벤트/초대신청/멤버)
- /admin (5탭: 대시보드/회원/콘텐츠/초대신청/보고서, L3+ 전용)
- 초대 신청 모달 (이름/이메일/사유 필수)
- Passport SBT 민팅 (Base)
- Visa NFT 민팅 (Base)
- AI Markdown 변환
- 통일 푸터 + 햄버거 네비

## 3월 스코프 (안 하는 것)

- QR/NFC/Geofence 체크인
- $DON 토큰 경제
- 1촌 신청 (초대 = 자동 1촌)
- 개인 블로그/포스팅
- 알림 시스템
- 이메일 발송 (링크 복사만)
- 프리미엄 패스포트 커버 (themes 테이블만 생성)
- 소셜 연동 (ETH, 페북 등)
- /brand 페이지
- 글로벌 검색 (NIM 디렉토리 검색만)
- 다국어 (한/EN 토글 UI만, 번역 나중에)
- 거버넌스/투표
- 바우처/마켓

---

## 참조 문서

- Spec: 08_WF-OS-Spec-v0.7.1.md
- PRD: 08_WF-OS-MVP-PRD-v0.5.md
- ERD: 08_WF-OS-ERD-v0.3.md
- Wireframe: wf-wireframe-v5.html
- Brand: Logo_Symbol_Guideline.pdf
- Kado Scope: WF-Kado-Design-Scope-v2.1.docx
- Recognition Principle: 00_Recognition_Principle.md
- Recognition Protocol: 00_Recognition_Protocol.md

---

## 환경 변수

```
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # lib/direct.ts 전용 (서버 사이드만)
NEXT_PUBLIC_PASSPORT_CONTRACT=
NEXT_PUBLIC_VISA_CONTRACT=
NEXT_PUBLIC_CHAIN=base
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=https://windandflow.xyz
NEXT_PUBLIC_DEFAULT_STATE=newmoon
```

---

## 현재 상태

**설계 문서:**
- [x] Spec v0.7.1
- [x] PRD v0.5
- [x] ERD v0.3
- [x] Wireframe v5
- [x] Kado Design Scope v2.1
- [x] CLAUDE.md

**wf-os repo (github.com/windandflow/wf-os):**
- [x] packages/db/migrations/001_initial_schema.sql (v0.1, 업데이트 필요)
- [x] packages/contracts/src/WFPassport.sol (ERC-4906 추가 필요)
- [x] packages/contracts/src/WFVisa.sol (tokenURI URL 수정 필요)
- [x] packages/sdk/src/client.ts (invite_request, posts, slug 추가 필요)
- [x] packages/config/states/sinwolri.json (→ newmoon.json rename 필요)
- [ ] 002_v05_updates.sql 마이그레이션 작성
- [ ] SDK v0.2 (slug, invite_request, posts 지원)
- [ ] docs/ 최신 문서 업로드

**village-hall repo (github.com/windandflow/village-hall):**
- [x] README.md (업데이트 필요)
- [ ] CLAUDE.md 추가
- [ ] Supabase 프로젝트 세팅
- [ ] Privy 앱 세팅
- [ ] Vercel 프로젝트 세팅
- [ ] 도메인 연결 (windandflow.xyz)
- [ ] 코드 시작

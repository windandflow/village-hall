# Village Hall (마을회관)

**The first official L4 application on W&F OS.**

Village Hall is the front door to the Wind & Flow network. It handles onboarding, NIM profiles, State (Sodo) pages, and operator dashboards.

> Built on [@windandflow/sdk](https://github.com/windandflow/wf-os/tree/main/packages/sdk)

## Routes

```
/                     Landing (manifesto, intro)
/join?code=XXXX       Onboarding (invite acceptance, login, signing, minting)
/nim/[username]       NIM Profile (passport, visas, bonds)
/sodo/[stateId]       State page (manifesto, members, stats)
/console              Operator Console (passport count, visa count, invite tree)
```

## What This App Does

- Social login via Privy (email, Google, Kakao)
- Manifesto signing (EIP-712, gasless)
- Passport SBT minting on Base
- Invitation-based Visa NFT minting
- NIM profile pages (the Cyworld feeling: profile-centric, not feed-centric)
- State pages with live member counts
- Operator dashboard for government reporting

## What This App Does NOT Do

- Chat / messaging (use Discord or Telegram)
- Content feed (use B.Stage or Instagram)
- Token economy ($DON comes later)
- Governance (voting comes later)

## Tech Stack

- Next.js 14 (App Router)
- Privy for Web3 auth
- @windandflow/sdk for all W&F OS operations
- Tailwind CSS
- Vercel deployment

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_PASSPORT_CONTRACT=
NEXT_PUBLIC_VISA_CONTRACT=
NEXT_PUBLIC_CHAIN=base
```

## License

MIT

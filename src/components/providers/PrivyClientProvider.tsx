'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

const chain =
  process.env.NEXT_PUBLIC_CHAIN === 'base' ? base : baseSepolia;

export function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#1B3A5C',
          landingHeader: 'Wind & Flow',
          showWalletLoginFirst: false,
          walletChainType: 'ethereum-only',
        },
        loginMethods: ['email', 'google', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        supportedChains: [base, baseSepolia],
        defaultChain: chain,
        intl: {
          defaultCountry: 'KR',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

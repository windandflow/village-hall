'use client';

import { PrivyClientProvider } from './PrivyClientProvider';
import { QueryProvider } from './QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyClientProvider>
      <QueryProvider>{children}</QueryProvider>
    </PrivyClientProvider>
  );
}

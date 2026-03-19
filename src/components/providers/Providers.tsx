'use client';

import { PrivyClientProvider } from './PrivyClientProvider';
import { QueryProvider } from './QueryProvider';
import { LocaleProvider } from './LocaleProvider';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <PrivyClientProvider>
          <QueryProvider>{children}</QueryProvider>
        </PrivyClientProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

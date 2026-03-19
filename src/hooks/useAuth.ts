'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { findOrCreateEntity } from '@/lib/direct';

interface AuthState {
  entityId: string | null;
  displayName: string | null;
  loading: boolean;
}

/**
 * Privy 로그인 상태를 감지하고, entity가 없으면 자동 생성.
 * direct.ts를 사용 (SDK에 getEntityByAuthProvider 추가 전까지).
 */
export function useAuth(): AuthState & {
  login: () => void;
  logout: () => Promise<void>;
  authenticated: boolean;
} {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [state, setState] = useState<AuthState>({
    entityId: null,
    displayName: null,
    loading: true,
  });

  useEffect(() => {
    if (!ready) return;

    if (!authenticated || !user) {
      setState({ entityId: null, displayName: null, loading: false });
      return;
    }

    let cancelled = false;

    async function syncEntity() {
      try {
        const privyUserId = user!.id;
        const email = user!.email?.address;

        const entity = await findOrCreateEntity({
          displayName: email?.split('@')[0] || 'New Member',
          authProvider: 'privy',
          authProviderId: privyUserId,
          email: email,
        });

        if (!cancelled) {
          setState({
            entityId: entity?.entity_id ?? null,
            displayName: entity?.display_name ?? null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ entityId: null, displayName: null, loading: false });
        }
      }
    }

    syncEntity();
    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, user]);

  return {
    ...state,
    login,
    logout,
    authenticated,
  };
}

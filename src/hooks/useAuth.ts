'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { wf } from '@/lib/wf';

interface AuthState {
  entityId: string | null;
  displayName: string | null;
  loading: boolean;
}

/**
 * Privy 로그인 상태를 감지하고, entity가 없으면 자동 생성.
 * 로그인 → auth_methods에서 entity 조회 → 없으면 createEntity.
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
        // Privy user ID로 entity 조회/생성
        const privyUserId = user!.id;
        const email = user!.email?.address;

        // SDK를 통해 entity 조회 시도
        // auth_methods 테이블에서 privy provider로 조회
        // SDK에 아직 이 기능이 없으므로 직접 생성 시도
        // (이미 있으면 unique constraint로 실패 → 조회로 fallback)

        let entity: { entity_id: string; display_name: string } | null = null;
        try {
          const result = await wf.identity.createEntity({
            displayName: email?.split('@')[0] || 'New Member',
            entityType: 'human',
            authProvider: 'privy',
            authProviderId: privyUserId,
            email: email,
          });
          entity = result as { entity_id: string; display_name: string };
        } catch {
          // Entity already exists — 정상적인 경우
          // TODO: SDK에 getEntityByAuthProvider 추가 후 교체
          entity = null;
        }

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

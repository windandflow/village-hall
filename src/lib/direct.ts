/**
 * SDK에 아직 없는 기능의 Supabase 직접 호출 모음
 *
 * 이 파일만 Supabase를 직접 호출할 수 있다.
 * SDK에 해당 기능이 추가되면 이 파일에서 SDK 호출로 교체한다.
 *
 * 포함 대상:
 *   - invite_requests CRUD
 *   - posts CRUD
 *   - Admin stats 집계
 *   - slug 기반 entity 조회 (getEntityBySlug)
 *
 * 주의: SUPABASE_SERVICE_ROLE_KEY는 서버 사이드 API route에서만 사용.
 */

import { createClient } from '@supabase/supabase-js';

// 서버 사이드 전용 (API routes / Server Actions)
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service env vars missing');
  return createClient(url, key);
}

// 클라이언트 사이드 / 서버 공용 (anon key)
function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase anon env vars missing');
  return createClient(url, key);
}

// ─── Invite Requests ──────────────────────────────────────────────────────────

export async function createInviteRequest(data: {
  stateId: string;
  name: string;
  email: string;
  reason: string;
}) {
  const client = getAnonClient();
  const { data: result, error } = await client
    .from('invite_requests')
    .insert({
      state_id: data.stateId,
      name: data.name,
      email: data.email,
      reason: data.reason,
    })
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function listInviteRequests(stateId: string) {
  const client = getServiceClient();
  const { data, error } = await client
    .from('invite_requests')
    .select('*')
    .eq('state_id', stateId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

// TODO: posts CRUD (SDK 업데이트 후 교체)

// ─── Admin Stats ──────────────────────────────────────────────────────────────

// TODO: 통계 집계 쿼리 (SDK 업데이트 후 교체)

// ─── Auth: Entity Sync ───────────────────────────────────────────────────────

export async function findOrCreateEntity(params: {
  displayName: string;
  authProvider: string;
  authProviderId: string;
  email?: string;
}): Promise<{ entity_id: string; display_name: string } | null> {
  const client = getAnonClient();

  // 1. auth_methods에서 기존 entity 조회
  const { data: authMethod } = await client
    .from('auth_methods')
    .select('entity_id')
    .eq('provider', params.authProvider)
    .eq('provider_user_id', params.authProviderId)
    .single();

  if (authMethod) {
    // 기존 entity 반환
    const { data: entity } = await client
      .from('entities')
      .select('entity_id, display_name')
      .eq('entity_id', authMethod.entity_id)
      .single();
    return entity as { entity_id: string; display_name: string } | null;
  }

  // 2. 신규 entity 생성
  const { data: newEntity, error: entityError } = await client
    .from('entities')
    .insert({
      display_name: params.displayName,
      entity_type: 'human',
    })
    .select('entity_id, display_name')
    .single();

  if (entityError || !newEntity) return null;

  // 3. auth_method 연결
  await client.from('auth_methods').insert({
    entity_id: newEntity.entity_id,
    provider: params.authProvider,
    provider_user_id: params.authProviderId,
    email: params.email,
  });

  return newEntity as { entity_id: string; display_name: string };
}

// ─── Slug Lookup ─────────────────────────────────────────────────────────────

export async function getEntityBySlug(slug: string) {
  const client = getAnonClient();
  const { data, error } = await client
    .from('entities')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

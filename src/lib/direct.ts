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

// ─── Entity Lookup ───────────────────────────────────────────────────────────

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

export async function getEntityById(entityId: string) {
  const client = getAnonClient();
  const { data, error } = await client
    .from('entities')
    .select('*')
    .eq('entity_id', entityId)
    .single();
  if (error) throw error;
  return data;
}

// ─── Profile Update ─────────────────────────────────────────────────────────

export async function updateEntity(
  entityId: string,
  updates: {
    display_name?: string;
    bio?: string;
    slug?: string;
    links?: Array<{ label: string; url: string }>;
    avatar_url?: string;
  },
) {
  const client = getServiceClient();
  const { data, error } = await client
    .from('entities')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('entity_id', entityId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkSlugAvailable(slug: string, excludeEntityId?: string) {
  const client = getAnonClient();
  let query = client
    .from('entities')
    .select('entity_id')
    .eq('slug', slug);
  if (excludeEntityId) {
    query = query.neq('entity_id', excludeEntityId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

// ─── Full Profile (for /nim/[slug]) ─────────────────────────────────────────

export async function getEntityProfile(slug: string) {
  const client = getAnonClient();

  // 1. Entity
  const { data: entity, error: entityErr } = await client
    .from('entities')
    .select('*')
    .eq('slug', slug)
    .single();
  if (entityErr || !entity) return null;

  // 2. Passport
  const { data: passport } = await client
    .from('passports')
    .select('*')
    .eq('entity_id', entity.entity_id)
    .maybeSingle();

  // 3. Visas (with state name)
  const { data: visas } = await client
    .from('visas')
    .select('*, states(name)')
    .eq('entity_id', entity.entity_id)
    .eq('status', 'active');

  // 4. Bonds
  const { data: bondsA } = await client
    .from('bonds')
    .select('entity_b_id, entities!bonds_entity_b_id_fkey(entity_id, display_name, slug)')
    .eq('entity_a_id', entity.entity_id);

  const { data: bondsB } = await client
    .from('bonds')
    .select('entity_a_id, entities!bonds_entity_a_id_fkey(entity_id, display_name, slug)')
    .eq('entity_b_id', entity.entity_id);

  const bonds = [
    ...(bondsA || []).map((b: Record<string, unknown>) => {
      const e = b.entities as Record<string, unknown> | null;
      return {
        entityId: e?.entity_id as string,
        displayName: e?.display_name as string,
        slug: e?.slug as string | undefined,
      };
    }),
    ...(bondsB || []).map((b: Record<string, unknown>) => {
      const e = b.entities as Record<string, unknown> | null;
      return {
        entityId: e?.entity_id as string,
        displayName: e?.display_name as string,
        slug: e?.slug as string | undefined,
      };
    }),
  ];

  return {
    entityId: entity.entity_id,
    displayName: entity.display_name,
    slug: entity.slug,
    bio: entity.bio,
    avatarUrl: entity.avatar_url,
    links: (entity.links as Array<{ label: string; url: string }>) || [],
    passportNumber: passport?.token_id ?? null,
    issuedAt: passport?.created_at ?? null,
    signedAt: passport?.signed_at ?? null,
    visas: (visas || []).map((v: Record<string, unknown>) => {
      const state = v.states as Record<string, unknown> | null;
      return {
        stateId: v.state_id as string,
        stateName: (state?.name as string) || (v.state_id as string),
        level: Number(v.level) || 0,
        levelLabel: getLevelLabel(Number(v.level) || 0),
        joinedAt: v.created_at as string,
      };
    }),
    bonds,
  };
}

function getLevelLabel(level: number): string {
  switch (level) {
    case 0: return 'Observer';
    case 1: return 'Participant';
    case 2: return 'Contributor';
    case 3: return 'Steward';
    case 4: return 'Elder';
    default: return 'Observer';
  }
}

// ─── My Profile (by entityId) ───────────────────────────────────────────────

export async function getMyProfile(entityId: string) {
  const client = getAnonClient();

  const { data: entity } = await client
    .from('entities')
    .select('*')
    .eq('entity_id', entityId)
    .single();
  if (!entity) return null;

  const { data: passport } = await client
    .from('passports')
    .select('*')
    .eq('entity_id', entityId)
    .maybeSingle();

  const { data: visas } = await client
    .from('visas')
    .select('*, states(name)')
    .eq('entity_id', entityId)
    .eq('status', 'active');

  const { data: bondsA } = await client
    .from('bonds')
    .select('entity_b_id, entities!bonds_entity_b_id_fkey(entity_id, display_name, slug)')
    .eq('entity_a_id', entityId);

  const { data: bondsB } = await client
    .from('bonds')
    .select('entity_a_id, entities!bonds_entity_a_id_fkey(entity_id, display_name, slug)')
    .eq('entity_b_id', entityId);

  const bonds = [
    ...(bondsA || []).map((b: Record<string, unknown>) => {
      const e = b.entities as Record<string, unknown> | null;
      return {
        entityId: e?.entity_id as string,
        displayName: e?.display_name as string,
        slug: e?.slug as string | undefined,
      };
    }),
    ...(bondsB || []).map((b: Record<string, unknown>) => {
      const e = b.entities as Record<string, unknown> | null;
      return {
        entityId: e?.entity_id as string,
        displayName: e?.display_name as string,
        slug: e?.slug as string | undefined,
      };
    }),
  ];

  return {
    entityId: entity.entity_id,
    displayName: entity.display_name,
    slug: entity.slug,
    bio: entity.bio,
    avatarUrl: entity.avatar_url,
    links: (entity.links as Array<{ label: string; url: string }>) || [],
    passportNumber: passport?.token_id ?? null,
    issuedAt: passport?.created_at ?? null,
    signedAt: passport?.signed_at ?? null,
    hasPassport: !!passport,
    visas: (visas || []).map((v: Record<string, unknown>) => {
      const state = v.states as Record<string, unknown> | null;
      return {
        stateId: v.state_id as string,
        stateName: (state?.name as string) || (v.state_id as string),
        level: Number(v.level) || 0,
        levelLabel: getLevelLabel(Number(v.level) || 0),
        joinedAt: v.created_at as string,
      };
    }),
    bonds,
  };
}

// ─── NIM Directory ──────────────────────────────────────────────────────────

export async function listNims(stateId: string) {
  const client = getAnonClient();
  const { data: visas, error } = await client
    .from('visas')
    .select('entity_id, level, entities!visas_entity_id_fkey(entity_id, display_name, slug, bio)')
    .eq('state_id', stateId)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (visas || []).map((v: Record<string, unknown>) => {
    const e = v.entities as Record<string, unknown> | null;
    return {
      entityId: e?.entity_id as string,
      displayName: e?.display_name as string,
      slug: (e?.slug as string) || '',
      bio: (e?.bio as string) || undefined,
      level: Number(v.level) || 0,
      stateId,
    };
  });
}

// ─── Admin Stats ────────────────────────────────────────────────────────────

export async function getAdminStats(stateId: string) {
  const client = getServiceClient();

  const [
    { count: totalMembers },
    { count: totalVisas },
    { count: pendingRequests },
    { count: totalPosts },
  ] = await Promise.all([
    client.from('passports').select('*', { count: 'exact', head: true }),
    client.from('visas').select('*', { count: 'exact', head: true }).eq('state_id', stateId).eq('status', 'active'),
    client.from('invite_requests').select('*', { count: 'exact', head: true }).eq('state_id', stateId).eq('status', 'pending'),
    client.from('posts').select('*', { count: 'exact', head: true }).eq('state_id', stateId),
  ]);

  return {
    totalMembers: totalMembers || 0,
    totalVisas: totalVisas || 0,
    pendingRequests: pendingRequests || 0,
    totalPosts: totalPosts || 0,
  };
}

// ─── Admin Members ──────────────────────────────────────────────────────────

export async function listMembers(stateId: string) {
  const client = getServiceClient();
  const { data: visas, error } = await client
    .from('visas')
    .select('entity_id, level, created_at, entities!visas_entity_id_fkey(entity_id, display_name, slug, bio)')
    .eq('state_id', stateId)
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (visas || []).map((v: Record<string, unknown>) => {
    const e = v.entities as Record<string, unknown> | null;
    return {
      entityId: e?.entity_id as string,
      displayName: e?.display_name as string,
      slug: (e?.slug as string) || null,
      level: Number(v.level) || 0,
      joinedAt: v.created_at as string,
    };
  });
}

// ─── Invitations ────────────────────────────────────────────────────────────

export async function createInvitation(inviterId: string, stateId: string) {
  const client = getServiceClient();
  const inviteCode = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30일

  const { data, error } = await client
    .from('invitations')
    .insert({
      inviter_id: inviterId,
      state_id: stateId,
      invite_code: inviteCode,
      expires_at: expiresAt,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listInvitations(entityId: string) {
  const client = getServiceClient();
  const { data, error } = await client
    .from('invitations')
    .select('*, accepted_entity:entities!invitations_accepted_by_fkey(display_name, slug)')
    .eq('inviter_id', entityId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getInvitationByCode(code: string) {
  const client = getAnonClient();
  const { data, error } = await client
    .from('invitations')
    .select('*, inviter:entities!invitations_inviter_id_fkey(display_name, slug), state:states(name)')
    .eq('invite_code', code)
    .eq('status', 'pending')
    .single();
  if (error) return null;

  // Check expiry
  if (data && new Date(data.expires_at) < new Date()) return null;
  return data;
}

export async function acceptInvitation(code: string, entityId: string, stateId: string) {
  const client = getServiceClient();

  // 1. Update invitation
  const { data: invitation, error: invErr } = await client
    .from('invitations')
    .update({ status: 'accepted', accepted_by: entityId })
    .eq('invite_code', code)
    .eq('status', 'pending')
    .select('invitation_id, inviter_id, state_id')
    .single();
  if (invErr || !invitation) throw new Error('Invitation not found or already used');

  // 2. Create visa
  const { error: visaErr } = await client
    .from('visas')
    .insert({
      entity_id: entityId,
      state_id: invitation.state_id,
      level: '1',
      status: 'active',
      invited_by: invitation.inviter_id,
    });
  if (visaErr && visaErr.code !== '23505') throw visaErr; // ignore duplicate

  // 3. Create bond (auto 1-chon)
  const [a, b] = [entityId, invitation.inviter_id].sort();
  const { error: bondErr } = await client
    .from('bonds')
    .insert({
      entity_a_id: a,
      entity_b_id: b,
      state_id: invitation.state_id,
      thickness: 1,
      last_recognition_at: new Date().toISOString(),
    });
  if (bondErr && bondErr.code !== '23505') throw bondErr; // ignore duplicate

  return invitation;
}

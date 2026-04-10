import { NextRequest, NextResponse } from 'next/server';
import { verifyManifestoSignature, getManifestoHash, getSigningDomain } from '@/lib/chain';
import { getEntityById } from '@/lib/direct';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

// 매니페스토 원문 (i18n ko 기준 — 서명 검증용)
const MANIFESTO_TEXT = [
  '우리는 눈에 보이지 않는 것들을 봅니다.',
  '바람의 결, 사람 사이의 흐름, 작은 돌봄이 만드는 변화를.',
  '우리는 그 보이지 않는 것들을 증명합니다.',
  '서로를 알아보는 것, 그것이 우리의 시작입니다.',
].join('\n');

/**
 * GET /api/manifesto/sign
 * 서명에 필요한 도메인 정보 + 매니페스토 해시 반환
 */
export async function GET() {
  const domain = getSigningDomain();
  const manifestoHash = getManifestoHash(MANIFESTO_TEXT);

  return NextResponse.json({
    domain,
    types: {
      ManifestoSign: [
        { name: 'signer', type: 'address' },
        { name: 'manifestoHash', type: 'bytes32' },
        { name: 'timestamp', type: 'uint256' },
      ],
    },
    manifestoHash,
  });
}

/**
 * POST /api/manifesto/sign
 * EIP-712 서명 검증 → DB 저장
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, walletAddress, signature, timestamp } = body;

    if (!entityId || !walletAddress || !signature || !timestamp) {
      return NextResponse.json(
        { error: 'entityId, walletAddress, signature, timestamp required' },
        { status: 400 },
      );
    }

    // entity 존재 확인
    const entity = await getEntityById(entityId);
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    // EIP-712 서명 검증
    const manifestoHash = getManifestoHash(MANIFESTO_TEXT);
    const valid = verifyManifestoSignature(signature, walletAddress, manifestoHash, timestamp);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // DB에 서명 기록 (passports 테이블에 signed_at 업데이트 또는 생성)
    const client = getServiceClient();

    // wallets 테이블에 지갑 주소 기록
    await client
      .from('wallets')
      .upsert(
        {
          entity_id: entityId,
          address: walletAddress,
          chain: process.env.NEXT_PUBLIC_CHAIN || 'base-sepolia',
          created_via: 'privy',
        },
        { onConflict: 'address,chain' },
      );

    // passport 레코드 upsert (아직 온체인 민팅 전이므로 token_id 없음)
    const { data: passport, error } = await client
      .from('passports')
      .upsert(
        {
          entity_id: entityId,
          signed_at: new Date(timestamp * 1000).toISOString(),
          manifesto_signature: signature,
          status: 'active',
        },
        { onConflict: 'entity_id' },
      )
      .select()
      .single();

    if (error) {
      console.error('Passport upsert error:', error);
      return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      passportId: passport.entity_id,
      manifestoHash,
    });
  } catch (err) {
    console.error('Manifesto sign error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

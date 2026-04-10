import { NextRequest, NextResponse } from 'next/server';
import { mintPassport, mintVisa, getManifestoHash } from '@/lib/chain';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * POST /api/passport/issue
 * 서명 완료된 entity에 Passport SBT 민팅
 *
 * 요청: { entityId, walletAddress }
 * 1. passport 레코드에서 서명 확인
 * 2. 온체인 mint() 호출
 * 3. DB에 token_id, tx_hash 기록
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, walletAddress } = body;

    if (!entityId || !walletAddress) {
      return NextResponse.json(
        { error: 'entityId and walletAddress required' },
        { status: 400 },
      );
    }

    const client = getServiceClient();

    // 1. 서명 확인
    const { data: passport, error: fetchErr } = await client
      .from('passports')
      .select('*')
      .eq('entity_id', entityId)
      .maybeSingle();

    if (fetchErr || !passport) {
      return NextResponse.json(
        { error: 'Passport record not found. Sign manifesto first.' },
        { status: 400 },
      );
    }

    if (!passport.signed_at || !passport.manifesto_signature) {
      return NextResponse.json(
        { error: 'Manifesto not signed yet' },
        { status: 400 },
      );
    }

    // 이미 민팅됨
    if (passport.token_id) {
      return NextResponse.json({
        success: true,
        tokenId: passport.token_id,
        txHash: passport.mint_tx_hash,
        alreadyMinted: true,
      });
    }

    // 2. 온체인 민팅 (manifesto hash = keccak256 of manifesto text)
    const manifestoHash = getManifestoHash();
    const { tokenId, txHash } = await mintPassport(walletAddress, manifestoHash);

    // 3. DB 업데이트
    const { error: updateErr } = await client
      .from('passports')
      .update({
        token_id: tokenId,
        mint_tx_hash: txHash,
      })
      .eq('entity_id', entityId);

    if (updateErr) {
      console.error('Passport DB update error:', updateErr);
    }

    // 5. 보유 중인 Visa도 온체인 민팅 (아직 token_id 없는 것만)
    let visaTxHash: string | null = null;
    try {
      const { data: visas } = await client
        .from('visas')
        .select('visa_id, state_id, invited_by')
        .eq('entity_id', entityId)
        .is('token_id', null);

      if (visas && visas.length > 0) {
        for (const visa of visas) {
          // inviter 지갑 조회
          let inviterAddr = ethers.ZeroAddress;
          if (visa.invited_by) {
            const { data: inviterWallet } = await client
              .from('wallets')
              .select('address')
              .eq('entity_id', visa.invited_by)
              .maybeSingle();
            if (inviterWallet) inviterAddr = inviterWallet.address;
          }

          const visaResult = await mintVisa(walletAddress, visa.state_id, inviterAddr);
          visaTxHash = visaResult.txHash;

          await client
            .from('visas')
            .update({ token_id: visaResult.tokenId, mint_tx_hash: visaResult.txHash })
            .eq('visa_id', visa.visa_id);
        }
      }
    } catch (visaErr) {
      // Visa 민팅 실패해도 Passport는 이미 성공 → 에러 무시
      console.error('Auto visa mint error (non-fatal):', visaErr);
    }

    return NextResponse.json({
      success: true,
      tokenId,
      txHash,
      visaTxHash,
    });
  } catch (err) {
    console.error('Passport issue error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { mintVisa } from '@/lib/chain';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * POST /api/visa/issue
 * Visa NFT 온체인 민팅
 *
 * 요청: { entityId, walletAddress, stateId, inviterWalletAddress? }
 * 1. visa 레코드 확인 (DB에 이미 있어야 함 - acceptInvitation에서 생성)
 * 2. 온체인 mint() 호출
 * 3. DB에 token_id, tx_hash 기록
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, walletAddress, stateId = 'newmoon', inviterWalletAddress } = body;

    if (!entityId || !walletAddress) {
      return NextResponse.json(
        { error: 'entityId and walletAddress required' },
        { status: 400 },
      );
    }

    const client = getServiceClient();

    // 1. visa 레코드 확인
    const { data: visa, error: fetchErr } = await client
      .from('visas')
      .select('*')
      .eq('entity_id', entityId)
      .eq('state_id', stateId)
      .maybeSingle();

    if (fetchErr || !visa) {
      return NextResponse.json(
        { error: 'Visa record not found. Accept invitation first.' },
        { status: 400 },
      );
    }

    // 이미 민팅됨
    if (visa.token_id) {
      return NextResponse.json({
        success: true,
        tokenId: visa.token_id,
        txHash: visa.mint_tx_hash,
        alreadyMinted: true,
      });
    }

    // 2. inviter 지갑 주소 조회 (없으면 zero address)
    let inviterAddr = inviterWalletAddress || ethers.ZeroAddress;
    if (!inviterWalletAddress && visa.invited_by) {
      const { data: inviterWallet } = await client
        .from('wallets')
        .select('address')
        .eq('entity_id', visa.invited_by)
        .maybeSingle();
      if (inviterWallet) {
        inviterAddr = inviterWallet.address;
      }
    }

    // 3. 온체인 민팅
    const { tokenId, txHash } = await mintVisa(walletAddress, stateId, inviterAddr);

    // 4. DB 업데이트
    const { error: updateErr } = await client
      .from('visas')
      .update({
        token_id: tokenId,
        mint_tx_hash: txHash,
      })
      .eq('visa_id', visa.visa_id);

    if (updateErr) {
      console.error('Visa DB update error:', updateErr);
    }

    return NextResponse.json({
      success: true,
      tokenId,
      txHash,
    });
  } catch (err) {
    console.error('Visa issue error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

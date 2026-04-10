import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
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

function getVisaImage(level: number): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://windandflow.xyz';
  if (level >= 3) return `${appUrl}/img/visa_lv3.png`;
  if (level >= 1) return `${appUrl}/img/visa_lv1_3.png`;
  return `${appUrl}/img/visa_lv0.png`;
}

/**
 * GET /api/metadata/visa/[tokenId]
 * NFT metadata JSON (ERC-721 표준)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  const { tokenId } = await params;
  const tokenIdNum = parseInt(tokenId, 10);

  if (isNaN(tokenIdNum) || tokenIdNum <= 0) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
  }

  try {
    const client = getServiceClient();

    // token_id로 visa 조회
    const { data: visa } = await client
      .from('visas')
      .select('*, entities!visas_entity_id_fkey(display_name, slug), states(name, slug)')
      .eq('token_id', tokenIdNum)
      .maybeSingle();

    if (!visa) {
      return NextResponse.json({ error: 'Visa not found' }, { status: 404 });
    }

    const entity = visa.entities as Record<string, unknown> | null;
    const state = visa.states as Record<string, unknown> | null;
    const displayName = (entity?.display_name as string) || 'Wind & Flow Member';
    const stateName = (state?.name as string) || visa.state_id;
    const level = Number(visa.level) || 0;
    const levelLabel = getLevelLabel(level);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://windandflow.xyz';

    const metadata = {
      name: `Wind & Flow Visa #${tokenIdNum} — ${stateName}`,
      description: `${displayName} 님의 ${stateName} 비자입니다. Level: ${levelLabel}`,
      image: getVisaImage(level),
      external_url: `${appUrl}/sodo/${visa.state_id}`,
      attributes: [
        {
          trait_type: 'Visa Number',
          value: tokenIdNum,
          display_type: 'number',
        },
        {
          trait_type: 'Holder',
          value: displayName,
        },
        {
          trait_type: 'State',
          value: stateName,
        },
        {
          trait_type: 'Level',
          value: level,
          display_type: 'number',
        },
        {
          trait_type: 'Level Label',
          value: levelLabel,
        },
        {
          trait_type: 'Type',
          value: 'Non-transferable',
        },
        {
          trait_type: 'Joined',
          value: visa.created_at
            ? new Date(visa.created_at).toISOString().split('T')[0]
            : 'Unknown',
        },
      ],
    };

    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Visa metadata error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

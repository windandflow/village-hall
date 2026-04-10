import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * GET /api/metadata/passport/[tokenId]
 * NFT metadata JSON (ERC-721 표준)
 *
 * 온체인 tokenURI가 이 URL을 가리킴.
 * OpenSea, Zora 등 마켓플레이스에서 호출.
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

    // token_id로 passport 조회
    const { data: passport } = await client
      .from('passports')
      .select('*, entities(display_name, slug, bio, avatar_url)')
      .eq('token_id', tokenIdNum)
      .maybeSingle();

    if (!passport) {
      return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
    }

    const entity = passport.entities as Record<string, unknown> | null;
    const displayName = (entity?.display_name as string) || 'Wind & Flow Citizen';
    const slug = entity?.slug as string | undefined;
    const bio = (entity?.bio as string) || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://windandflow.xyz';

    // NIM 프로필 이미지 (향후 동적 합성으로 교체 가능)
    const imageUrl = `${appUrl}/img/passport-gray.jpg`;

    const metadata = {
      name: `Wind & Flow Passport #${tokenIdNum}`,
      description: bio || `${displayName} 님의 Wind & Flow 디지털 여권입니다.`,
      image: imageUrl,
      external_url: slug ? `${appUrl}/nim/${slug}` : `${appUrl}`,
      attributes: [
        {
          trait_type: 'Passport Number',
          value: tokenIdNum,
          display_type: 'number',
        },
        {
          trait_type: 'Holder',
          value: displayName,
        },
        {
          trait_type: 'Type',
          value: 'Soulbound',
        },
        {
          trait_type: 'Issued',
          value: passport.issued_at
            ? new Date(passport.issued_at).toISOString().split('T')[0]
            : 'Pending',
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
    console.error('Passport metadata error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getInvitationByCode, acceptInvitation } from '@/lib/direct';

/**
 * GET /api/invitation/accept?code=xxx
 * 초대장 정보 조회
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'code required' }, { status: 400 });
  }

  try {
    const invitation = await getInvitationByCode(code);
    if (!invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }
    return NextResponse.json(invitation);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 });
  }
}

/**
 * POST /api/invitation/accept
 * 초대 수락
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, entityId, stateId = 'newmoon' } = body;

    if (!code || !entityId) {
      return NextResponse.json({ error: 'code and entityId required' }, { status: 400 });
    }

    const result = await acceptInvitation(code, entityId, stateId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to accept invitation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

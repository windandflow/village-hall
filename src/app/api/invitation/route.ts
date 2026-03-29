import { NextRequest, NextResponse } from 'next/server';
import { createInvitation, listInvitations } from '@/lib/direct';

/**
 * GET /api/invitation?entityId=xxx
 * 내 초대장 목록
 */
export async function GET(request: NextRequest) {
  const entityId = request.nextUrl.searchParams.get('entityId');
  if (!entityId) {
    return NextResponse.json({ error: 'entityId required' }, { status: 400 });
  }

  try {
    const invitations = await listInvitations(entityId);
    return NextResponse.json(invitations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

/**
 * POST /api/invitation
 * 초대장 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, stateId = 'newmoon' } = body;

    if (!entityId) {
      return NextResponse.json({ error: 'entityId required' }, { status: 400 });
    }

    const invitation = await createInvitation(entityId, stateId);
    return NextResponse.json(invitation);
  } catch {
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
  }
}

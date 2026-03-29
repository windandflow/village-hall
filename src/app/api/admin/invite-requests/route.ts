import { NextResponse } from 'next/server';
import { listInviteRequests } from '@/lib/direct';

/**
 * GET /api/admin/invite-requests
 * Admin용 초대 신청 목록
 * TODO: Privy 토큰 검증 + L3+ 권한 체크
 */
export async function GET() {
  try {
    const requests = await listInviteRequests('newmoon');
    return NextResponse.json(requests);
  } catch (error) {
    console.error('admin/invite-requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

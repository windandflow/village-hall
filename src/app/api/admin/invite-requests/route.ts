import { NextRequest, NextResponse } from 'next/server';
import { listInviteRequests, updateInviteRequestStatus } from '@/lib/direct';

/**
 * GET /api/admin/invite-requests
 * Admin용 초대 신청 목록
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

/**
 * PATCH /api/admin/invite-requests
 * 초대 신청 승인/거절
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status, reviewedBy } = body;

    if (!requestId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const result = await updateInviteRequestStatus(requestId, status, reviewedBy || null);
    return NextResponse.json(result);
  } catch (error) {
    console.error('admin/invite-requests PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

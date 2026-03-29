import { NextRequest, NextResponse } from 'next/server';
import { createInviteRequest } from '@/lib/direct';

/**
 * POST /api/invite-request
 * Public 초대 신청 (인증 불필요)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, reason, stateId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const result = await createInviteRequest({
      stateId: stateId || 'newmoon',
      name: name.trim(),
      email: email.trim(),
      reason: reason.trim(),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('invite-request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

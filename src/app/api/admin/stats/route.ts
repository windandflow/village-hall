import { NextRequest, NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/direct';

/**
 * GET /api/admin/stats?stateId=newmoon
 * Admin 대시보드 통계
 * TODO: Privy 토큰 검증 + L3+ 권한 체크
 */
export async function GET(request: NextRequest) {
  const stateId = request.nextUrl.searchParams.get('stateId') || 'newmoon';

  try {
    const stats = await getAdminStats(stateId);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

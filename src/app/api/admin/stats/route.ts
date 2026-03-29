import { NextResponse } from 'next/server';

/**
 * GET /api/admin/stats
 * Admin 대시보드 통계
 * TODO: Privy 토큰 검증 + L3+ 권한 체크
 * TODO: direct.ts에서 실제 집계 쿼리
 */
export async function GET() {
  // 더미 통계 (추후 Supabase 집계로 교체)
  const stats = {
    totalMembers: 23,
    totalVisas: 18,
    pendingRequests: 3,
    totalEvents: 5,
  };

  return NextResponse.json(stats);
}

import { NextResponse } from 'next/server';

/**
 * GET /api/admin/members
 * Admin용 회원 목록
 * TODO: Privy 토큰 검증 + L3+ 권한 체크
 * TODO: direct.ts에서 실제 회원 조회
 */
export async function GET() {
  // 더미 데이터 (추후 Supabase 조회로 교체)
  const members = [
    { entityId: 'a1b2c3d4-0001', displayName: '범선', slug: 'bumsun', level: 4 },
    { entityId: 'a1b2c3d4-0002', displayName: '한석', slug: 'hahnryu', level: 3 },
    { entityId: 'a1b2c3d4-0003', displayName: '지연', slug: 'jiyeon', level: 2 },
  ];

  return NextResponse.json(members);
}

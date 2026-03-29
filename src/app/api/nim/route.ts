import { NextRequest, NextResponse } from 'next/server';
import { listNims } from '@/lib/direct';

/**
 * GET /api/nim?stateId=newmoon
 * NIM 디렉토리 (소도별 멤버 목록)
 */
export async function GET(request: NextRequest) {
  const stateId = request.nextUrl.searchParams.get('stateId') || 'newmoon';

  try {
    const nims = await listNims(stateId);
    return NextResponse.json(nims);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

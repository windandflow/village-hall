import { NextRequest, NextResponse } from 'next/server';
import { getEntityProfile } from '@/lib/direct';

/**
 * GET /api/profile/[slug]
 * 공개 프로필 조회 (NIM)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const profile = await getEntityProfile(slug);
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

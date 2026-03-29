import { NextRequest, NextResponse } from 'next/server';
import { getMyProfile, updateEntity, checkSlugAvailable } from '@/lib/direct';

/**
 * GET /api/profile?entityId=xxx
 * 내 프로필 조회
 */
export async function GET(request: NextRequest) {
  const entityId = request.nextUrl.searchParams.get('entityId');
  if (!entityId) {
    return NextResponse.json({ error: 'entityId required' }, { status: 400 });
  }

  try {
    const profile = await getMyProfile(entityId);
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * 프로필 수정
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, displayName, bio, slug, links } = body;

    if (!entityId) {
      return NextResponse.json({ error: 'entityId required' }, { status: 400 });
    }

    // Slug 예약어 체크
    const reserved = ['admin', 'system', 'windandflow', 'wind', 'flow', 'nim', 'sodo', 'api', 'about', 'events', 'my', 'invite', 'onboarding'];
    if (slug && reserved.includes(slug)) {
      return NextResponse.json({ error: 'Reserved slug' }, { status: 400 });
    }

    // Slug 중복 체크
    if (slug) {
      const available = await checkSlugAvailable(slug, entityId);
      if (!available) {
        return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
      }
    }

    const updates: Record<string, unknown> = {};
    if (displayName !== undefined) updates.display_name = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (slug !== undefined) updates.slug = slug;
    if (links !== undefined) updates.links = links;

    const entity = await updateEntity(entityId, updates);
    return NextResponse.json(entity);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

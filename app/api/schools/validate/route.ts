import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ school: null });
    }

    const school = await prisma.school.findUnique({
      where: { code: code.toUpperCase() },
      select: { id: true, name: true },
    });

    if (!school) {
      return NextResponse.json({ school: null });
    }

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
      },
      valid: true,
      schoolName: school.name,
    });
  } catch (error) {
    console.error('School validation error:', error);
    return NextResponse.json({ school: null });
  }
}

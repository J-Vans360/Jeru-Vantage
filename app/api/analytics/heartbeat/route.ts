import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    const deviceType = /mobile/i.test(userAgent)
      ? 'mobile'
      : /tablet/i.test(userAgent)
        ? 'tablet'
        : 'desktop';

    const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || null;

    await prisma.activeSession.upsert({
      where: { sessionId: body.sessionId },
      update: {
        currentPage: body.currentPage,
        currentActivity: body.currentActivity,
        lastActiveAt: new Date(),
      },
      create: {
        sessionId: body.sessionId,
        currentPage: body.currentPage,
        currentActivity: body.currentActivity,
        deviceType,
        country,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

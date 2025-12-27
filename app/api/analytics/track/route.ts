import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    // Parse device info
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    if (/mobile/i.test(userAgent)) deviceType = 'mobile';
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

    if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) browser = 'chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'safari';
    else if (/firefox/i.test(userAgent)) browser = 'firefox';
    else if (/edge/i.test(userAgent)) browser = 'edge';

    if (/windows/i.test(userAgent)) os = 'windows';
    else if (/macintosh|mac os/i.test(userAgent)) os = 'macos';
    else if (/android/i.test(userAgent)) os = 'android';
    else if (/iphone|ipad/i.test(userAgent)) os = 'ios';

    // Get location
    const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || null;
    const city = headersList.get('x-vercel-ip-city') || null;

    await prisma.analyticsEvent.create({
      data: {
        eventName: body.eventName,
        eventCategory: body.eventCategory,
        sessionId: body.sessionId,
        userId: body.userId,
        studentId: body.studentId,
        properties: body.properties,
        pagePath: body.pagePath,
        pageTitle: body.pageTitle,
        referrer: body.referrer,
        deviceType,
        browser,
        os,
        screenSize: body.screenSize,
        country,
        city,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track event error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

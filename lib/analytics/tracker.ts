import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

interface TrackEventParams {
  eventName: string;
  eventCategory: string;
  sessionId?: string;
  userId?: string;
  studentId?: string;
  properties?: Prisma.InputJsonValue;
  pagePath?: string;
  pageTitle?: string;
  referrer?: string;
}

interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
  screenSize?: string;
}

// Parse user agent to get device info
function parseUserAgent(userAgent: string): DeviceInfo {
  let deviceType = 'desktop';
  let browser = 'unknown';
  let os = 'unknown';

  // Device type
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  // Browser
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
    browser = 'chrome';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'safari';
  } else if (/firefox/i.test(userAgent)) {
    browser = 'firefox';
  } else if (/edge/i.test(userAgent)) {
    browser = 'edge';
  }

  // OS
  if (/windows/i.test(userAgent)) {
    os = 'windows';
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = 'macos';
  } else if (/android/i.test(userAgent)) {
    os = 'android';
  } else if (/iphone|ipad/i.test(userAgent)) {
    os = 'ios';
  } else if (/linux/i.test(userAgent)) {
    os = 'linux';
  }

  return { deviceType, browser, os };
}

// Server-side event tracking
export async function trackEvent(params: TrackEventParams) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgent);

    // Get country from Vercel/Cloudflare headers or IP
    const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || null;
    const city = headersList.get('x-vercel-ip-city') || headersList.get('cf-ipcity') || null;

    await prisma.analyticsEvent.create({
      data: {
        eventName: params.eventName,
        eventCategory: params.eventCategory,
        sessionId: params.sessionId || uuidv4(),
        userId: params.userId,
        studentId: params.studentId,
        properties: params.properties,
        pagePath: params.pagePath,
        pageTitle: params.pageTitle,
        referrer: params.referrer,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        country,
        city,
      },
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Update active session
export async function updateActiveSession(
  sessionId: string,
  data: {
    userId?: string;
    studentId?: string;
    currentPage?: string;
    currentActivity?: string;
    deviceType?: string;
    country?: string;
  }
) {
  try {
    await prisma.activeSession.upsert({
      where: { sessionId },
      update: {
        ...data,
        lastActiveAt: new Date(),
      },
      create: {
        sessionId,
        ...data,
      },
    });
  } catch (error) {
    console.error('Failed to update session:', error);
  }
}

// Clean up stale sessions (call periodically)
export async function cleanupStaleSessions() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  await prisma.activeSession.deleteMany({
    where: {
      lastActiveAt: { lt: fiveMinutesAgo },
    },
  });
}

// Get live session count
export async function getLiveSessionCount() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  return prisma.activeSession.count({
    where: {
      lastActiveAt: { gte: fiveMinutesAgo },
    },
  });
}

// Get sessions grouped by activity
export async function getSessionsByActivity() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const sessions = await prisma.activeSession.findMany({
    where: {
      lastActiveAt: { gte: fiveMinutesAgo },
    },
    select: {
      currentActivity: true,
    },
  });

  const breakdown: Record<string, number> = {
    browsing: 0,
    assessment: 0,
    results: 0,
    matching: 0,
  };

  sessions.forEach((session) => {
    const activity = session.currentActivity || 'browsing';
    breakdown[activity] = (breakdown[activity] || 0) + 1;
  });

  return breakdown;
}

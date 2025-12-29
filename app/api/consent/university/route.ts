import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface UniversityPreference {
  universityName: string;
  country: string;
  category: 'DREAM' | 'GOOD_FIT' | 'BACKUP';
  consentToConnect: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences, consentLevel, globalConsent } = await request.json();

    // Validate consent level (NONE means no sharing)
    const validLevels = ['BASIC', 'ENHANCED', 'FULL', 'NONE'];
    if (!validLevels.includes(consentLevel)) {
      return NextResponse.json({ error: 'Invalid consent level' }, { status: 400 });
    }

    // Prepare consent data for storage
    const consentData = consentLevel === 'NONE' ? [] : preferences;

    // Update or create AiReport with consent information
    await prisma.aiReport.upsert({
      where: { userId: session.user.id },
      update: {
        universityConsentCompleted: true,
        universityConsentLevel: consentLevel,
        consentedUniversities: consentData,
        // For NONE, we mark consent complete but download unlock depends on user type
        // The status API will handle the actual canDownload logic
      },
      create: {
        userId: session.user.id,
        reportContent: {},
        universityConsentCompleted: true,
        universityConsentLevel: consentLevel,
        consentedUniversities: consentData,
      },
    });

    // Also store individual university preferences if provided
    if (preferences && preferences.length > 0) {
      // Check if UniversityPreference model exists
      try {
        await prisma.universityPreference.deleteMany({
          where: { userId: session.user.id },
        });

        await prisma.universityPreference.createMany({
          data: preferences.map((pref: UniversityPreference) => ({
            userId: session.user.id,
            universityName: pref.universityName,
            country: pref.country,
            category: pref.category,
            consentToConnect: globalConsent && pref.consentToConnect,
            consentLevel,
          })),
        });
      } catch {
        // UniversityPreference model may not exist, just store in AiReport
        console.log('UniversityPreference model not found, stored in AiReport');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Consent saved successfully',
      downloadUnlocked: true,
    });
  } catch (error) {
    console.error('Consent submission error:', error);
    return NextResponse.json({ error: 'Failed to save consent' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aiReport = await prisma.aiReport.findUnique({
      where: { userId: session.user.id },
      select: {
        universityConsentCompleted: true,
        universityConsentLevel: true,
        consentedUniversities: true,
        downloadUnlocked: true,
      },
    });

    return NextResponse.json({
      consentCompleted: aiReport?.universityConsentCompleted || false,
      consentLevel: aiReport?.universityConsentLevel || null,
      universities: aiReport?.consentedUniversities || [],
      downloadUnlocked: aiReport?.downloadUnlocked || false,
    });
  } catch (error) {
    console.error('Consent fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch consent' }, { status: 500 });
  }
}

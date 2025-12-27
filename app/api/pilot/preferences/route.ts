import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Retrieve university preferences for current user
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const preferences = await prisma.universityPreference.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Error fetching university preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// POST - Save university preferences
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences || !Array.isArray(preferences)) {
      return NextResponse.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      );
    }

    // Delete existing preferences for this user
    await prisma.universityPreference.deleteMany({
      where: { userId: session.user.id },
    });

    // Create new preferences
    const createdPreferences = await prisma.universityPreference.createMany({
      data: preferences.map((pref: {
        universityName: string;
        country: string;
        category: 'DREAM' | 'GOOD_FIT' | 'BACKUP';
        consentToConnect: boolean;
      }) => ({
        userId: session.user.id,
        universityName: pref.universityName,
        country: pref.country,
        category: pref.category,
        consentToConnect: pref.consentToConnect,
      })),
    });

    // Fetch the created preferences to return
    const savedPreferences = await prisma.universityPreference.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: createdPreferences.count,
      preferences: savedPreferences,
    });
  } catch (error) {
    console.error('Error saving university preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific university preference
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('id');

    if (!preferenceId) {
      return NextResponse.json(
        { error: 'Preference ID required' },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    const preference = await prisma.universityPreference.findUnique({
      where: { id: preferenceId },
    });

    if (!preference) {
      return NextResponse.json(
        { error: 'Preference not found' },
        { status: 404 }
      );
    }

    if (preference.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this preference' },
        { status: 403 }
      );
    }

    await prisma.universityPreference.delete({
      where: { id: preferenceId },
    });

    return NextResponse.json({
      success: true,
      deleted: preferenceId,
    });
  } catch (error) {
    console.error('Error deleting university preference:', error);
    return NextResponse.json(
      { error: 'Failed to delete preference' },
      { status: 500 }
    );
  }
}

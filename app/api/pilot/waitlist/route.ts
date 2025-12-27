import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Check if user is on the full assessment waitlist
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const waitlistEntry = await prisma.fullAssessmentWaitlist.findUnique({
      where: { userId: session.user.id },
    });

    // Get position in waitlist
    let position = null;
    if (waitlistEntry) {
      const countBefore = await prisma.fullAssessmentWaitlist.count({
        where: {
          createdAt: { lt: waitlistEntry.createdAt },
        },
      });
      position = countBefore + 1;
    }

    // Get total waitlist count
    const totalWaitlist = await prisma.fullAssessmentWaitlist.count();

    return NextResponse.json({
      success: true,
      isOnWaitlist: !!waitlistEntry,
      entry: waitlistEntry,
      position,
      totalWaitlist,
    });
  } catch (error) {
    console.error('Error checking waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to check waitlist' },
      { status: 500 }
    );
  }
}

// POST - Join the full assessment waitlist
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
    const { interestedFeatures, notificationPreference } = body;

    // Check if already on waitlist
    const existing = await prisma.fullAssessmentWaitlist.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      // Update preferences if already on waitlist
      const updated = await prisma.fullAssessmentWaitlist.update({
        where: { userId: session.user.id },
        data: {
          interestedFeatures: interestedFeatures || existing.interestedFeatures,
          notificationPreference: notificationPreference || existing.notificationPreference,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Waitlist preferences updated',
        entry: updated,
        isNew: false,
      });
    }

    // Add to waitlist
    const entry = await prisma.fullAssessmentWaitlist.create({
      data: {
        userId: session.user.id,
        interestedFeatures: interestedFeatures || [],
        notificationPreference: notificationPreference || 'EMAIL',
      },
    });

    // Get position
    const countBefore = await prisma.fullAssessmentWaitlist.count({
      where: {
        createdAt: { lt: entry.createdAt },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Added to waitlist',
      entry,
      position: countBefore + 1,
      isNew: true,
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from waitlist
export async function DELETE(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existing = await prisma.fullAssessmentWaitlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Not on waitlist' },
        { status: 404 }
      );
    }

    await prisma.fullAssessmentWaitlist.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from waitlist',
    });
  } catch (error) {
    console.error('Error leaving waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to leave waitlist' },
      { status: 500 }
    );
  }
}

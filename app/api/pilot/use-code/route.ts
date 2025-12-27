import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    // Find code
    const inviteCode = await prisma.pilotInviteCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    if (!inviteCode.isActive) {
      return NextResponse.json(
        { error: 'This code is no longer active' },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (inviteCode.validFrom && now < inviteCode.validFrom) {
      return NextResponse.json(
        { error: 'This code is not yet active' },
        { status: 400 }
      );
    }

    if (inviteCode.validUntil && now > inviteCode.validUntil) {
      return NextResponse.json(
        { error: 'This code has expired' },
        { status: 400 }
      );
    }

    // Check if user already used a code
    const existingUsage = await prisma.pilotCodeUsage.findUnique({
      where: { userId: session.user.id },
    });

    if (existingUsage) {
      return NextResponse.json(
        { error: 'You have already used an invite code' },
        { status: 400 }
      );
    }

    // Check capacity again (race condition protection)
    if (inviteCode.maxUses && inviteCode.currentUses >= inviteCode.maxUses) {
      return NextResponse.json(
        { error: 'This code has reached its limit' },
        { status: 400 }
      );
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction([
      // Create usage record
      prisma.pilotCodeUsage.create({
        data: {
          codeId: inviteCode.id,
          userId: session.user.id,
        },
      }),
      // Increment counter
      prisma.pilotInviteCode.update({
        where: { id: inviteCode.id },
        data: { currentUses: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      sourceName: inviteCode.sourceName,
    });

  } catch (error) {
    console.error('Use code error:', error);
    return NextResponse.json(
      { error: 'Failed to use code' },
      { status: 500 }
    );
  }
}

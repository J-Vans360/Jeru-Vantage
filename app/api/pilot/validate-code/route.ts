import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    // Normalize code (uppercase, trim)
    const normalizedCode = code.toUpperCase().trim();

    // Find code
    const inviteCode = await prisma.pilotInviteCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!inviteCode) {
      return NextResponse.json(
        { valid: false, error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    // Check if active
    if (!inviteCode.isActive) {
      return NextResponse.json(
        { valid: false, error: 'This code is no longer active' },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (inviteCode.validFrom && now < inviteCode.validFrom) {
      return NextResponse.json(
        { valid: false, error: 'This code is not yet active' },
        { status: 400 }
      );
    }

    if (inviteCode.validUntil && now > inviteCode.validUntil) {
      return NextResponse.json(
        { valid: false, error: 'This code has expired' },
        { status: 400 }
      );
    }

    // Check capacity
    if (inviteCode.maxUses && inviteCode.currentUses >= inviteCode.maxUses) {
      return NextResponse.json(
        { valid: false, error: 'This code has reached its limit' },
        { status: 400 }
      );
    }

    // Code is valid
    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      sourceName: inviteCode.sourceName,
      spotsRemaining: inviteCode.maxUses
        ? inviteCode.maxUses - inviteCode.currentUses
        : null,
    });

  } catch (error) {
    console.error('Code validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}

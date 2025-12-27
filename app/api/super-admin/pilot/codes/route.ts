import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkSuperAdmin } from '@/lib/super-admin';
import { PilotSourceType } from '@prisma/client';

// Create new code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify super admin access
    const access = await checkSuperAdmin(session.user.id, session.user.email);
    if (!access.isSuper) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      name,
      sourceType,
      sourceName,
      sourceEmail,
      sourceCountry,
      maxUses,
      validUntil,
    } = body;

    // Validate required fields
    if (!code || !name || !sourceType) {
      return NextResponse.json(
        { error: 'Code, name, and sourceType are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCode = await prisma.pilotInviteCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'A code with this value already exists' },
        { status: 400 }
      );
    }

    const newCode = await prisma.pilotInviteCode.create({
      data: {
        code: code.toUpperCase(),
        name,
        sourceType: sourceType as PilotSourceType,
        sourceName: sourceName || null,
        sourceEmail: sourceEmail || null,
        sourceCountry: sourceCountry || null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(newCode);
  } catch (error) {
    console.error('Create code error:', error);
    return NextResponse.json(
      { error: 'Failed to create code' },
      { status: 500 }
    );
  }
}

// Get all codes
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify super admin access
    const access = await checkSuperAdmin(session.user.id, session.user.email);
    if (!access.isSuper) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const codes = await prisma.pilotInviteCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Get codes error:', error);
    return NextResponse.json(
      { error: 'Failed to get codes' },
      { status: 500 }
    );
  }
}

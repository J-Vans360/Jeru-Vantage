import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkSuperAdmin } from '@/lib/super-admin';
import { PilotSourceType } from '@prisma/client';

// Get single code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email);
    if (!access.isSuper) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;

    const code = await prisma.pilotInviteCode.findUnique({
      where: { id },
      include: {
        usages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!code) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    return NextResponse.json(code);
  } catch (error) {
    console.error('Get code error:', error);
    return NextResponse.json(
      { error: 'Failed to get code' },
      { status: 500 }
    );
  }
}

// Update code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email);
    if (!access.isSuper) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      sourceType,
      sourceName,
      sourceEmail,
      sourceCountry,
      maxUses,
      validUntil,
      isActive,
    } = body;

    console.log('[PATCH pilot code] Received id:', id);

    // Try to find by ID first, then by code string
    let existingCode = await prisma.pilotInviteCode.findUnique({
      where: { id },
    });

    if (!existingCode) {
      existingCode = await prisma.pilotInviteCode.findUnique({
        where: { code: id },
      });
    }

    if (!existingCode) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    const updatedCode = await prisma.pilotInviteCode.update({
      where: { id: existingCode.id },
      data: {
        ...(name !== undefined && { name }),
        ...(sourceType !== undefined && { sourceType: sourceType as PilotSourceType }),
        ...(sourceName !== undefined && { sourceName }),
        ...(sourceEmail !== undefined && { sourceEmail }),
        ...(sourceCountry !== undefined && { sourceCountry }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
        ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Update code error:', error);
    return NextResponse.json(
      { error: 'Failed to update code' },
      { status: 500 }
    );
  }
}

// Delete code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email);
    if (!access.isSuper) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;

    console.log('[DELETE pilot code] Received id:', id);

    // Try to find by ID first, then by code string
    let existingCode = await prisma.pilotInviteCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    // If not found by ID, try finding by code string (in case the code string was passed)
    if (!existingCode) {
      console.log('[DELETE pilot code] Not found by ID, trying by code string...');
      existingCode = await prisma.pilotInviteCode.findUnique({
        where: { code: id },
        include: {
          _count: {
            select: { usages: true },
          },
        },
      });
    }

    if (!existingCode) {
      console.log('[DELETE pilot code] Code not found by ID or code string');
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    console.log('[DELETE pilot code] Found code:', existingCode.code, 'with ID:', existingCode.id);

    // Warn if code has usages
    if (existingCode._count.usages > 0) {
      // Delete usages first
      await prisma.pilotCodeUsage.deleteMany({
        where: { codeId: existingCode.id },
      });
    }

    await prisma.pilotInviteCode.delete({
      where: { id: existingCode.id },
    });

    return NextResponse.json({ success: true, message: 'Code deleted' });
  } catch (error) {
    console.error('Delete code error:', error);
    return NextResponse.json(
      { error: 'Failed to delete code' },
      { status: 500 }
    );
  }
}

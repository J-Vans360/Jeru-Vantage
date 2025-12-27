import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET team members
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord) {
      return NextResponse.json({ error: 'Not a school admin' }, { status: 403 });
    }

    const team = await prisma.schoolAdmin.findMany({
      where: { schoolId: adminRecord.schoolId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json({ error: 'Failed to get team' }, { status: 500 });
  }
}

// Invite team member
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord || !['owner', 'admin'].includes(adminRecord.role)) {
      return NextResponse.json({ error: 'Not authorized to invite' }, { status: 403 });
    }

    const { email, role } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found. They must register first.',
        },
        { status: 404 }
      );
    }

    // Check if already a member
    const existing = await prisma.schoolAdmin.findUnique({
      where: {
        userId_schoolId: {
          userId: user.id,
          schoolId: adminRecord.schoolId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already a team member' }, { status: 400 });
    }

    // Add to team
    const newMember = await prisma.schoolAdmin.create({
      data: {
        userId: user.id,
        schoolId: adminRecord.schoolId,
        role: role || 'counselor',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error) {
    console.error('Invite team member error:', error);
    return NextResponse.json({ error: 'Failed to invite' }, { status: 500 });
  }
}

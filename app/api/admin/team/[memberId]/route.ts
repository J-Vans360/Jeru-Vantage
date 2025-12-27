import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord || !['owner', 'admin'].includes(adminRecord.role)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { memberId } = await params;

    // Get the member to remove
    const memberToRemove = await prisma.schoolAdmin.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Can't remove owner
    if (memberToRemove.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove owner' }, { status: 400 });
    }

    // Can't remove yourself
    if (memberToRemove.userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    await prisma.schoolAdmin.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json({ error: 'Failed to remove' }, { status: 500 });
  }
}

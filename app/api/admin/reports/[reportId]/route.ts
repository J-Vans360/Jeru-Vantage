import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord) {
      return NextResponse.json({ error: 'Not a school admin' }, { status: 403 });
    }

    const { reportId } = await params;

    const report = await prisma.jeruReport.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Verify student belongs to admin's school
    const studentInSchool = await prisma.schoolStudent.findFirst({
      where: {
        userId: report.userId,
        schoolId: adminRecord.schoolId,
      },
    });

    if (!studentInSchool) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json({ error: 'Failed to get report' }, { status: 500 });
  }
}

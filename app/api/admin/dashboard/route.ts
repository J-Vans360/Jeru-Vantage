import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool, getSchoolStats } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

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

    const stats = await getSchoolStats(adminRecord.schoolId);

    // Get recent activity
    const studentIds = await prisma.schoolStudent.findMany({
      where: { schoolId: adminRecord.schoolId },
      select: { userId: true },
    });
    const userIds = studentIds.map((s) => s.userId);

    const recentReports = await prisma.jeruReport.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    });

    const recentAssessments = await prisma.assessmentResult.findMany({
      where: { userId: { in: userIds } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({
      school: adminRecord.school,
      role: adminRecord.role,
      stats,
      recentActivity: {
        reports: recentReports,
        assessments: recentAssessments,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}

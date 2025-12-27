import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET all students
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord) {
      return NextResponse.json({ error: 'Not a school admin' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const grade = searchParams.get('grade') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { schoolId: adminRecord.schoolId };

    if (grade) {
      where.grade = grade;
    }

    // If search is provided, filter by user name or email
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const students = await prisma.schoolStudent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { enrolledAt: 'desc' },
    });

    // Get assessment progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const assessmentCount = await prisma.assessmentResult.count({
          where: { userId: student.userId },
        });
        const hasReport =
          (await prisma.jeruReport.count({
            where: { userId: student.userId },
          })) > 0;

        return {
          ...student,
          assessmentProgress: Math.round((assessmentCount / 10) * 100),
          hasReport,
        };
      })
    );

    const total = await prisma.schoolStudent.count({ where });

    return NextResponse.json({
      students: studentsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Failed to get students' }, { status: 500 });
  }
}

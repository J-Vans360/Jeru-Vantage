import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Get all schools and admins for debugging
    const allSchools = await prisma.school.findMany({
      include: {
        admins: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const allAdmins = await prisma.schoolAdmin.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!session?.user) {
      return NextResponse.json({
        status: 'not_authenticated',
        session: null,
        debug: {
          allSchools,
          allAdmins,
          totalSchools: allSchools.length,
          totalAdmins: allAdmins.length,
        },
      });
    }

    const userId = session.user.id;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Check admin records
    const adminRecords = await prisma.schoolAdmin.findMany({
      where: { userId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Check student records
    const studentRecords = await prisma.schoolStudent.findMany({
      where: { userId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Determine role
    let role = 'student';
    if (adminRecords.length > 0) {
      role = 'admin';
    } else if (studentRecords.length > 0) {
      role = 'school_student';
    }

    return NextResponse.json({
      status: 'authenticated',
      session: {
        user: session.user,
      },
      database: {
        user,
        adminRecords,
        studentRecords,
      },
      computed: {
        role,
        isAdmin: adminRecords.length > 0,
        isSchoolStudent: studentRecords.length > 0,
        redirect: role === 'admin' ? '/admin' : '/assessment',
      },
      debug: {
        allSchools,
        allAdmins,
        totalSchools: allSchools.length,
        totalAdmins: allAdmins.length,
        userIdFromSession: userId,
        userIdType: typeof userId,
      },
    });
  } catch (error) {
    console.error('Debug user-status error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

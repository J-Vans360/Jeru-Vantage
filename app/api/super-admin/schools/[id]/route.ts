import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper || !access.permissions.viewSchools) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        admins: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        students: {
          select: { id: true, userId: true }
        },
        override: true
      }
    })

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    // Get admin notes
    const adminNotes = await prisma.adminNote.findMany({
      where: { entityType: 'school', entityId: school.id },
      orderBy: { createdAt: 'desc' }
    })

    // Get stats
    const studentIds = school.students.map(s => s.userId)
    const assessmentCount = studentIds.length > 0
      ? await prisma.assessmentResult.groupBy({
          by: ['userId'],
          where: { userId: { in: studentIds } }
        }).then(r => r.length)
      : 0

    const reportCount = studentIds.length > 0
      ? await prisma.jeruReport.count({
          where: { userId: { in: studentIds } }
        })
      : 0

    const admin = school.admins[0]

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
        code: school.code,
        status: school.status || 'pending',
        contactEmail: school.contactEmail,
        country: school.country,

        adminName: admin?.user?.name || null,
        adminDesignation: school.adminDesignation,
        adminLinkedIn: school.adminLinkedIn,
        adminPhone: school.adminPhone,
        staffIdCard: school.staffIdCard,

        schoolWebsite: school.website,
        schoolAddress: school.address,
        schoolType: school.schoolType,
        affiliation: school.affiliation,
        studentStrength: school.studentStrength,

        assessmentLimit: school.studentLimit || 50,
        reportLimit: 50,
        usedAssessments: assessmentCount,
        usedReports: reportCount,

        override: school.override,

        studentCount: school.students.length,
        assessmentCount,
        reportCount,

        createdAt: school.createdAt.toISOString(),
        verifiedAt: school.verifiedAt?.toISOString() || null,

        adminNotes
      }
    })
  } catch (error) {
    console.error('Super admin school detail error:', error)
    return NextResponse.json({ error: 'Failed to load school' }, { status: 500 })
  }
}

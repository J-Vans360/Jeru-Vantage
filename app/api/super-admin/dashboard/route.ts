import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Gather stats
    const [
      totalUsers,
      totalSchools,
      pendingSchools,
      verifiedSchools,
      totalSponsors,
      pendingSponsors,
      usersWithAssessments,
      totalReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.school.count({ where: { status: 'pending' } }),
      prisma.school.count({ where: { status: 'verified' } }),
      prisma.sponsor.count(),
      prisma.sponsor.count({ where: { status: 'pending' } }),
      prisma.assessmentResult.groupBy({ by: ['userId'], _count: true }).then(r => r.length),
      prisma.jeruReport.count()
    ])

    // Count completed assessments (users with 10 sections done)
    const userSectionCounts = await prisma.assessmentResult.groupBy({
      by: ['userId'],
      _count: { id: true }
    })
    const completedAssessments = userSectionCounts.filter(r => r._count.id >= 10).length

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSchools,
        pendingSchools,
        verifiedSchools,
        totalSponsors,
        pendingSponsors: pendingSponsors || 0,
        totalAssessments: usersWithAssessments,
        completedAssessments,
        totalReports
      }
    })
  } catch (error) {
    console.error('Super admin dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}

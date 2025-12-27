import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sponsorAdmin = await prisma.sponsorAdmin.findFirst({
      where: { userId: session.user.id },
      include: { sponsor: true }
    })

    if (!sponsorAdmin) {
      return NextResponse.json({ error: 'Not a sponsor admin' }, { status: 403 })
    }

    const sponsor = sponsorAdmin.sponsor

    // Get sponsored students
    const sponsoredStudents = await prisma.sponsoredStudent.findMany({
      where: { sponsorId: sponsor.id },
      include: { user: true }
    })

    const studentIds = sponsoredStudents.map(s => s.userId)

    // Count completed assessments (students who have at least some results)
    let completedAssessments = 0
    let reportsGenerated = 0

    if (studentIds.length > 0) {
      // Count unique students with assessment results
      const studentsWithResults = await prisma.assessmentResult.groupBy({
        by: ['userId'],
        where: { userId: { in: studentIds } }
      })
      completedAssessments = studentsWithResults.length

      // Count reports
      reportsGenerated = await prisma.jeruReport.count({
        where: { userId: { in: studentIds } }
      })
    }

    return NextResponse.json({
      sponsor: {
        id: sponsor.id,
        name: sponsor.name,
        code: sponsor.code,
        type: sponsor.type,
        status: sponsor.status,
        verifiedAt: sponsor.verifiedAt
      },
      stats: {
        sponsoredSeats: sponsor.sponsoredSeats,
        usedSeats: sponsor.usedSeats,
        completedAssessments,
        reportsGenerated
      },
      students: sponsoredStudents.map(s => ({
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        enrolledAt: s.enrolledAt
      }))
    })
  } catch (error) {
    console.error('Sponsor dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}

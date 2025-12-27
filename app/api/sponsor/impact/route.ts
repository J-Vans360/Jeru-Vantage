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

    const sponsoredStudents = await prisma.sponsoredStudent.findMany({
      where: { sponsorId: sponsor.id }
    })

    const studentIds = sponsoredStudents.map(s => s.userId)
    const totalSponsored = studentIds.length

    let completedAssessments = 0
    let reportsGenerated = 0

    if (studentIds.length > 0) {
      // Count students with assessment results
      const studentsWithResults = await prisma.assessmentResult.groupBy({
        by: ['userId'],
        where: { userId: { in: studentIds } }
      })
      completedAssessments = studentsWithResults.length

      reportsGenerated = await prisma.jeruReport.count({
        where: { userId: { in: studentIds } }
      })
    }

    const completionRate = totalSponsored > 0
      ? Math.round((completedAssessments / totalSponsored) * 100)
      : 0

    return NextResponse.json({
      stats: {
        totalSponsored,
        completedAssessments,
        reportsGenerated,
        completionRate
      },
      topInterests: ['Social', 'Investigative', 'Artistic'],
      topStrengths: ['Creativity', 'Empathy', 'Problem Solving']
    })
  } catch (error) {
    console.error('Impact report error:', error)
    return NextResponse.json({ error: 'Failed to load impact' }, { status: 500 })
  }
}

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

    const sponsoredStudents = await prisma.sponsoredStudent.findMany({
      where: { sponsorId: sponsorAdmin.sponsorId },
      include: { user: true },
      orderBy: { enrolledAt: 'desc' }
    })

    // Get assessment progress for each student
    const studentsWithProgress = await Promise.all(
      sponsoredStudents.map(async (student) => {
        const results = await prisma.assessmentResult.findMany({
          where: { userId: student.userId }
        })

        // Count unique sections completed (assuming 10 total sections)
        const uniqueSections = new Set(results.map(r => r.partName + r.domainName)).size
        const progress = Math.round((uniqueSections / 10) * 100)

        const hasReport = await prisma.jeruReport.count({
          where: { userId: student.userId }
        }) > 0

        return {
          ...student,
          assessmentProgress: Math.min(progress, 100),
          hasReport
        }
      })
    )

    return NextResponse.json({ students: studentsWithProgress })
  } catch (error) {
    console.error('Sponsor students error:', error)
    return NextResponse.json({ error: 'Failed to load students' }, { status: 500 })
  }
}

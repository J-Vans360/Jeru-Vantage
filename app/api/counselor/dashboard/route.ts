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

    // Check if user is a counselor
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true }
    })

    if (user?.role !== 'counselor') {
      return NextResponse.json({ error: 'Not a counselor' }, { status: 403 })
    }

    // Get the counselor's claimed code
    const claimedCode = await prisma.pilotInviteCode.findFirst({
      where: { claimedById: session.user.id },
      select: {
        id: true,
        code: true,
        name: true,
        sourceName: true,
      }
    })

    if (!claimedCode) {
      return NextResponse.json({ error: 'No code found for counselor' }, { status: 404 })
    }

    // Get all students who used this code
    const pilotCodeUsages = await prisma.pilotCodeUsage.findMany({
      where: { codeId: claimedCode.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            pilotAssessment: {
              select: {
                status: true,
                completedAt: true,
              }
            }
          }
        }
      },
      orderBy: { registeredAt: 'desc' }
    })

    // Format students data
    const students = pilotCodeUsages.map((usage) => ({
      id: usage.user.id,
      name: usage.user.name || 'Unknown',
      email: usage.user.email || '',
      registeredAt: usage.registeredAt.toISOString(),
      assessmentStatus: usage.user.pilotAssessment?.status || 'NOT_STARTED',
      assessmentCompletedAt: usage.user.pilotAssessment?.completedAt?.toISOString() || null,
    }))

    const completedAssessments = students.filter(
      (s) => s.assessmentStatus === 'COMPLETED'
    ).length

    return NextResponse.json({
      code: claimedCode.code,
      name: claimedCode.sourceName || claimedCode.name || user.name,
      totalStudents: students.length,
      completedAssessments,
      students,
    })

  } catch (error) {
    console.error('[counselor/dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

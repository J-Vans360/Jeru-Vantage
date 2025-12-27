import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSuperAdmin } from '@/lib/super-admin'
import { prisma } from '@/lib/prisma'

async function verifySuperAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const access = await checkSuperAdmin(session.user.id || '', session.user.email)
  if (!access.isSuper) return null

  return access
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const sponsor = await prisma.sponsor.findUnique({
    where: { id },
    include: {
      _count: {
        select: { students: true }
      }
    }
  })

  if (!sponsor) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
  }

  // Get admin notes
  const adminNotes = await prisma.adminNote.findMany({
    where: {
      entityType: 'sponsor',
      entityId: id
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get sponsored student IDs for assessment/report counts
  const sponsoredStudents = await prisma.sponsoredStudent.findMany({
    where: { sponsorId: id },
    select: { userId: true }
  })
  const studentIds = sponsoredStudents.map(s => s.userId)

  // Count assessments
  const assessmentCount = studentIds.length > 0
    ? await prisma.assessmentResult.count({
        where: { userId: { in: studentIds } }
      })
    : 0

  // Count reports
  const reportCount = studentIds.length > 0
    ? await prisma.jeruReport.count({
        where: { userId: { in: studentIds } }
      })
    : 0

  return NextResponse.json({
    sponsor: {
      id: sponsor.id,
      name: sponsor.name,
      code: sponsor.code,
      type: sponsor.type,
      status: sponsor.status,

      contactName: sponsor.contactName,
      contactEmail: sponsor.contactEmail,
      contactPhone: sponsor.contactPhone,
      contactDesignation: sponsor.contactDesignation,
      contactLinkedIn: sponsor.contactLinkedIn,

      website: sponsor.website,
      address: sponsor.address,
      country: sponsor.country,
      registrationNumber: sponsor.registrationNumber,
      purpose: sponsor.purpose,
      beneficiaries: sponsor.beneficiaries,
      estimatedStudents: sponsor.estimatedStudents,

      sponsoredSeats: sponsor.sponsoredSeats,
      usedSeats: sponsor.usedSeats,

      studentCount: sponsor._count.students,
      assessmentCount,
      reportCount,

      createdAt: sponsor.createdAt,
      verifiedAt: sponsor.verifiedAt,

      adminNotes
    }
  })
}

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

export async function GET(request: Request) {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || 'all'

  // Build where clause based on type filter
  // User model connects to schools via SchoolStudent and sponsors via SponsoredStudent
  const whereClause: Record<string, unknown> = {}

  if (type === 'school') {
    whereClause.schoolStudent = { some: {} }
  } else if (type === 'sponsor') {
    whereClause.sponsoredStudent = { some: {} }
  } else if (type === 'individual') {
    whereClause.AND = [
      { schoolStudent: { none: {} } },
      { sponsoredStudent: { none: {} } }
    ]
  }

  // Add search
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  }

  const students = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      schoolStudent: {
        select: {
          school: {
            select: { id: true, name: true }
          }
        },
        take: 1
      },
      sponsoredStudent: {
        select: {
          sponsor: {
            select: { id: true, name: true }
          }
        },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  // Transform the data to flatten school/sponsor info
  const transformedStudents = students.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    createdAt: student.createdAt,
    role: student.role,
    school: student.schoolStudent[0]?.school || null,
    sponsor: student.sponsoredStudent[0]?.sponsor || null
  }))

  // Get counts using the junction tables
  const totalCount = await prisma.user.count()
  const schoolCount = await prisma.user.count({
    where: { schoolStudent: { some: {} } }
  })
  const sponsorCount = await prisma.user.count({
    where: { sponsoredStudent: { some: {} } }
  })
  const individualCount = await prisma.user.count({
    where: {
      AND: [
        { schoolStudent: { none: {} } },
        { sponsoredStudent: { none: {} } }
      ]
    }
  })

  return NextResponse.json({
    students: transformedStudents,
    counts: {
      total: totalCount,
      school: schoolCount,
      sponsor: sponsorCount,
      individual: individualCount
    }
  })
}

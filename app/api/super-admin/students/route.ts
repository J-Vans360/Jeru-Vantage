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

  const whereClause: Record<string, unknown> = {}

  // Filter by type
  if (type === 'school') {
    whereClause.schoolId = { not: null }
  } else if (type === 'sponsor') {
    whereClause.sponsorId = { not: null }
  } else if (type === 'individual') {
    whereClause.schoolId = null
    whereClause.sponsorId = null
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
      school: {
        select: { id: true, name: true }
      },
      sponsor: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  // Get counts
  const totalCount = await prisma.user.count()
  const schoolCount = await prisma.user.count({ where: { schoolId: { not: null } } })
  const sponsorCount = await prisma.user.count({ where: { sponsorId: { not: null } } })
  const individualCount = await prisma.user.count({
    where: { schoolId: null, sponsorId: null }
  })

  return NextResponse.json({
    students,
    counts: {
      total: totalCount,
      school: schoolCount,
      sponsor: sponsorCount,
      individual: individualCount
    }
  })
}

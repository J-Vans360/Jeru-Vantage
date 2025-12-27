import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper || !access.permissions.viewSchools) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status && status !== 'all' ? { status } : {}

    const schools = await prisma.school.findMany({
      where,
      include: {
        admins: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          take: 1
        },
        _count: {
          select: { students: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedSchools = schools.map(school => ({
      id: school.id,
      name: school.name,
      code: school.code,
      status: school.status || 'pending',
      country: school.country,
      contactEmail: school.contactEmail,
      adminName: school.admins[0]?.user?.name || null,
      adminDesignation: school.adminDesignation,
      adminLinkedIn: school.adminLinkedIn,
      schoolWebsite: school.website,
      studentCount: school._count.students,
      assessmentCount: 0,
      createdAt: school.createdAt.toISOString()
    }))

    return NextResponse.json({ schools: formattedSchools })
  } catch (error) {
    console.error('Super admin schools error:', error)
    return NextResponse.json({ error: 'Failed to load schools' }, { status: 500 })
  }
}

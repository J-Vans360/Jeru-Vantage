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

  const sponsors = await prisma.sponsor.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ]
    } : undefined,
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: [
      { createdAt: 'desc' }
    ]
  })

  return NextResponse.json({ sponsors })
}

export async function POST(request: Request) {
  const access = await verifySuperAdmin()
  if (!access || access.role === 'support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  // Generate a unique code
  const code = `SP${Date.now().toString(36).toUpperCase()}`

  const sponsor = await prisma.sponsor.create({
    data: {
      name: data.name,
      contactName: data.contactName || 'Admin',
      contactEmail: data.contactEmail,
      code,
      type: data.type || 'ngo',
      sponsoredSeats: data.sponsoredSeats || 100,
      usedSeats: 0,
      status: 'verified' // Super admin created sponsors are auto-verified
    }
  })

  return NextResponse.json({ sponsor })
}

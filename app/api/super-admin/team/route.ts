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

export async function GET() {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const members = await prisma.superAdmin.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ members })
}

export async function POST(request: Request) {
  const access = await verifySuperAdmin()
  if (!access || access.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can add team members' }, { status: 401 })
  }

  const { email, role } = await request.json()

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
  }

  // Check if already exists
  const existing = await prisma.superAdmin.findUnique({
    where: { email }
  })

  if (existing) {
    return NextResponse.json({ error: 'Email already has access' }, { status: 400 })
  }

  const member = await prisma.superAdmin.create({
    data: {
      email,
      role,
      name: null
    }
  })

  return NextResponse.json({ member })
}

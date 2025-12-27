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

  return { ...access, currentUserId: session.user.id }
}

export async function GET() {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const members = await prisma.superAdmin.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Transform to include user info at top level
  const transformedMembers = members.map(member => ({
    id: member.id,
    userId: member.userId,
    role: member.role,
    permissions: member.permissions,
    invitedBy: member.invitedBy,
    invitedAt: member.invitedAt,
    lastActiveAt: member.lastActiveAt,
    isActive: member.isActive,
    createdAt: member.createdAt,
    name: member.user?.name,
    email: member.user?.email
  }))

  return NextResponse.json({ members: transformedMembers })
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

  // Find or create the user first
  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    // Create user with the email
    user = await prisma.user.create({
      data: {
        email,
        role: 'admin'
      }
    })
  }

  // Check if already a super admin
  const existing = await prisma.superAdmin.findUnique({
    where: { userId: user.id }
  })

  if (existing) {
    return NextResponse.json({ error: 'Email already has super admin access' }, { status: 400 })
  }

  const member = await prisma.superAdmin.create({
    data: {
      userId: user.id,
      role,
      invitedBy: access.currentUserId
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  return NextResponse.json({
    member: {
      id: member.id,
      userId: member.userId,
      role: member.role,
      name: member.user?.name,
      email: member.user?.email,
      createdAt: member.createdAt
    }
  })
}

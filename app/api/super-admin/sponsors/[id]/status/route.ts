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

  return { ...access, session }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await verifySuperAdmin()
  if (!access || access.role === 'support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  if (!['pending', 'verified', 'suspended'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { status }

  // If verifying, set verifiedAt and verifiedBy
  if (status === 'verified') {
    updateData.verifiedAt = new Date()
    updateData.verifiedBy = access.session.user?.email || 'super-admin'
  }

  const sponsor = await prisma.sponsor.update({
    where: { id },
    data: updateData
  })

  // Add admin note about status change
  await prisma.adminNote.create({
    data: {
      entityType: 'sponsor',
      entityId: id,
      note: `Status changed to "${status}" by ${access.session.user?.email}`,
      createdBy: access.session.user?.email || 'super-admin'
    }
  })

  return NextResponse.json({ sponsor })
}

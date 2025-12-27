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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await verifySuperAdmin()
  if (!access || access.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can remove team members' }, { status: 401 })
  }

  const { id } = await params

  await prisma.superAdmin.delete({
    where: { id }
  })

  return NextResponse.json({ success: true })
}

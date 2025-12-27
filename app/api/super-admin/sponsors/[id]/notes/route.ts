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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { note } = await request.json()

  if (!note?.trim()) {
    return NextResponse.json({ error: 'Note is required' }, { status: 400 })
  }

  const adminNote = await prisma.adminNote.create({
    data: {
      entityType: 'sponsor',
      entityId: id,
      note: note.trim(),
      createdBy: access.session.user?.email || 'super-admin'
    }
  })

  return NextResponse.json({ note: adminNote })
}

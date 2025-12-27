import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper || !access.permissions.addNotes) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { note } = await request.json()

    const adminNote = await prisma.adminNote.create({
      data: {
        entityType: 'school',
        entityId: id,
        note,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({ note: adminNote })
  } catch (error) {
    console.error('Add school note error:', error)
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 })
  }
}

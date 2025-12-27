import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper || !access.permissions.verifySchools) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await request.json()

    const updateData: Record<string, unknown> = { status }

    if (status === 'verified') {
      updateData.verifiedAt = new Date()
      updateData.verifiedBy = session.user.id
    }

    const school = await prisma.school.update({
      where: { id },
      data: updateData
    })

    // Add a note about the status change
    await prisma.adminNote.create({
      data: {
        entityType: 'school',
        entityId: id,
        note: `Status changed to "${status}" by ${session.user.name || session.user.email}`,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({ school })
  } catch (error) {
    console.error('Update school status error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sponsorAdmin = await prisma.sponsorAdmin.findFirst({
      where: { userId: session.user.id },
      include: { sponsor: true }
    })

    if (!sponsorAdmin) {
      return NextResponse.json({ error: 'Not a sponsor admin' }, { status: 403 })
    }

    return NextResponse.json({ sponsor: sponsorAdmin.sponsor })
  } catch (error) {
    console.error('Sponsor settings error:', error)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sponsorAdmin = await prisma.sponsorAdmin.findFirst({
      where: { userId: session.user.id }
    })

    if (!sponsorAdmin) {
      return NextResponse.json({ error: 'Not a sponsor admin' }, { status: 403 })
    }

    const { name, contactName, contactEmail, contactPhone, website, country } = await request.json()

    const updated = await prisma.sponsor.update({
      where: { id: sponsorAdmin.sponsorId },
      data: {
        name,
        contactName,
        contactEmail,
        contactPhone,
        website,
        country
      }
    })

    return NextResponse.json({ sponsor: updated })
  } catch (error) {
    console.error('Update sponsor settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

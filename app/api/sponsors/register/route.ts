import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Generate unique sponsor code
function generateSponsorCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'SP' // Prefix for sponsor codes
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      type,
      contactPhone,
      website,
      country,
      // New verification fields
      contactName,
      contactDesignation,
      contactLinkedIn,
      registrationNumber,
      address,
      purpose,
      beneficiaries,
      estimatedStudents
    } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
    }

    // Check if user already owns a sponsor org
    const existingSponsorAdmin = await prisma.sponsorAdmin.findFirst({
      where: { userId: session.user.id, role: 'owner' }
    })

    if (existingSponsorAdmin) {
      return NextResponse.json({ error: 'You already manage a sponsor organization' }, { status: 400 })
    }

    // Generate unique sponsor code
    let code = generateSponsorCode()
    let codeExists = await prisma.sponsor.findUnique({ where: { code } })
    while (codeExists) {
      code = generateSponsorCode()
      codeExists = await prisma.sponsor.findUnique({ where: { code } })
    }

    // Create sponsor and admin in transaction
    const sponsor = await prisma.$transaction(async (tx) => {
      const newSponsor = await tx.sponsor.create({
        data: {
          name,
          code,
          type: type || 'ngo',
          contactName: contactName || session.user.name || 'Admin',
          contactEmail: session.user.email || '',
          contactPhone,
          website,
          country,
          // New verification fields
          contactDesignation,
          contactLinkedIn,
          registrationNumber,
          address,
          purpose,
          beneficiaries,
          estimatedStudents,
          // Sponsors start as pending, need verification
          status: 'pending',
          sponsoredSeats: 100, // Default 100 seats
          usedSeats: 0
        }
      })

      await tx.sponsorAdmin.create({
        data: {
          userId: session.user.id,
          sponsorId: newSponsor.id,
          role: 'owner'
        }
      })

      // Update user role to sponsor_admin
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: 'sponsor_admin' }
      })

      return newSponsor
    })

    return NextResponse.json({
      sponsor,
      message: sponsor.status === 'pending'
        ? 'Organization registered! Your account is pending verification.'
        : 'Organization registered successfully!'
    }, { status: 201 })
  } catch (error) {
    console.error('Sponsor registration error:', error)
    return NextResponse.json({ error: 'Failed to register sponsor' }, { status: 500 })
  }
}

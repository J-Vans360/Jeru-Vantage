import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function generateSchoolCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
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

    const body = await request.json()
    const {
      name,
      contactEmail,
      // New verification fields
      designation,
      linkedIn,
      contactPhone,
      schoolWebsite,
      schoolAddress,
      country,
      schoolType,
      affiliation,
      studentStrength
    } = body

    if (!name) {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 })
    }

    // Check if user already owns a school
    const existingAdmin = await prisma.schoolAdmin.findFirst({
      where: { userId: session.user.id, role: 'owner' }
    })

    if (existingAdmin) {
      return NextResponse.json({ error: 'You already manage a school' }, { status: 400 })
    }

    // Generate unique code
    let code = generateSchoolCode()
    let codeExists = await prisma.school.findUnique({ where: { code } })
    while (codeExists) {
      code = generateSchoolCode()
      codeExists = await prisma.school.findUnique({ where: { code } })
    }

    // Create school with PENDING status
    const school = await prisma.$transaction(async (tx) => {
      const newSchool = await tx.school.create({
        data: {
          name,
          code,
          contactEmail: contactEmail || session.user.email || '',
          country,
          contactPhone,
          // Verification fields
          status: 'pending',  // IMPORTANT: Start as pending
          adminDesignation: designation,
          adminLinkedIn: linkedIn,
          adminPhone: contactPhone,
          schoolWebsite,
          schoolAddress,
          website: schoolWebsite, // Also save to website field
          address: schoolAddress, // Also save to address field
          schoolType,
          affiliation,
          studentStrength: studentStrength || null,
          // Free tier defaults
          plan: 'free',
          studentLimit: 50
        }
      })

      // Create admin record
      await tx.schoolAdmin.create({
        data: {
          userId: session.user.id,
          schoolId: newSchool.id,
          role: 'owner'
        }
      })

      // Update user role
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: 'school_admin' }
      })

      return newSchool
    })

    // TODO: Send notification email to super admin about new school registration

    return NextResponse.json({
      school,
      message: 'School registered successfully! Your account is pending verification.'
    }, { status: 201 })
  } catch (error) {
    console.error('School registration error:', error)
    return NextResponse.json({ error: 'Failed to register school' }, { status: 500 })
  }
}

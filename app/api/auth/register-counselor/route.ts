import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { code, name, email, password } = await request.json()

    // Validate required fields
    if (!code || !name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Validate the counselor code
    const pilotCode = await prisma.pilotInviteCode.findFirst({
      where: {
        code: {
          equals: code.toUpperCase(),
          mode: 'insensitive'
        },
        isActive: true,
        claimedById: null, // Not yet claimed
      }
    })

    if (!pilotCode) {
      return NextResponse.json(
        { error: 'Invalid or already claimed counselor code' },
        { status: 400 }
      )
    }

    // Check validity dates
    const now = new Date()
    if (pilotCode.validFrom && now < pilotCode.validFrom) {
      return NextResponse.json(
        { error: 'This code is not yet active.' },
        { status: 400 }
      )
    }

    if (pilotCode.validUntil && now > pilotCode.validUntil) {
      return NextResponse.json(
        { error: 'This code has expired.' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and claim code in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with counselor role
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'counselor',
        },
      })

      // Mark code as claimed by this counselor
      await tx.pilotInviteCode.update({
        where: { id: pilotCode.id },
        data: {
          claimedById: user.id,
          claimedAt: new Date(),
        },
      })

      return user
    })

    return NextResponse.json({
      success: true,
      message: 'Counselor account created successfully',
      userId: result.id,
    })

  } catch (error) {
    console.error('[auth/register-counselor] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create counselor account' },
      { status: 500 }
    )
  }
}

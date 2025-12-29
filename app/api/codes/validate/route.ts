import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Support both GET and POST for flexibility
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.toUpperCase().trim()

    console.log('[codes/validate] GET - Checking code:', code)

    if (!code || code.length < 3) {
      return NextResponse.json({ valid: false, error: 'Code too short' })
    }

    return await validateCode(code)
  } catch (error) {
    console.error('[codes/validate] GET Error:', error)
    return NextResponse.json({ valid: false, error: 'Validation error' })
  }
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const upperCode = code?.toUpperCase().trim()

    console.log('[codes/validate] POST - Checking code:', upperCode)

    if (!upperCode || upperCode.length < 3) {
      return NextResponse.json({ valid: false, error: 'Code is required' })
    }

    return await validateCode(upperCode)
  } catch (error) {
    console.error('[codes/validate] POST Error:', error)
    return NextResponse.json({ valid: false, error: 'Failed to validate code' })
  }
}

async function validateCode(code: string) {
  // Check if it's a school code (case-insensitive)
  const school = await prisma.school.findFirst({
    where: {
      code: {
        equals: code,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      status: true,
      studentLimit: true,
      _count: {
        select: { students: true }
      }
    }
  })

  if (school) {
    // Block if school is not verified
    if (school.status !== 'verified') {
      return NextResponse.json({
        valid: false,
        error: 'This school is not yet verified. Please contact your school administrator.'
      })
    }

    // Check if school has reached student limit
    if (school._count.students >= school.studentLimit) {
      return NextResponse.json({
        valid: false,
        error: 'This school has reached its student limit. Please contact your school administrator.'
      })
    }

    return NextResponse.json({
      valid: true,
      type: 'school',
      name: school.name
    })
  }

  // Check if it's a sponsor code (case-insensitive)
  const sponsor = await prisma.sponsor.findFirst({
    where: {
      code: {
        equals: code,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      status: true,
      sponsoredSeats: true,
      usedSeats: true
    }
  })

  if (sponsor) {
    // Block if sponsor is not verified
    if (sponsor.status !== 'verified') {
      return NextResponse.json({
        valid: false,
        error: 'This sponsor is not yet verified. Please contact your sponsor organization.'
      })
    }

    // Check if sponsor has available seats
    if (sponsor.usedSeats >= sponsor.sponsoredSeats) {
      return NextResponse.json({
        valid: false,
        error: 'This sponsor has reached their student limit.'
      })
    }

    return NextResponse.json({
      valid: true,
      type: 'sponsor',
      name: sponsor.name
    })
  }

  // Check if it's a pilot invite code (counselor codes like COUN-XXX) - case-insensitive
  const pilotCode = await prisma.pilotInviteCode.findFirst({
    where: {
      code: {
        equals: code,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      sourceName: true,
      sourceType: true,
      isActive: true,
      validFrom: true,
      validUntil: true,
      maxUses: true,
      currentUses: true
    }
  })

  if (pilotCode) {
    // Check if active
    if (!pilotCode.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'This code is no longer active.'
      })
    }

    // Check validity dates
    const now = new Date()
    if (pilotCode.validFrom && now < pilotCode.validFrom) {
      return NextResponse.json({
        valid: false,
        error: 'This code is not yet active.'
      })
    }

    if (pilotCode.validUntil && now > pilotCode.validUntil) {
      return NextResponse.json({
        valid: false,
        error: 'This code has expired.'
      })
    }

    // Check capacity
    if (pilotCode.maxUses && pilotCode.currentUses >= pilotCode.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'This code has reached its usage limit.'
      })
    }

    return NextResponse.json({
      valid: true,
      type: 'pilot',
      name: pilotCode.sourceName || pilotCode.name,
      pilotCodeId: pilotCode.id,
      spotsRemaining: pilotCode.maxUses ? pilotCode.maxUses - pilotCode.currentUses : null
    })
  }

  // No match found
  return NextResponse.json({ valid: false, error: 'Invalid code' })
}

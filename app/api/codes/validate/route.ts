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
  // Check if it's a school code
  const school = await prisma.school.findUnique({
    where: { code },
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

  console.log('[codes/validate] School found:', school)

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

  // Check if it's a sponsor code
  const sponsor = await prisma.sponsor.findUnique({
    where: { code },
    select: {
      id: true,
      name: true,
      status: true,
      sponsoredSeats: true,
      usedSeats: true
    }
  })

  console.log('[codes/validate] Sponsor found:', sponsor)

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

  // No match found
  console.log('[codes/validate] No match found for code:', code)
  return NextResponse.json({ valid: false, error: 'Invalid code' })
}

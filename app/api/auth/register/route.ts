import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, schoolCode, sponsorCode, grade, section } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Validate school code if provided
    let school = null
    if (schoolCode) {
      school = await prisma.school.findUnique({
        where: { code: schoolCode.toUpperCase() }
      })

      if (!school) {
        return NextResponse.json(
          { error: 'Invalid school code. Please check and try again.' },
          { status: 400 }
        )
      }

      // Check student limit
      const currentStudentCount = await prisma.schoolStudent.count({
        where: { schoolId: school.id }
      })

      if (currentStudentCount >= school.studentLimit) {
        return NextResponse.json(
          { error: 'This school has reached its student limit. Please contact your school administrator.' },
          { status: 400 }
        )
      }
    }

    // Validate sponsor code if provided
    let sponsor = null
    if (sponsorCode) {
      sponsor = await prisma.sponsor.findUnique({
        where: { code: sponsorCode.toUpperCase() }
      })

      if (!sponsor) {
        return NextResponse.json(
          { error: 'Invalid sponsor code. Please check and try again.' },
          { status: 400 }
        )
      }

      // Check sponsor seat limit
      if (sponsor.usedSeats >= sponsor.sponsoredSeats) {
        return NextResponse.json(
          { error: 'This sponsor has reached their student limit.' },
          { status: 400 }
        )
      }
    }

    // Determine role based on codes
    let role = 'student'
    if (schoolCode && school) {
      role = 'school_student'
    } else if (sponsorCode && sponsor) {
      role = 'sponsored_student'
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and related records
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role  // Set the role
        }
      })

      // Link to school if code provided
      if (school) {
        await tx.schoolStudent.create({
          data: {
            userId: newUser.id,
            schoolId: school.id,
            grade: grade || null,
            section: section || null
          }
        })
      }

      // Link to sponsor if code provided
      if (sponsor) {
        await tx.sponsoredStudent.create({
          data: {
            userId: newUser.id,
            sponsorId: sponsor.id
          }
        })

        // Increment sponsor used seats
        await tx.sponsor.update({
          where: { id: sponsor.id },
          data: { usedSeats: { increment: 1 } }
        })
      }

      return newUser
    })

    return NextResponse.json(
      { message: 'Account created successfully', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

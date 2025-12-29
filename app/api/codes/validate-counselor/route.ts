import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.toUpperCase().trim()

    if (!code || code.length < 4) {
      return NextResponse.json({ valid: false, error: 'Code too short' })
    }

    // Find the pilot invite code (case-insensitive)
    const pilotCode = await prisma.pilotInviteCode.findFirst({
      where: {
        code: {
          equals: code,
          mode: 'insensitive'
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sourceName: true,
        sourceType: true,
        claimedById: true,
        claimedAt: true,
        validFrom: true,
        validUntil: true,
      }
    })

    if (!pilotCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid counselor code'
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

    // Check if already claimed by a counselor
    if (pilotCode.claimedById) {
      return NextResponse.json({
        valid: true,
        alreadyClaimed: true,
        message: 'This code has already been registered. Please sign in instead.',
      })
    }

    // Valid and unclaimed
    return NextResponse.json({
      valid: true,
      alreadyClaimed: false,
      name: pilotCode.sourceName || pilotCode.name,
      codeType: pilotCode.sourceType,
    })

  } catch (error) {
    console.error('[codes/validate-counselor] Error:', error)
    return NextResponse.json({
      valid: false,
      error: 'Failed to validate code'
    }, { status: 500 })
  }
}

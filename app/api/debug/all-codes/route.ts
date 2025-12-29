import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const schools = await prisma.school.findMany({
    select: { id: true, name: true, code: true, status: true }
  })

  const sponsors = await prisma.sponsor.findMany({
    select: { id: true, name: true, code: true }
  })

  const pilotCodes = await prisma.pilotInviteCode.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
      currentUses: true,
      maxUses: true,
      validUntil: true
    }
  })

  return NextResponse.json({
    schools,
    sponsors,
    pilotCodes,
    message: 'Use these codes to test join functionality'
  })
}

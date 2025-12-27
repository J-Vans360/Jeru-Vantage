import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSuperAdmin } from '@/lib/super-admin'
import { prisma } from '@/lib/prisma'

async function verifySuperAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const access = await checkSuperAdmin(session.user.id || '', session.user.email)
  if (!access.isSuper) return null

  return access
}

export async function GET() {
  const access = await verifySuperAdmin()
  if (!access) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all settings from database
  const settingsRecords = await prisma.systemSetting.findMany()

  // Convert to object
  const settings: Record<string, boolean> = {}
  for (const record of settingsRecords) {
    settings[record.key] = record.value === 'true'
  }

  return NextResponse.json({ settings })
}

export async function POST(request: Request) {
  const access = await verifySuperAdmin()
  if (!access || access.role === 'support') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const newSettings = await request.json()

  // Upsert each setting
  for (const [key, value] of Object.entries(newSettings)) {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })
  }

  return NextResponse.json({ success: true })
}

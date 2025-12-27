import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Not logged in', session: null })
  }

  const result = await checkSuperAdmin(
    session.user.id || '',
    session.user.email || ''
  )

  return NextResponse.json({
    session: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    },
    superAdminCheck: result,
    ownerEmails: ['reacher.ca@gmail.com', 'bijilyr@gmail.com'],
    emailMatch: ['reacher.ca@gmail.com', 'bijilyr@gmail.com'].map(e => e.toLowerCase()).includes((session.user.email || '').toLowerCase())
  })
}

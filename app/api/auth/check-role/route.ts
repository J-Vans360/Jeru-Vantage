import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    console.log('[check-role] ========== START ==========')
    console.log('[check-role] Session:', JSON.stringify(session?.user, null, 2))

    if (!session?.user) {
      console.log('[check-role] No session user')
      return NextResponse.json({ role: 'guest', redirect: '/login' })
    }

    const userId = session.user.id
    const email = session.user.email

    if (!userId || !email) {
      console.log('[check-role] Missing userId or email')
      return NextResponse.json({ role: 'guest', redirect: '/login' })
    }

    console.log('[check-role] User ID:', userId)
    console.log('[check-role] Email:', email)

    // 1. Check super admin FIRST
    console.log('[check-role] Checking super admin...')
    const superAccess = await checkSuperAdmin(userId, email)

    console.log('[check-role] Super admin result:', superAccess.isSuper, superAccess.role)

    if (superAccess.isSuper) {
      console.log('[check-role] ✅ REDIRECTING TO /super-admin')
      return NextResponse.json({
        role: 'super_admin',
        superRole: superAccess.role,
        redirect: '/super-admin'
      })
    }

    // 2. Check school admin
    console.log('[check-role] Checking school admin...')
    const schoolAdmin = await prisma.schoolAdmin.findFirst({
      where: { userId }
    })

    if (schoolAdmin) {
      console.log('[check-role] ✅ User is school admin')
      return NextResponse.json({
        role: 'school_admin',
        redirect: '/admin'
      })
    }

    // 3. Check sponsor admin
    console.log('[check-role] Checking sponsor admin...')
    const sponsorAdmin = await prisma.sponsorAdmin.findFirst({
      where: { userId }
    })

    if (sponsorAdmin) {
      console.log('[check-role] ✅ User is sponsor admin')
      return NextResponse.json({
        role: 'sponsor_admin',
        redirect: '/sponsor'
      })
    }

    // 4. Default to student
    console.log('[check-role] Default: student')
    console.log('[check-role] ========== END ==========')
    return NextResponse.json({
      role: 'student',
      redirect: '/assessment'
    })
  } catch (error) {
    console.error('[check-role] ERROR:', error)
    return NextResponse.json({
      role: 'student',
      redirect: '/assessment'
    })
  }
}

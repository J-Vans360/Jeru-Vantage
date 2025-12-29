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

    // 2. Check if user is a counselor (has claimed a pilot code)
    console.log('[check-role] Checking counselor...')
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (user?.role === 'counselor') {
      // Get the counselor's claimed code
      const claimedCode = await prisma.pilotInviteCode.findFirst({
        where: { claimedById: userId }
      })

      console.log('[check-role] ✅ User is counselor')
      return NextResponse.json({
        role: 'counselor',
        codeId: claimedCode?.id,
        redirect: '/counselor'
      })
    }

    // 3. Check school admin
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

    // 4. Check sponsor admin
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

    // 5. Check if user has completed their student profile
    console.log('[check-role] Checking student profile...')
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { completed: true }
    })

    // 6. Check if user signed up with a pilot code
    console.log('[check-role] Checking pilot code usage...')
    const pilotCodeUsage = await prisma.pilotCodeUsage.findUnique({
      where: { userId },
      include: {
        code: {
          select: {
            sourceType: true
          }
        }
      }
    })

    const isPilotUser = !!pilotCodeUsage
    const hasCompletedProfile = studentProfile?.completed === true

    console.log('[check-role] Profile completed:', hasCompletedProfile)
    console.log('[check-role] Is pilot user:', isPilotUser)

    // If profile is not complete, redirect to profile page first
    if (!hasCompletedProfile) {
      console.log('[check-role] ✅ Profile incomplete - redirecting to /profile')
      return NextResponse.json({
        role: isPilotUser ? 'pilot_student' : 'student',
        pilotSourceType: pilotCodeUsage?.code.sourceType,
        profileComplete: false,
        redirect: '/profile'
      })
    }

    // Profile is complete - redirect to dashboard
    console.log('[check-role] ✅ Profile complete - redirecting to /dashboard')
    console.log('[check-role] ========== END ==========')
    return NextResponse.json({
      role: isPilotUser ? 'pilot_student' : 'student',
      pilotSourceType: pilotCodeUsage?.code.sourceType,
      profileComplete: true,
      redirect: '/dashboard'
    })
  } catch (error) {
    console.error('[check-role] ERROR:', error)
    return NextResponse.json({
      role: 'student',
      redirect: '/assessment'
    })
  }
}

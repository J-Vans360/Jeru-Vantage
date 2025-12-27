import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSuperAdmin } from '@/lib/super-admin'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSuperAdmin(session.user.id, session.user.email)

    if (!access.isSuper || !access.permissions.editLimits) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { assessmentLimit, reportLimit, customPricing } = await request.json()

    // Upsert the override
    const override = await prisma.schoolOverride.upsert({
      where: { schoolId: id },
      create: {
        schoolId: id,
        customAssessmentLimit: assessmentLimit,
        customReportLimit: reportLimit,
        customMonthlyPrice: customPricing?.price || null,
        discountPercent: customPricing?.discountPercent || null,
        discountReason: customPricing?.discountReason || null,
        createdBy: session.user.id
      },
      update: {
        customAssessmentLimit: assessmentLimit,
        customReportLimit: reportLimit,
        customMonthlyPrice: customPricing?.price || null,
        discountPercent: customPricing?.discountPercent || null,
        discountReason: customPricing?.discountReason || null
      }
    })

    // Also update the school's student limit directly
    await prisma.school.update({
      where: { id },
      data: { studentLimit: assessmentLimit }
    })

    // Add a note about the change
    await prisma.adminNote.create({
      data: {
        entityType: 'school',
        entityId: id,
        note: `Limits updated: ${assessmentLimit} assessments, ${reportLimit} reports`,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({ override })
  } catch (error) {
    console.error('Update school limits error:', error)
    return NextResponse.json({ error: 'Failed to update limits' }, { status: 500 })
  }
}

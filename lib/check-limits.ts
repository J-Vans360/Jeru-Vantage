import { prisma } from './prisma'

export interface LimitCheckResult {
  allowed: boolean
  reason?: string
}

/**
 * Check if a user is allowed to generate an AI Jeru Report
 * Free tier schools don't get AI reports - only paid plans include them
 */
export async function canGenerateReport(userId: string): Promise<LimitCheckResult> {
  // Check if user is part of a school
  const schoolStudent = await prisma.schoolStudent.findFirst({
    where: { userId },
    include: {
      school: {
        include: { override: true }
      }
    }
  })

  if (schoolStudent) {
    const school = schoolStudent.school

    // Check school status
    if (school.status !== 'verified') {
      return { allowed: false, reason: 'School is not verified yet' }
    }

    // Check if school has paid plan or report limit
    // Free tier = 0 reports by default
    const reportLimit = school.override?.customReportLimit || 0

    // If they have a paid plan, check the plan limits
    if (school.plan !== 'free' && reportLimit === 0) {
      // Paid plans get reports - check plan-specific limits
      // For now, allow if they have any paid plan
      return { allowed: true }
    }

    if (reportLimit === 0) {
      return {
        allowed: false,
        reason: 'AI Reports are not included in the free tier. Please contact your school administrator to upgrade.'
      }
    }

    // Count used reports for this school
    const schoolStudentIds = await prisma.schoolStudent.findMany({
      where: { schoolId: school.id },
      select: { userId: true }
    })
    const userIds = schoolStudentIds.map(s => s.userId)

    const usedReports = await prisma.jeruReport.count({
      where: {
        userId: { in: userIds }
      }
    })

    if (usedReports >= reportLimit) {
      return {
        allowed: false,
        reason: 'Report limit reached. Please contact your school administrator to upgrade.'
      }
    }

    return { allowed: true }
  }

  // Check if user is sponsored
  const sponsoredStudent = await prisma.sponsoredStudent.findFirst({
    where: { userId },
    include: { sponsor: true }
  })

  if (sponsoredStudent) {
    const sponsor = sponsoredStudent.sponsor

    // Check sponsor status
    if (sponsor.status !== 'verified') {
      return { allowed: false, reason: 'Sponsor organization is not verified yet' }
    }

    // Sponsors typically include reports in their sponsorship
    return { allowed: true }
  }

  // Individual student - check if they've paid or have access
  // For now, allow individual students to generate reports
  // This will be gated by payment in the future
  return { allowed: true }
}

/**
 * Check if a school can accept more students
 */
export async function canSchoolAcceptStudent(schoolId: string): Promise<LimitCheckResult> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      override: true,
      _count: {
        select: { students: true }
      }
    }
  })

  if (!school) {
    return { allowed: false, reason: 'School not found' }
  }

  if (school.status !== 'verified') {
    return { allowed: false, reason: 'School is not verified yet' }
  }

  // Check custom limit or default limit
  const studentLimit = school.override?.customAssessmentLimit || school.studentLimit

  if (school._count.students >= studentLimit) {
    return {
      allowed: false,
      reason: `School has reached its student limit (${studentLimit}). Please upgrade to add more students.`
    }
  }

  return { allowed: true }
}

/**
 * Check if a sponsor can accept more students
 */
export async function canSponsorAcceptStudent(sponsorId: string): Promise<LimitCheckResult> {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId }
  })

  if (!sponsor) {
    return { allowed: false, reason: 'Sponsor not found' }
  }

  if (sponsor.status !== 'verified') {
    return { allowed: false, reason: 'Sponsor is not verified yet' }
  }

  if (sponsor.usedSeats >= sponsor.sponsoredSeats) {
    return {
      allowed: false,
      reason: `Sponsor has reached their sponsored seat limit (${sponsor.sponsoredSeats}).`
    }
  }

  return { allowed: true }
}

/**
 * Get remaining capacity for a school
 */
export async function getSchoolCapacity(schoolId: string): Promise<{
  total: number
  used: number
  remaining: number
  reportLimit: number
  reportsUsed: number
}> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      override: true,
      _count: {
        select: { students: true }
      }
    }
  })

  if (!school) {
    return { total: 0, used: 0, remaining: 0, reportLimit: 0, reportsUsed: 0 }
  }

  const total = school.override?.customAssessmentLimit || school.studentLimit
  const used = school._count.students
  const remaining = Math.max(0, total - used)

  // Count reports
  const schoolStudentIds = await prisma.schoolStudent.findMany({
    where: { schoolId: school.id },
    select: { userId: true }
  })
  const userIds = schoolStudentIds.map(s => s.userId)

  const reportsUsed = await prisma.jeruReport.count({
    where: {
      userId: { in: userIds }
    }
  })

  const reportLimit = school.override?.customReportLimit || (school.plan === 'free' ? 0 : 999)

  return { total, used, remaining, reportLimit, reportsUsed }
}

import { prisma } from './prisma';

// Generate unique school code
export function generateSchoolCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if user is admin of any school
export async function getAdminSchool(userId: string) {
  const adminRecord = await prisma.schoolAdmin.findFirst({
    where: { userId },
    include: { school: true },
  });
  return adminRecord;
}

// Check if user is admin of specific school
export async function isSchoolAdmin(userId: string, schoolId: string) {
  const admin = await prisma.schoolAdmin.findUnique({
    where: { userId_schoolId: { userId, schoolId } },
  });
  return admin;
}

// Check if admin can view a student
export async function canViewStudent(adminUserId: string, studentUserId: string) {
  const adminSchool = await getAdminSchool(adminUserId);
  if (!adminSchool) return false;

  const studentInSchool = await prisma.schoolStudent.findFirst({
    where: {
      userId: studentUserId,
      schoolId: adminSchool.schoolId,
    },
  });
  return !!studentInSchool;
}

// Get school dashboard stats
export async function getSchoolStats(schoolId: string) {
  const totalStudents = await prisma.schoolStudent.count({
    where: { schoolId },
  });

  const studentIds = await prisma.schoolStudent.findMany({
    where: { schoolId },
    select: { userId: true },
  });

  const userIds = studentIds.map((s) => s.userId);

  // Students who completed all assessments
  const completedAssessments = await prisma.assessmentResult.groupBy({
    by: ['userId'],
    where: { userId: { in: userIds } },
    _count: { id: true },
  });

  const completedStudents = completedAssessments.filter((a) => a._count.id >= 10).length;

  // Students with Jeru reports
  const reportsGenerated = await prisma.jeruReport.count({
    where: { userId: { in: userIds } },
  });

  return {
    totalStudents,
    completedStudents,
    reportsGenerated,
    pendingStudents: totalStudents - completedStudents,
    completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
  };
}

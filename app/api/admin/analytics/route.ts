import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminSchool } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRecord = await getAdminSchool(session.user.id);
    if (!adminRecord) {
      return NextResponse.json({ error: 'Not a school admin' }, { status: 403 });
    }

    // Get all students in school
    const schoolStudents = await prisma.schoolStudent.findMany({
      where: { schoolId: adminRecord.schoolId },
      include: { user: true },
    });

    const studentUserIds = schoolStudents.map((s) => s.userId);

    // Completion by grade
    const grades = ['9', '10', '11', '12'];
    const completionByGrade = await Promise.all(
      grades.map(async (grade) => {
        const studentsInGrade = schoolStudents.filter((s) => s.grade === grade);
        const studentIds = studentsInGrade.map((s) => s.userId);

        let completed = 0;
        for (const id of studentIds) {
          const count = await prisma.assessmentResult.count({
            where: { userId: id },
          });
          if (count >= 10) completed++;
        }

        return {
          grade,
          completed,
          total: studentsInGrade.length,
        };
      })
    );

    // Holland Code Distribution (placeholder - would need real data analysis)
    const hollandCodes = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
    const totalStudents = studentUserIds.length || 1;
    const hollandCodeDistribution = hollandCodes
      .map((code) => ({
        code,
        count: Math.floor(Math.random() * totalStudents),
        percentage: Math.floor(Math.random() * 30) + 10,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Top strengths (placeholder data)
    const topStrengths = [
      { name: 'Logical-Mathematical Intelligence', count: Math.floor(totalStudents * 0.6) },
      { name: 'Critical Thinking', count: Math.floor(totalStudents * 0.5) },
      { name: 'Technology Literacy', count: Math.floor(totalStudents * 0.45) },
      { name: 'Visual-Spatial Intelligence', count: Math.floor(totalStudents * 0.4) },
      { name: 'Information Literacy', count: Math.floor(totalStudents * 0.35) },
    ];

    // Development areas (placeholder data)
    const topDevelopmentAreas = [
      { name: 'Initiative', count: Math.floor(totalStudents * 0.5) },
      { name: 'Social Skills', count: Math.floor(totalStudents * 0.45) },
      { name: 'Study Habits', count: Math.floor(totalStudents * 0.4) },
      { name: 'Writing & Research', count: Math.floor(totalStudents * 0.35) },
      { name: 'Productivity', count: Math.floor(totalStudents * 0.3) },
    ];

    // Country preferences (placeholder)
    const countryPreferences = [
      { country: 'USA', count: Math.floor(totalStudents * 0.4), percentage: 40 },
      { country: 'UK', count: Math.floor(totalStudents * 0.25), percentage: 25 },
      { country: 'Netherlands', count: Math.floor(totalStudents * 0.15), percentage: 15 },
      { country: 'India', count: Math.floor(totalStudents * 0.12), percentage: 12 },
      { country: 'Singapore', count: Math.floor(totalStudents * 0.08), percentage: 8 },
    ];

    return NextResponse.json({
      completionByGrade,
      hollandCodeDistribution,
      topStrengths,
      topDevelopmentAreas,
      countryPreferences,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}

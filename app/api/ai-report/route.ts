import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if report already exists
    const existingReport = await prisma.aiReport.findUnique({
      where: { userId: session.user.id },
    });

    if (existingReport?.isGenerated) {
      return NextResponse.json({
        report: existingReport.reportContent,
        hollandCode: existingReport.hollandCode,
        downloadUnlocked: existingReport.downloadUnlocked,
      });
    }

    // Get pilot assessment data for report generation
    const pilotAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
    });

    if (!pilotAssessment || pilotAssessment.status !== 'COMPLETED') {
      return NextResponse.json({
        error: 'Complete the assessment first'
      }, { status: 400 });
    }

    const domainScores = pilotAssessment.domainScores as Record<string, number> | null;

    // Calculate Holland Code from domain scores
    const hollandMapping: Record<string, string> = {
      realistic: 'R',
      investigative: 'I',
      artistic: 'A',
      social: 'S',
      enterprising: 'E',
      conventional: 'C',
    };

    let hollandCode = 'RAE'; // Default
    if (domainScores) {
      const hollandScores = Object.entries(domainScores)
        .filter(([key]) => hollandMapping[key])
        .map(([key, score]) => ({ code: hollandMapping[key], score }))
        .sort((a, b) => b.score - a.score);

      if (hollandScores.length >= 3) {
        hollandCode = hollandScores.slice(0, 3).map(h => h.code).join('');
      }
    }

    // Generate report content (simplified version without OpenAI for now)
    const reportContent = generateReportContent(hollandCode, domainScores);

    // Save or update the report
    const report = await prisma.aiReport.upsert({
      where: { userId: session.user.id },
      update: {
        reportContent,
        hollandCode,
        isGenerated: true,
        generatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        reportContent,
        hollandCode,
        isGenerated: true,
        generatedAt: new Date(),
      },
    });

    return NextResponse.json({
      report: report.reportContent,
      hollandCode: report.hollandCode,
      downloadUnlocked: report.downloadUnlocked,
    });
  } catch (error) {
    console.error('AI report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

function generateReportContent(hollandCode: string, domainScores: Record<string, number> | null) {
  // Career matches based on Holland Code
  const careerMatches: Record<string, { title: string; match: number; description: string }[]> = {
    'RAE': [
      { title: 'Mechanical Engineer', match: 92, description: 'Design and build mechanical systems' },
      { title: 'Architect', match: 88, description: 'Create innovative building designs' },
      { title: 'Product Designer', match: 85, description: 'Develop user-centered products' },
    ],
    'RIA': [
      { title: 'Software Engineer', match: 94, description: 'Build technology solutions' },
      { title: 'Data Scientist', match: 90, description: 'Analyze complex data patterns' },
      { title: 'Research Scientist', match: 87, description: 'Conduct cutting-edge research' },
    ],
    'SAE': [
      { title: 'Marketing Manager', match: 91, description: 'Lead creative marketing campaigns' },
      { title: 'Human Resources Director', match: 88, description: 'Shape organizational culture' },
      { title: 'Event Coordinator', match: 85, description: 'Create memorable experiences' },
    ],
    'AIR': [
      { title: 'UX Designer', match: 93, description: 'Design intuitive user experiences' },
      { title: 'Creative Director', match: 89, description: 'Lead creative vision and strategy' },
      { title: 'Game Designer', match: 86, description: 'Create immersive gaming experiences' },
    ],
  };

  const defaultCareers = [
    { title: 'Business Analyst', match: 88, description: 'Bridge business and technology' },
    { title: 'Project Manager', match: 85, description: 'Lead teams to success' },
    { title: 'Consultant', match: 82, description: 'Solve complex business problems' },
  ];

  // University recommendations
  const universities = [
    { name: 'University of Melbourne', program: 'Bachelor of Commerce', country: 'Australia' },
    { name: 'University of Toronto', program: 'Bachelor of Arts & Science', country: 'Canada' },
    { name: 'National University of Singapore', program: 'Bachelor of Business Administration', country: 'Singapore' },
    { name: 'University of Edinburgh', program: 'Bachelor of Science', country: 'United Kingdom' },
  ];

  // Growth areas based on lower scores
  const growthAreas = [
    { area: 'Public Speaking', tip: 'Join a debate club or take a public speaking course to build confidence.' },
    { area: 'Time Management', tip: 'Use time-blocking techniques and prioritize your most important tasks.' },
    { area: 'Networking', tip: 'Attend industry events and connect with professionals on LinkedIn.' },
  ];

  return {
    careerNarrative: `Based on your ${hollandCode} profile, you show a strong combination of practical skills, analytical thinking, and creative problem-solving abilities. Your assessment reveals that you thrive when working on tangible projects that allow you to see real-world results.

Your unique blend of interests positions you well for careers that combine technical expertise with creative thinking. You're likely to excel in roles that require both hands-on work and strategic planning.

We recommend exploring careers that allow you to build, create, and innovate while also leveraging your natural leadership abilities.`,
    careerMatches: careerMatches[hollandCode] || defaultCareers,
    universities,
    growthAreas,
    domainScores,
  };
}

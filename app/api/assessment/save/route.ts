import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sectionId, answers, scores } = body;

    // Validate required fields
    if (!userId || !sectionId || !answers || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Map sectionId to partName and domainName
    const sectionMapping: Record<string, { partName: string; domainName: string }> = {
      'part-a-s1': { partName: 'Part A', domainName: 'Personality Architecture' },
      'part-a-s2': { partName: 'Part A', domainName: 'Values & Interests' },
      'part-a-s3': { partName: 'Part A', domainName: 'Career Interests (Holland Code)' },
      'part-a-s4': { partName: 'Part A', domainName: 'Multiple Intelligences' },
      'part-b-s1': { partName: 'Part B', domainName: 'Cognitive Style' },
      'part-b-s2': { partName: 'Part B', domainName: 'Stress Response' },
      'part-b-s3': { partName: 'Part B', domainName: '21st Century Skills' },
      'part-b-s4': { partName: 'Part B', domainName: 'Social Check' },
      'part-c-s1': { partName: 'Part C', domainName: 'Environment & Preferences' },
      'part-c-s2': { partName: 'Part C', domainName: 'Execution & Grit' },
    };

    const mapping = sectionMapping[sectionId] || {
      partName: 'Part A',
      domainName: 'Personality & Values',
    };

    // Check if an assessment result already exists for this section
    const existingResult = await prisma.assessmentResult.findFirst({
      where: {
        userId,
        partName: mapping.partName,
        domainName: mapping.domainName,
      },
    });

    let result;

    if (existingResult) {
      // Update existing result
      result = await prisma.assessmentResult.update({
        where: {
          id: existingResult.id,
        },
        data: {
          responses: answers,
          scores: scores,
          completed: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new result
      result = await prisma.assessmentResult.create({
        data: {
          userId,
          partName: mapping.partName,
          domainName: mapping.domainName,
          responses: answers,
          scores: scores,
          completed: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error saving assessment result:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment result' },
      { status: 500 }
    );
  }
}

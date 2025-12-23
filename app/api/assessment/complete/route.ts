import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, partName, domainName, responses, scores, completed } = body;

    // Validate required fields
    if (!userId || !partName || !domainName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure user exists (for test user)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@example.com`,
        name: 'Test User',
      },
    });

    // Check if an assessment result already exists for this part
    const existingResult = await prisma.assessmentResult.findFirst({
      where: {
        userId,
        partName,
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
          domainName,
          responses,
          scores,
          completed,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new result
      result = await prisma.assessmentResult.create({
        data: {
          userId,
          partName,
          domainName,
          responses,
          scores,
          completed,
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

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

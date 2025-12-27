import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { universityId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId } = params;
    const body = await request.json();

    // TODO: Replace with actual Prisma query when Program model exists
    // const program = await prisma.program.create({
    //   data: {
    //     universityId,
    //     name: body.name,
    //     faculty: body.faculty,
    //     degree: body.degree,
    //     duration: body.duration,
    //     tuitionAnnual: body.tuitionAnnual,
    //     hollandCodes: body.hollandCodes,
    //     keywords: body.keywords,
    //     isActive: body.isActive ?? true,
    //   },
    // });

    // Log the program creation for now
    console.log('Program creation request:', {
      universityId,
      ...body,
    });

    return NextResponse.json({
      success: true,
      program: {
        id: `prog-${Date.now()}`,
        universityId,
        ...body,
      },
    });
  } catch (error) {
    console.error('Create program error:', error);
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { universityId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId } = params;

    // TODO: Replace with actual Prisma query when Program model exists
    // const programs = await prisma.program.findMany({
    //   where: { universityId },
    //   orderBy: [{ faculty: 'asc' }, { name: 'asc' }],
    // });

    // Return mock programs for now
    return NextResponse.json({
      programs: [],
    });
  } catch (error) {
    console.error('Get programs error:', error);
    return NextResponse.json({ error: 'Failed to get programs' }, { status: 500 });
  }
}

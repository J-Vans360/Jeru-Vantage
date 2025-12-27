import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { universityId: string; programId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId, programId } = params;
    const body = await request.json();

    // TODO: Replace with actual Prisma query when Program model exists
    // const program = await prisma.program.update({
    //   where: { id: programId },
    //   data: {
    //     name: body.name,
    //     faculty: body.faculty,
    //     degree: body.degree,
    //     duration: body.duration,
    //     tuitionAnnual: body.tuitionAnnual,
    //     hollandCodes: body.hollandCodes,
    //     keywords: body.keywords,
    //     isActive: body.isActive,
    //   },
    // });

    // Log the program update for now
    console.log('Program update request:', {
      universityId,
      programId,
      ...body,
    });

    return NextResponse.json({
      success: true,
      program: {
        id: programId,
        universityId,
        ...body,
      },
    });
  } catch (error) {
    console.error('Update program error:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { universityId: string; programId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId, programId } = params;

    // TODO: Replace with actual Prisma query when Program model exists
    // await prisma.program.delete({
    //   where: { id: programId },
    // });

    // Log the program deletion for now
    console.log('Program delete request:', {
      universityId,
      programId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete program error:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { universityId: string; programId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { programId } = params;

    // TODO: Replace with actual Prisma query when Program model exists
    // const program = await prisma.program.findUnique({
    //   where: { id: programId },
    // });

    return NextResponse.json({
      program: null,
    });
  } catch (error) {
    console.error('Get program error:', error);
    return NextResponse.json({ error: 'Failed to get program' }, { status: 500 });
  }
}

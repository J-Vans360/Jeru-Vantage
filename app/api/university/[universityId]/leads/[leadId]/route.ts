import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock leads data for development
const mockLeads: Record<string, { id: string; status: string; notes: string }> = {
  'lead-1': { id: 'lead-1', status: 'NEW', notes: '' },
  'lead-2': { id: 'lead-2', status: 'CONTACTED', notes: '' },
  'lead-3': { id: 'lead-3', status: 'APPLIED', notes: '' },
  'lead-4': { id: 'lead-4', status: 'ENROLLED', notes: '' },
  'lead-5': { id: 'lead-5', status: 'NEW', notes: '' },
  'lead-6': { id: 'lead-6', status: 'CONTACTED', notes: '' },
  'lead-7': { id: 'lead-7', status: 'NEW', notes: '' },
  'lead-8': { id: 'lead-8', status: 'APPLIED', notes: '' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string; leadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId, leadId } = await params;

    // TODO: Replace with actual Prisma query when StudentLead model exists
    // const lead = await prisma.studentLead.findUnique({
    //   where: {
    //     id: leadId,
    //     universityId,
    //   },
    //   include: {
    //     student: {
    //       include: {
    //         user: { select: { name: true, email: true } },
    //         profile: { select: { country: true, degreeLevel: true } },
    //         assessmentResults: {
    //           where: { domainName: 'Career Interests (Holland Code)' },
    //           select: { scores: true },
    //         },
    //       },
    //     },
    //     program: { select: { id: true, name: true } },
    //   },
    // });

    const lead = mockLeads[leadId];

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json({ error: 'Failed to get lead' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string; leadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId, leadId } = await params;
    const body = await request.json();

    // Validate status if provided
    const validStatuses = ['NEW', 'CONTACTED', 'APPLIED', 'ENROLLED'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // TODO: Replace with actual Prisma query when StudentLead model exists
    // const lead = await prisma.studentLead.update({
    //   where: {
    //     id: leadId,
    //     universityId,
    //   },
    //   data: {
    //     ...(body.status && { status: body.status }),
    //     ...(body.notes !== undefined && { notes: body.notes }),
    //     updatedAt: new Date(),
    //   },
    // });

    // Log status change for audit trail
    console.log('Lead status update:', {
      universityId,
      leadId,
      previousStatus: mockLeads[leadId]?.status,
      newStatus: body.status,
      updatedBy: session.user.id,
      updatedAt: new Date().toISOString(),
    });

    // Update mock data
    if (mockLeads[leadId]) {
      if (body.status) mockLeads[leadId].status = body.status;
      if (body.notes !== undefined) mockLeads[leadId].notes = body.notes;
    }

    return NextResponse.json({
      success: true,
      lead: mockLeads[leadId] || { id: leadId, ...body },
    });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string; leadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId, leadId } = await params;

    // TODO: Replace with actual Prisma query when StudentLead model exists
    // Note: Consider soft delete for audit purposes
    // await prisma.studentLead.delete({
    //   where: {
    //     id: leadId,
    //     universityId,
    //   },
    // });

    console.log('Lead deleted:', {
      universityId,
      leadId,
      deletedBy: session.user.id,
      deletedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}

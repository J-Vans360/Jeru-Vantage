import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email/sender';

// Mock lead data for development
const mockLeads: Record<
  string,
  {
    id: string;
    studentId: string;
    universityId: string;
    universityName: string;
    studentName: string;
    studentEmail: string;
    consentWithdrawnAt: Date | null;
    status: string;
  }
> = {
  'lead-1': {
    id: 'lead-1',
    studentId: 'student-1',
    universityId: 'univ-1',
    universityName: 'University of Melbourne',
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    consentWithdrawnAt: null,
    status: 'NEW',
  },
  'lead-2': {
    id: 'lead-2',
    studentId: 'student-1',
    universityId: 'univ-2',
    universityName: 'University of Toronto',
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    consentWithdrawnAt: null,
    status: 'CONTACTED',
  },
  'lead-3': {
    id: 'lead-3',
    studentId: 'student-1',
    universityId: 'univ-3',
    universityName: 'National University of Singapore',
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    consentWithdrawnAt: null,
    status: 'ENROLLED',
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId } = params;

    // TODO: Replace with actual Prisma queries when models exist
    // const lead = await prisma.studentLead.findUnique({
    //   where: { id: leadId },
    //   include: {
    //     student: {
    //       include: {
    //         user: { select: { name: true, email: true } },
    //       },
    //     },
    //     university: {
    //       select: { name: true, id: true },
    //     },
    //   },
    // });

    const lead = mockLeads[leadId];

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // TODO: Verify the student belongs to this user
    // const student = await prisma.student.findFirst({
    //   where: { userId: session.user.id },
    // });
    //
    // if (!student || lead.studentId !== student.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    // Check if already withdrawn
    if (lead.consentWithdrawnAt) {
      return NextResponse.json({ error: 'Consent already withdrawn' }, { status: 400 });
    }

    // Check if enrolled (cannot withdraw after enrollment)
    if (lead.status === 'ENROLLED') {
      return NextResponse.json(
        { error: 'Cannot withdraw consent after enrollment' },
        { status: 400 }
      );
    }

    // TODO: Update the lead in database
    // await prisma.studentLead.update({
    //   where: { id: leadId },
    //   data: {
    //     consentWithdrawnAt: new Date(),
    //     status: 'CONSENT_WITHDRAWN',
    //   },
    // });

    // Update mock data
    mockLeads[leadId].consentWithdrawnAt = new Date();
    mockLeads[leadId].status = 'CONSENT_WITHDRAWN';

    console.log('Consent withdrawn:', {
      leadId,
      universityName: lead.universityName,
      withdrawnAt: new Date().toISOString(),
      withdrawnBy: session.user.id,
    });

    // TODO: Get university admin email
    // const universityAdmin = await prisma.user.findFirst({
    //   where: {
    //     universityId: lead.universityId,
    //     role: 'UNIVERSITY_ADMIN',
    //   },
    // });

    // Send notification to university
    await sendEmail({
      to: 'university-admin@example.com', // Replace with actual university admin email
      subject: 'Data Deletion Request - Student Consent Withdrawn',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Consent Withdrawal Notice</h2>
          <p>A student has withdrawn their consent to share data with <strong>${lead.universityName}</strong>.</p>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Action Required:</strong> Please delete all personal data for this student within 30 days as per data protection regulations.
            </p>
          </div>

          <p><strong>Lead ID:</strong> ${lead.id}</p>
          <p><strong>Date of Withdrawal:</strong> ${new Date().toISOString()}</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">
            <em>This is an automated message from Jeru Vantage.</em>
          </p>
        </div>
      `,
    });

    // Send confirmation to student
    await sendEmail({
      to: lead.studentEmail,
      subject: `Consent Withdrawn - ${lead.universityName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Consent Withdrawal Confirmed</h2>
          <p>Hi ${lead.studentName},</p>
          <p>Your consent to share data with <strong>${lead.universityName}</strong> has been withdrawn.</p>
          <p>They have been notified and are required to delete your personal information within 30 days.</p>
          <p>If you change your mind, you can always reconnect with them through your assessment results.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280;">
            <em>The Jeru Vantage Team</em>
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully. The university has been notified.',
    });
  } catch (error) {
    console.error('Withdraw consent error:', error);
    return NextResponse.json({ error: 'Failed to withdraw consent' }, { status: 500 });
  }
}

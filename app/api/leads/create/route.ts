import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email/sender';
import {
  universityLeadNotificationEmail,
  studentConfirmationEmail,
} from '@/lib/email/templates';

// Mock university data until University model exists
const mockUniversities: Record<string, { name: string; adminEmail: string }> = {
  'univ-1': { name: 'University of Melbourne', adminEmail: 'admissions@unimelb.edu.au' },
  'univ-2': { name: 'University of Toronto', adminEmail: 'admissions@utoronto.ca' },
  'univ-3': { name: 'National University of Singapore', adminEmail: 'admissions@nus.edu.sg' },
};

// Mock program data until Program model exists
const mockPrograms: Record<string, { name: string }> = {
  'prog-1-1': { name: 'Bachelor of Science' },
  'prog-1-2': { name: 'Bachelor of Arts' },
  'prog-2-1': { name: 'Bachelor of Commerce' },
  'prog-2-2': { name: 'Bachelor of Engineering' },
  'prog-3-1': { name: 'Bachelor of Computing' },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, universityId, programId, matchScore, consentLevel, approvedItems } =
      await request.json();

    // Verify the user exists and owns this profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentProfile: true,
        assessmentResults: {
          where: {
            completed: true,
            domainName: { contains: 'Holland' },
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get university info (mock for now)
    const university = mockUniversities[universityId] || {
      name: 'Partner University',
      adminEmail: null,
    };

    // Get program info (mock for now)
    const program = programId ? mockPrograms[programId] : null;

    // Get Holland Code from assessment results
    const hollandResult = user.assessmentResults[0];
    const hollandCode = (hollandResult?.scores as any)?.hollandCode || null;

    // Generate temporary lead ID
    const leadId = `lead-${Date.now()}`;

    // Log the lead creation with consent details
    console.log('Lead creation request:', {
      leadId,
      userId: session.user.id,
      studentId,
      universityId,
      programId,
      matchScore,
      consentGiven: true,
      consentDate: new Date(),
      consentLevel: consentLevel || 'BASIC',
      approvedDataItems: approvedItems || [],
      userName: user.name,
      userEmail: user.email,
    });

    // TODO: When StudentLead model exists, create the lead:
    // const lead = await prisma.studentLead.create({
    //   data: {
    //     studentId,
    //     universityId,
    //     programId,
    //     consentGiven: true,
    //     consentDate: new Date(),
    //     consentLevel: consentLevel || 'BASIC',
    //     approvedDataItems: approvedItems || [],
    //     sharedProfile: true,
    //     sharedContact: true,
    //     matchScore,
    //   },
    // });

    // Send notification email to university
    if (university.adminEmail) {
      const universityEmail = universityLeadNotificationEmail({
        universityName: university.name,
        studentName: user.name || 'Student',
        studentEmail: user.email || '',
        studentCountry: user.studentProfile?.countryResidence || 'Not specified',
        matchScore,
        programName: program?.name,
        hollandCode: hollandCode || undefined,
        leadId,
      });

      await sendEmail({
        to: university.adminEmail,
        ...universityEmail,
      });
    }

    // Send confirmation email to student
    if (user.email) {
      const studentEmail = studentConfirmationEmail({
        studentName: user.name || 'there',
        universityName: university.name,
        programName: program?.name,
      });

      await sendEmail({
        to: user.email,
        ...studentEmail,
      });
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Your information has been shared. The university will contact you soon!',
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

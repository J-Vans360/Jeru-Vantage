import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Find the partner by referral code
    const partner = await prisma.referralPartner.findUnique({
      where: { referralCode: code.toUpperCase() },
      select: {
        id: true,
        name: true,
        referralCode: true,
        status: true,
        commissionRate: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { valid: false, error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    if (partner.status !== 'approved') {
      return NextResponse.json(
        { valid: false, error: 'This referral code is not active' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      partner: {
        name: partner.name,
        referralCode: partner.referralCode,
      },
    });
  } catch (error) {
    console.error('Referral validation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// POST endpoint for creating a referral when a school signs up
export async function POST(request: Request) {
  try {
    const { referralCode, schoolName, contactEmail, contactName } = await request.json();

    if (!referralCode || !schoolName || !contactEmail) {
      return NextResponse.json(
        { error: 'Referral code, school name, and contact email are required' },
        { status: 400 }
      );
    }

    // Find the partner
    const partner = await prisma.referralPartner.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
    });

    if (!partner || partner.status !== 'approved') {
      return NextResponse.json(
        { error: 'Invalid or inactive referral code' },
        { status: 400 }
      );
    }

    // Check if a referral for this email already exists
    const existingReferral = await prisma.referral.findFirst({
      where: { contactEmail: contactEmail.toLowerCase() },
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: 'A referral for this school already exists' },
        { status: 400 }
      );
    }

    // Create the referral
    const referral = await prisma.referral.create({
      data: {
        partnerId: partner.id,
        schoolName,
        contactEmail: contactEmail.toLowerCase(),
        contactName: contactName || null,
        commissionRate: partner.commissionRate,
        status: 'pending',
      },
    });

    // Update partner's total referrals count
    await prisma.referralPartner.update({
      where: { id: partner.id },
      data: {
        totalReferrals: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      referral: {
        id: referral.id,
        schoolName: referral.schoolName,
        status: referral.status,
      },
    });
  } catch (error) {
    console.error('Referral creation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

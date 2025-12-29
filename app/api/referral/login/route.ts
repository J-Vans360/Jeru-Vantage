import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.PARTNER_JWT_SECRET || process.env.NEXTAUTH_SECRET || 'partner-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the partner
    const partner = await prisma.referralPartner.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!partner) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, partner.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if partner is approved
    if (partner.status !== 'approved') {
      return NextResponse.json(
        {
          error: partner.status === 'pending'
            ? 'Your account is pending approval. Please wait for admin verification.'
            : 'Your account has been suspended. Please contact support.',
          status: partner.status
        },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        partnerId: partner.id,
        email: partner.email,
        name: partner.name,
        referralCode: partner.referralCode,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        referralCode: partner.referralCode,
        commissionRate: partner.commissionRate,
        totalEarnings: partner.totalEarnings,
        pendingEarnings: partner.pendingEarnings,
        paidEarnings: partner.paidEarnings,
        totalReferrals: partner.totalReferrals,
        successfulReferrals: partner.successfulReferrals,
      },
    });
  } catch (error) {
    console.error('Partner login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

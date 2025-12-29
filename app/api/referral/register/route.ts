import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function generateReferralCode(name: string): string {
  const prefix = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${randomPart}`;
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, organization, role, country } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if partner already exists
    const existingPartner = await prisma.referralPartner.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode(name);
    let codeExists = await prisma.referralPartner.findUnique({
      where: { referralCode },
    });

    // Ensure uniqueness
    while (codeExists) {
      referralCode = generateReferralCode(name);
      codeExists = await prisma.referralPartner.findUnique({
        where: { referralCode },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the partner
    const partner = await prisma.referralPartner.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        organization: organization || null,
        role: role || null,
        country: country || null,
        referralCode,
        commissionRate: 0.10, // 10% default commission
        status: 'pending', // Requires admin approval
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Your account is pending approval.',
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        referralCode: partner.referralCode,
        status: partner.status,
      },
    });
  } catch (error) {
    console.error('Partner registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

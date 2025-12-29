import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Save the hashed token to database
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: hashedToken,
        expires,
      },
    });

    // Build the reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

    // TODO: Send email with reset link
    // For now, log the reset URL in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset URL:', resetUrl);
    }

    // In production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    //
    // Example with a generic sendEmail function:
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password - Jeru Vantage',
    //   html: `
    //     <h1>Password Reset Request</h1>
    //     <p>You requested to reset your password. Click the link below to set a new password:</p>
    //     <a href="${resetUrl}">Reset Password</a>
    //     <p>This link will expire in 1 hour.</p>
    //     <p>If you didn't request this, you can safely ignore this email.</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
      // Only include resetUrl in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get chat usage
    const chatUsage = await prisma.aiChatUsage.findUnique({
      where: { userId: session.user.id },
    });

    // Get chat messages
    const messages = await prisma.aiChatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      messages,
      questionsUsed: chatUsage?.questionsUsed || 0,
      maxQuestions: chatUsage?.maxQuestions || 3,
    });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const MAX_QUESTIONS = 3;

// Only initialize OpenAI client if API key exists
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Build comprehensive student context for AI chat
async function buildStudentContext(userId: string): Promise<string> {
  // Get pilot assessment
  const pilotAssessment = await prisma.pilotAssessment.findUnique({
    where: { userId },
  });

  // Get student profile
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { subjects: true },
  });

  // Get Jeru report if exists
  const jeruReport = await prisma.jeruReport.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // Build context string
  const contextParts: string[] = [];

  // Student name and basic info
  const studentName = profile?.studentName || 'Student';
  contextParts.push(`Student Name: ${studentName}`);

  if (profile) {
    contextParts.push(`Grade: ${profile.currentGrade || 'Not specified'}`);
    contextParts.push(`Target Entry Year: ${profile.targetEntryYear || 'Not specified'}`);
    contextParts.push(`Country of Residence: ${profile.countryResidence || 'Not specified'}`);
    contextParts.push(`Citizenship: ${profile.citizenshipPrimary || 'Not specified'}`);

    const destinations = [
      profile.destinationCountry1,
      profile.destinationCountry2,
      profile.destinationCountry3,
    ].filter(Boolean);
    if (destinations.length > 0) {
      contextParts.push(`Preferred Destinations: ${destinations.join(', ')}`);
    }

    const careerInterests = [
      profile.careerInterest1,
      profile.careerInterest2,
      profile.careerInterest3,
    ].filter(Boolean);
    if (careerInterests.length > 0) {
      contextParts.push(`Career Interests: ${careerInterests.join(', ')}`);
    }

    if (profile.annualBudgetRange) {
      contextParts.push(`Annual Budget: ${profile.annualBudgetRange}`);
    }
  }

  // Pilot Assessment Results
  if (pilotAssessment?.status === 'COMPLETED') {
    contextParts.push('\n--- PILOT ASSESSMENT RESULTS ---');

    const domainScores = pilotAssessment.domainScores as Record<string, any>[] | null;
    const subDomainScores = pilotAssessment.subDomainScores as Record<string, any>[] | null;

    if (domainScores && Array.isArray(domainScores)) {
      contextParts.push('\nDomain Scores:');
      domainScores.forEach((domain: { name?: string; score?: number }) => {
        contextParts.push(`- ${domain.name || 'Unknown'}: ${domain.score || 0}%`);
      });
    }

    if (subDomainScores && Array.isArray(subDomainScores)) {
      // Extract Holland Code (RIASEC)
      const hollandSubs = subDomainScores
        .filter((s: { domainId?: string }) => s.domainId === 'holland')
        .sort((a: { score?: number }, b: { score?: number }) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);

      const riasecMap: Record<string, string> = {
        realistic: 'R - Realistic',
        investigative: 'I - Investigative',
        artistic: 'A - Artistic',
        social: 'S - Social',
        enterprising: 'E - Enterprising',
        conventional: 'C - Conventional',
      };

      if (hollandSubs.length > 0) {
        contextParts.push('\nHolland Code (Top 3):');
        hollandSubs.forEach((s: { id?: string; score?: number }) => {
          const typeName = riasecMap[s.id || ''] || s.id;
          contextParts.push(`- ${typeName}: ${s.score || 0}%`);
        });
      }

      // Top 5 strengths
      const topStrengths = [...subDomainScores]
        .sort((a: { score?: number }, b: { score?: number }) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);

      if (topStrengths.length > 0) {
        contextParts.push('\nTop 5 Strengths:');
        topStrengths.forEach((s: { name?: string; score?: number }, idx: number) => {
          contextParts.push(`${idx + 1}. ${s.name || 'Unknown'}: ${s.score || 0}%`);
        });
      }

      // Areas for growth (lowest 5)
      const growthAreas = [...subDomainScores]
        .sort((a: { score?: number }, b: { score?: number }) => (a.score || 0) - (b.score || 0))
        .slice(0, 5);

      if (growthAreas.length > 0) {
        contextParts.push('\nAreas for Growth:');
        growthAreas.forEach((s: { name?: string; score?: number }, idx: number) => {
          contextParts.push(`${idx + 1}. ${s.name || 'Unknown'}: ${s.score || 0}%`);
        });
      }
    }
  }

  // Include summary of Jeru report if exists
  if (jeruReport?.reportContent) {
    contextParts.push('\n--- AI JERU REPORT SUMMARY ---');
    // Extract just the first 2000 characters to keep context manageable
    const reportSummary = jeruReport.reportContent.substring(0, 2000);
    contextParts.push(reportSummary);
  }

  return contextParts.join('\n');
}

const AI_CHAT_SYSTEM_PROMPT = `You are Jeru, a friendly and wise AI career counselor at Jeru Vantage. You're chatting with a high school student about their career and university options based on their pilot assessment results.

TONE & STYLE:
- Warm, encouraging, but honest
- Use their name when appropriate
- Keep responses concise (3-5 short paragraphs max for chat)
- Be specific - reference their actual scores and results
- Offer actionable next steps

REMEMBER:
- This is a CHAT conversation, not a formal report
- Be conversational and engaging
- Ask follow-up questions to keep the dialogue going
- You have LIMITED questions (3 total), so make each answer count
- Connect different aspects of their profile when relevant

DO NOT:
- Give generic advice - always personalize based on their data
- Overwhelm them with too much information at once
- Make promises about admissions or job placement
- Provide medical, legal, or mental health advice

STUDENT CONTEXT (their assessment results and profile):
`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create chat usage record
    let chatUsage = await prisma.aiChatUsage.findUnique({
      where: { userId: session.user.id },
    });

    if (!chatUsage) {
      chatUsage = await prisma.aiChatUsage.create({
        data: {
          userId: session.user.id,
          questionsUsed: 0,
          maxQuestions: MAX_QUESTIONS,
        },
      });
    }

    // Check question limit
    if (chatUsage.questionsUsed >= chatUsage.maxQuestions) {
      return NextResponse.json({
        error: 'Question limit reached',
        questionsUsed: chatUsage.questionsUsed,
        maxQuestions: chatUsage.maxQuestions,
      }, { status: 403 });
    }

    // Get chat history for context
    const chatHistory = await prisma.aiChatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });

    // Build student context
    const studentContext = await buildStudentContext(session.user.id);

    // Generate AI response
    let aiResponse: string;

    if (openai) {
      // Use OpenAI for real responses
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: AI_CHAT_SYSTEM_PROMPT + studentContext
        },
        // Include chat history
        ...chatHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        // Current message
        { role: 'user', content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      });

      aiResponse = completion.choices[0]?.message?.content ||
        'I apologize, but I was unable to generate a response. Please try again.';
    } else {
      // Fallback to simple response if no API key
      aiResponse = generateFallbackResponse(message, studentContext);
    }

    // Save both messages
    await prisma.aiChatMessage.createMany({
      data: [
        {
          userId: session.user.id,
          role: 'user',
          content: message,
          questionNumber: chatUsage.questionsUsed + 1,
        },
        {
          userId: session.user.id,
          role: 'assistant',
          content: aiResponse,
        },
      ],
    });

    // Update question count
    const updatedUsage = await prisma.aiChatUsage.update({
      where: { userId: session.user.id },
      data: { questionsUsed: { increment: 1 } },
    });

    return NextResponse.json({
      response: aiResponse,
      questionsUsed: updatedUsage.questionsUsed,
      maxQuestions: updatedUsage.maxQuestions,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// Fallback response when OpenAI is not available
function generateFallbackResponse(message: string, _context: string): string {
  const lowerMessage = message.toLowerCase();

  // Career-related questions
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
    return `Based on your assessment results, you have unique strengths that could lead to several exciting career paths. Your profile shows aptitude in areas that are highly valued in today's job market.

To give you more specific guidance, I'd recommend exploring careers that align with your Holland Code and top intelligences. Your strengths in these areas suggest you'd thrive in roles that allow you to leverage these natural abilities.

Would you like me to elaborate on specific career paths that match your profile?`;
  }

  // University-related questions
  if (lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('school') || lowerMessage.includes('study')) {
    return `Great question about higher education! Based on your assessment results, here are some factors to consider when choosing universities:

1. **Program fit**: Look for programs that align with your Holland Code and interests
2. **Location**: Consider countries where your career interests have strong job markets
3. **Financial fit**: Many universities offer scholarships for students with your profile

Your preferred destinations and budget will help narrow down the best options. Would you like to discuss specific universities or countries?`;
  }

  // Default response
  return `Thank you for your question! As your AI career counselor, I'm here to help you understand your assessment results and plan your future.

Based on your pilot assessment, you have a unique combination of strengths and interests. Your profile shows particular aptitude in areas that open doors to many exciting opportunities.

What specific aspect of your career or university planning would you like to explore further?`;
}

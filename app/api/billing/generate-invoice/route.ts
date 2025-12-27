import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

// Mock data for development - replace with actual Prisma queries when models exist
const mockUniversities: Record<
  string,
  { id: string; name: string; subscriptionType: string; cplRate: number }
> = {
  'univ-1': { id: 'univ-1', name: 'University of Melbourne', subscriptionType: 'CPL', cplRate: 25 },
  'univ-2': { id: 'univ-2', name: 'University of Toronto', subscriptionType: 'CPL', cplRate: 30 },
  'univ-3': {
    id: 'univ-3',
    name: 'National University of Singapore',
    subscriptionType: 'CPL',
    cplRate: 35,
  },
};

// This can be called by a cron job monthly or manually
export async function POST(request: NextRequest) {
  try {
    const { universityId, periodStart, periodEnd } = await request.json();

    // Get university (mock for now)
    const university = mockUniversities[universityId];

    if (!university || university.subscriptionType !== 'CPL') {
      return NextResponse.json(
        { error: 'Invalid university or not on CPL plan' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual Prisma query when models exist
    // const university = await prisma.university.findUnique({
    //   where: { id: universityId },
    // });
    //
    // const leads = await prisma.studentLead.findMany({
    //   where: {
    //     universityId,
    //     createdAt: {
    //       gte: new Date(periodStart),
    //       lte: new Date(periodEnd),
    //     },
    //     consentGiven: true,
    //   },
    // });

    // Mock leads count for demo
    const leadsCount = Math.floor(Math.random() * 30) + 10;

    if (leadsCount === 0) {
      return NextResponse.json({ message: 'No leads to invoice' });
    }

    // Generate invoice number
    const invoiceCount = Math.floor(Math.random() * 100);
    const invoiceNumber = `INV-${university.id.slice(0, 6).toUpperCase()}-${String(invoiceCount + 1).padStart(4, '0')}`;

    // Calculate totals
    const cplRate = university.cplRate || 0;
    const subtotal = leadsCount * cplRate;
    const tax = 0; // Adjust based on your tax requirements
    const total = subtotal + tax;

    // TODO: Create invoice in database when models exist
    // const invoice = await prisma.invoice.create({
    //   data: {
    //     universityId,
    //     invoiceNumber,
    //     periodStart: new Date(periodStart),
    //     periodEnd: new Date(periodEnd),
    //     totalLeads: leadsCount,
    //     cplRate,
    //     subtotal,
    //     tax,
    //     total,
    //     status: 'PENDING',
    //     dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    //     lineItems: {
    //       create: leads.map(lead => ({
    //         leadId: lead.id,
    //         description: `Qualified Lead - ${format(new Date(lead.createdAt), 'MMM d, yyyy')}`,
    //         quantity: 1,
    //         unitPrice: cplRate,
    //         total: cplRate,
    //       })),
    //     },
    //   },
    // });

    // Log invoice generation
    console.log('Invoice generated:', {
      universityId,
      invoiceNumber,
      periodStart,
      periodEnd,
      totalLeads: leadsCount,
      cplRate,
      subtotal,
      tax,
      total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // TODO: Send invoice email to university

    return NextResponse.json({
      success: true,
      invoiceId: `inv-${Date.now()}`,
      invoiceNumber,
      totalLeads: leadsCount,
      total,
      message: `Invoice ${invoiceNumber} generated for ${leadsCount} leads totaling $${total}`,
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}

// Get invoice details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    // TODO: Fetch from database when models exist
    // const invoice = await prisma.invoice.findUnique({
    //   where: { id: invoiceId },
    //   include: { lineItems: true },
    // });

    // Return mock invoice details
    return NextResponse.json({
      id: invoiceId,
      invoiceNumber: 'INV-DEMO01-0001',
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      totalLeads: 25,
      cplRate: 25,
      subtotal: 625,
      tax: 0,
      total: 625,
      status: 'PENDING',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

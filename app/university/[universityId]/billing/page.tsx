import { format, subMonths } from 'date-fns';
import BillingDashboard from '@/components/university/BillingDashboard';

interface BillingPageProps {
  params: { universityId: string };
}

// Mock data for development - replace with actual DB queries when Invoice model exists
async function getBillingData(universityId: string) {
  // Mock university billing info
  const university = {
    name: 'Demo University',
    partnerTier: 'GOLD',
    subscriptionType: 'CPL',
    cplRate: 25,
    annualFee: 0,
    contractStart: subMonths(new Date(), 6),
    contractEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  };

  // Mock invoices
  const invoices = [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-DEMO01-0003',
      periodStart: subMonths(new Date(), 1),
      periodEnd: new Date(),
      totalLeads: 34,
      total: 850,
      status: 'PENDING',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      paidAt: null,
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-DEMO01-0002',
      periodStart: subMonths(new Date(), 2),
      periodEnd: subMonths(new Date(), 1),
      totalLeads: 28,
      total: 700,
      status: 'PAID',
      dueDate: subMonths(new Date(), 0.5),
      paidAt: subMonths(new Date(), 0.6),
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-DEMO01-0001',
      periodStart: subMonths(new Date(), 3),
      periodEnd: subMonths(new Date(), 2),
      totalLeads: 19,
      total: 475,
      status: 'PAID',
      dueDate: subMonths(new Date(), 1.5),
      paidAt: subMonths(new Date(), 1.6),
    },
  ];

  // Calculate summary
  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + i.total, 0);

  const totalPending = invoices
    .filter((i) => i.status === 'PENDING' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.total, 0);

  // Mock unbilled leads (current period)
  const unbilledLeads = 12;
  const unbilledAmount = unbilledLeads * university.cplRate;

  return {
    university,
    summary: {
      totalPaid,
      totalPending,
      unbilledLeads,
      unbilledAmount,
    },
    invoices,
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { universityId } = params;
  const data = await getBillingData(universityId);

  // TODO: Replace mock data with actual Prisma queries when models exist:
  // const university = await prisma.university.findUnique({
  //   where: { id: universityId },
  //   select: {
  //     name: true,
  //     partnerTier: true,
  //     subscriptionType: true,
  //     cplRate: true,
  //     annualFee: true,
  //     contractStart: true,
  //     contractEnd: true,
  //   },
  // });
  //
  // const invoices = await prisma.invoice.findMany({
  //   where: { universityId },
  //   orderBy: { createdAt: 'desc' },
  //   take: 12,
  // });
  //
  // const lastInvoice = invoices[0];
  // const unbilledLeadsStart = lastInvoice?.periodEnd || university?.contractStart || new Date();
  //
  // const unbilledLeads = await prisma.studentLead.count({
  //   where: {
  //     universityId,
  //     createdAt: { gt: unbilledLeadsStart },
  //     cplCharged: { not: null },
  //   },
  // });

  return (
    <BillingDashboard
      university={{
        name: data.university.name,
        tier: data.university.partnerTier,
        subscriptionType: data.university.subscriptionType,
        cplRate: data.university.cplRate,
        annualFee: data.university.annualFee,
        contractStart: data.university.contractStart,
        contractEnd: data.university.contractEnd,
      }}
      summary={data.summary}
      invoices={data.invoices}
    />
  );
}

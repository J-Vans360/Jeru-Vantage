import { prisma } from '@/lib/prisma';
import PilotCodesAdmin from '@/components/admin/PilotCodesAdmin';

export const metadata = {
  title: 'Manage Invite Codes | Super Admin',
};

export default async function PilotCodesPage() {
  const codes = await prisma.pilotInviteCode.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { usages: true },
      },
      usages: {
        include: {
          user: {
            include: {
              pilotAssessment: true,
            },
          },
        },
      },
    },
  });

  // Calculate stats
  const stats = {
    totalCodes: codes.length,
    activeCodes: codes.filter(c => c.isActive).length,
    totalCapacity: codes.reduce((sum, c) => sum + (c.maxUses || 0), 0),
    totalUsed: codes.reduce((sum, c) => sum + c.currentUses, 0),
    completedAssessments: codes.reduce((sum, c) =>
      sum + c.usages.filter(u => u.user.pilotAssessment?.status === 'COMPLETED').length, 0
    ),
  };

  const formattedCodes = codes.map(code => ({
    id: code.id,
    code: code.code,
    name: code.name,
    sourceType: code.sourceType,
    sourceName: code.sourceName,
    sourceEmail: code.sourceEmail,
    sourceCountry: code.sourceCountry,
    maxUses: code.maxUses,
    currentUses: code.currentUses,
    completedCount: code.usages.filter(u =>
      u.user.pilotAssessment?.status === 'COMPLETED'
    ).length,
    isActive: code.isActive,
    validFrom: code.validFrom?.toISOString() ?? null,
    validUntil: code.validUntil?.toISOString() ?? null,
    createdAt: code.createdAt.toISOString(),
  }));

  return (
    <PilotCodesAdmin
      codes={formattedCodes}
      stats={stats}
    />
  );
}

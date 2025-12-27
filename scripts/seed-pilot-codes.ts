import { PrismaClient, PilotSourceType } from '@prisma/client';

const prisma = new PrismaClient();

interface CodeData {
  code: string;
  name: string;
  sourceType: PilotSourceType;
  sourceName?: string;
  sourceEmail?: string;
  sourceCountry?: string;
  maxUses?: number;
}

const INITIAL_CODES: CodeData[] = [
  // VIP Codes
  {
    code: 'VIP-REACHER',
    name: 'Reacher - Admin',
    sourceType: 'VIP',
    sourceName: 'Reacher',
    maxUses: 100,
  },
  {
    code: 'VIP-JERUSHA',
    name: 'Jerusha - Co-founder',
    sourceType: 'VIP',
    sourceName: 'Jerusha',
    maxUses: 50,
  },
  {
    code: 'TEST-INTERNAL',
    name: 'Internal Testing',
    sourceType: 'TEST',
    maxUses: 20,
  },

  // Sample Counselor Codes (replace with real ones)
  {
    code: 'COUN-SAMPLE-SG',
    name: 'Sample Counselor - Singapore',
    sourceType: 'COUNSELOR',
    sourceName: 'Sample Counselor',
    sourceCountry: 'Singapore',
    maxUses: 50,
  },
  {
    code: 'COUN-SAMPLE-IN',
    name: 'Sample Counselor - India',
    sourceType: 'COUNSELOR',
    sourceName: 'Sample Counselor',
    sourceCountry: 'India',
    maxUses: 50,
  },

  // Sample School Codes (replace with real ones)
  {
    code: 'SCH-SAMPLE-01',
    name: 'Sample School 1',
    sourceType: 'SCHOOL',
    sourceName: 'Sample International School',
    sourceCountry: 'Singapore',
    maxUses: 100,
  },
];

async function main() {
  console.log('Seeding pilot invite codes...\n');

  // Set validity until end of February 2025
  const validUntil = new Date('2025-02-28T23:59:59Z');

  let created = 0;
  let skipped = 0;

  for (const codeData of INITIAL_CODES) {
    const existing = await prisma.pilotInviteCode.findUnique({
      where: { code: codeData.code },
    });

    if (existing) {
      console.log(`  [SKIP] Code ${codeData.code} already exists`);
      skipped++;
      continue;
    }

    await prisma.pilotInviteCode.create({
      data: {
        code: codeData.code,
        name: codeData.name,
        sourceType: codeData.sourceType,
        sourceName: codeData.sourceName || null,
        sourceEmail: codeData.sourceEmail || null,
        sourceCountry: codeData.sourceCountry || null,
        maxUses: codeData.maxUses || null,
        validUntil,
        isActive: true,
      },
    });

    console.log(`  [CREATE] ${codeData.code} (${codeData.sourceType})`);
    created++;
  }

  console.log(`\n✓ Done! Created ${created} codes, skipped ${skipped} existing.`);
}

main()
  .catch((error) => {
    console.error('Error seeding codes:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

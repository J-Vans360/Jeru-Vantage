import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Adding missing columns to users table...');

    // Add password column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS "password" TEXT;
    `);
    console.log('✅ Added password column');

    // Add image column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS "image" TEXT;
    `);
    console.log('✅ Added image column');

    console.log('🎉 All columns added successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

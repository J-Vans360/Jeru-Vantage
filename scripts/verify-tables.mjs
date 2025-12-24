import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Checking database tables...\n');

    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('📋 Existing tables:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));

    // Check users table structure
    const usersColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `;

    console.log('\n👤 Users table columns:');
    usersColumns.forEach(c => console.log(`  - ${c.column_name} (${c.data_type})`));

    console.log('\n✅ Database structure verified!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

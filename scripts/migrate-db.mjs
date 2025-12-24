import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Starting database migration...');

    // Add emailVerified column to users table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
    `);
    console.log('✅ Added emailVerified column');

    // Create accounts table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT accounts_provider_providerAccountId_key UNIQUE (provider, "providerAccountId")
      );
    `);
    console.log('✅ Created accounts table');

    // Create sessions table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        expires TIMESTAMP(3) NOT NULL,
        CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created sessions table');

    // Create verification_tokens table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP(3) NOT NULL,
        CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
      );
    `);
    console.log('✅ Created verification_tokens table');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

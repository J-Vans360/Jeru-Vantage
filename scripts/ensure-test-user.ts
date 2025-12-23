import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'test-user-123';

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    // Create test user
    user = await prisma.user.create({
      data: {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    console.log('Created test user:', user);
  } else {
    console.log('Test user already exists:', user);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

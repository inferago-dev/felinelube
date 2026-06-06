const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const adminEmail = 'admin@felinelube.com';
  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        name: 'Feline Admin',
        email: adminEmail,
        password: hashed,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    console.log('ℹ️  Admin already exists, skipping.');
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

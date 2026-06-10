const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@felinelube.com';
  const password = 'admin';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin account created/updated: email: admin@felinelube.com, password: admin');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

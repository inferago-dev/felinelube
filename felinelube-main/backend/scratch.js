const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const user = await prisma.admin.update({
    where: { email: 'admin@felinelube.com' },
    data: { password: hash }
  });
  console.log('Password updated to admin123 hash', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());

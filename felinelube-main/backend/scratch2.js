const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const user = await prisma.admin.findUnique({
    where: { email: 'admin@felinelube.com' }
  });
  console.log('Hash in DB:', user.password);
  const match = await bcrypt.compare('admin123', user.password);
  console.log('Does admin123 match?', match);
}

main().catch(console.error).finally(() => prisma.$disconnect());

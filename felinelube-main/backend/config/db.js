const { PrismaClient } = require('@prisma/client');

// Prevent multiple instances of Prisma Client in development
// which can exhaust database connections
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;

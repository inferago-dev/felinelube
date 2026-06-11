const prisma = require('../config/db');

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null
    }
  });
  console.log(`Successfully updated ${result.count} users to verified.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

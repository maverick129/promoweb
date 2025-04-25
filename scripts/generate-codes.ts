import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function main() {
  const codes = new Set<string>();
  
  // Generate 100 unique codes
  while (codes.size < 100) {
    codes.add(generateCode());
  }

  // Insert codes into database
  for (const code of codes) {
    await prisma.raffleTicket.create({
      data: {
        code,
        status: 'PENDING',
        phone: '', // Empty phone number as these are new codes
      },
    });
    console.log(`Added code: ${code}`);
  }

  console.log('Successfully added 100 codes to the database');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
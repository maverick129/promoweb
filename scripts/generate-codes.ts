import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateUniqueCodes(count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generatePromoCode());
  }
  return Array.from(codes);
}

async function main() {
  try {
    // Clear existing codes
    await prisma.promoCode.deleteMany();
    console.log('Cleared existing codes');

    // Generate 100 unique codes
    const promoCodes = generateUniqueCodes(100);
    console.log('Generated 100 unique codes');

    // Insert codes into database
    for (const code of promoCodes) {
      await prisma.promoCode.create({
        data: {
          code: code.toUpperCase(),
          used: false
        },
      });
      console.log(`Added code: ${code}`);
    }

    console.log('Successfully added 100 codes to the database');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
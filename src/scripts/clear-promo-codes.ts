import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearPromoCodes() {
  try {
    // Delete all promo codes
    const result = await prisma.promoCode.deleteMany()
    console.log(`Successfully deleted ${result.count} promo codes from the database`)
  } catch (error) {
    console.error('Error clearing promo codes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearPromoCodes() 
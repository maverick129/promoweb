import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing prizes
  await prisma.prize.deleteMany()

  // Create prizes
  const prizes = await prisma.prize.createMany({
    data: [
      {
        name: 'Jiva Prodi T-Shirt',
        description: 'Limited edition Jiva Prodi T-Shirt',
        type: 'instant',
        probability: 0.3,
        quantity: 1000,
        remaining: 1000,
      },
      {
        name: 'Jiva Prodi Cap',
        description: 'Stylish Jiva Prodi Cap',
        type: 'instant',
        probability: 0.3,
        quantity: 1500,
        remaining: 1500,
      },
      {
        name: 'Water Bottle',
        description: 'Durable Jiva Prodi Water Bottle',
        type: 'instant',
        probability: 0.3,
        quantity: 2000,
        remaining: 2000,
      },
      {
        name: 'Agricultural Equipment Set',
        description: 'Professional farming equipment set',
        type: 'raffle',
        probability: 0.1,
        quantity: 50,
        remaining: 50,
      },
    ],
  })

  console.log('Database seeded with prizes:', prizes)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
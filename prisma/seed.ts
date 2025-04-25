import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const prizes = [
  {
    name: 'T-Shirt',
    description: 'Limited edition Jiva Prodi T-Shirt',
    type: 'instant',
    probability: 0.3,
    quantity: 1000,
    remaining: 1000,
    claimed: 0
  },
  {
    name: 'Cap',
    description: 'Stylish Jiva Prodi Cap',
    type: 'instant',
    probability: 0.3,
    quantity: 1500,
    remaining: 1500,
    claimed: 0
  },
  {
    name: 'Water Bottle',
    description: 'Durable Jiva Prodi Water Bottle',
    type: 'instant',
    probability: 0.3,
    quantity: 2000,
    remaining: 2000,
    claimed: 0
  },
  {
    name: 'Better Luck Next Time',
    description: 'Try again next time!',
    type: 'instant',
    probability: 0.1,
    quantity: 999999,
    remaining: 999999,
    claimed: 0
  }
]

const stores = [
  {
    name: 'Jivaphala Surabaya',
    address: 'Jl. Tunjungan No. 45',
    city: 'Surabaya',
    province: 'East Java',
    latitude: -7.2575,
    longitude: 112.7521
  },
  {
    name: 'Jivaphala Malang',
    address: 'Jl. Merdeka No. 12',
    city: 'Malang',
    province: 'East Java',
    latitude: -7.9778,
    longitude: 112.6308
  }
]

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.win.deleteMany()
  await prisma.prize.deleteMany()
  await prisma.code.deleteMany()
  await prisma.user.deleteMany()
  await prisma.location.deleteMany()

  // Seed prizes
  console.log('Seeding prizes...')
  for (const prize of prizes) {
    await prisma.prize.create({
      data: prize
    })
  }

  // Seed stores
  console.log('Seeding store locations...')
  for (const store of stores) {
    await prisma.location.create({
      data: {
        lat: store.latitude,
        lng: store.longitude,
        address: store.address,
        city: store.city,
        province: store.province
      }
    })
  }

  // Generate some sample codes
  console.log('Generating sample codes...')
  const sampleCodes = [
    'JIVA2024',
    'PRODI2024',
    'WELCOME24',
    'HEALTHY24',
    'NATURAL24',
  ]

  for (const code of sampleCodes) {
    await prisma.code.create({
      data: {
        code: code,
        used: false,
      },
    })
  }

  // Seed promo codes
  console.log('Seeding promo codes...')
  const promoCodes = [
    'ABC12345',
    'DEF67890',
    'GHI13579',
    'JKL24680',
    'MNO14725'
  ]

  for (const code of promoCodes) {
    await prisma.promoCode.create({
      data: {
        code,
        used: false
      }
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
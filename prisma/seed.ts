import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const prizes = [
  // Instant Win Prizes
  {
    name: 'SOJIKYO 5 KG',
    description: 'Premium SOJIKYO 5 KG package',
    type: 'instant',
    value: null,
    quantity: 100,
    probability: 0.1,
    remaining: 100
  },
  {
    name: 'Jiva Sprayer 2L',
    description: 'High-quality 2L sprayer',
    type: 'instant',
    value: null,
    quantity: 200,
    probability: 0.15,
    remaining: 200
  },
  {
    name: 'Jiva T-shirt',
    description: 'Limited edition Jiva T-shirt',
    type: 'instant',
    value: null,
    quantity: 500,
    probability: 0.2,
    remaining: 500
  },
  {
    name: 'Jiva Hat',
    description: 'Stylish Jiva Hat',
    type: 'instant',
    value: null,
    quantity: 500,
    probability: 0.2,
    remaining: 500
  },
  {
    name: 'Jiva Toko Voucher Rp 20.000',
    description: 'Rp 20.000 Jiva Toko Voucher',
    type: 'instant',
    value: '20000',
    quantity: 1000,
    probability: 0.1,
    remaining: 1000
  },
  {
    name: 'Jiva Toko Voucher Rp 50.000',
    description: 'Rp 50.000 Jiva Toko Voucher',
    type: 'instant',
    value: '50000',
    quantity: 500,
    probability: 0.1,
    remaining: 500
  },
  {
    name: 'Jiva Toko Voucher Rp 100.000',
    description: 'Rp 100.000 Jiva Toko Voucher',
    type: 'instant',
    value: '100000',
    quantity: 200,
    probability: 0.05,
    remaining: 200
  },
  {
    name: 'Better Luck Next Time',
    description: 'Try again next time!',
    type: 'instant',
    value: null,
    quantity: 999999,
    probability: 0.1,
    remaining: 999999
  },
  // Grand Raffle Prizes
  {
    name: 'Bag of Cash Rp 20.000.000',
    description: 'Grand Prize - Rp 20.000.000 Cash',
    type: 'raffle',
    value: '20000000',
    quantity: 1,
    probability: 0.01,
    remaining: 1
  },
  {
    name: 'Samsung Galaxy S22',
    description: 'Latest Samsung Galaxy S22',
    type: 'raffle',
    value: null,
    quantity: 1,
    probability: 0.01,
    remaining: 1
  },
  {
    name: 'SOJIKYO 300-KG',
    description: 'Premium SOJIKYO 300 KG package',
    type: 'raffle',
    value: null,
    quantity: 1,
    probability: 0.01,
    remaining: 1
  },
  {
    name: '40" TV',
    description: '40-inch Smart TV',
    type: 'raffle',
    value: null,
    quantity: 1,
    probability: 0.01,
    remaining: 1
  },
  {
    name: 'Jiva Toko Voucher Rp 2.000.000',
    description: 'Rp 2.000.000 Jiva Toko Voucher',
    type: 'raffle',
    value: '2000000',
    quantity: 1,
    probability: 0.01,
    remaining: 1
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
  await prisma.$transaction([
    prisma.win.deleteMany(),
    prisma.prize.deleteMany(),
    prisma.user.deleteMany(),
    prisma.location.deleteMany(),
    prisma.promoCode.deleteMany(),
    prisma.oTP.deleteMany()
  ])

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

  // Generate 100 unique promo codes
  console.log('Generating promo codes...')
  const promoCodes = Array.from({ length: 100 }, (_, i) => {
    const code = generateRandomCode()
    return {
      code,
      used: false
    }
  })

  // Insert promo codes into database
  for (const promoCode of promoCodes) {
    await prisma.promoCode.create({
      data: promoCode
    })
  }

  console.log('Seeding completed.')
}

function generateRandomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Run Prisma migrations
    console.log('Running database migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    
    // Seed the database with initial data
    console.log('Seeding database...')
    await seedPrizes()
    await seedPromoCodes()
    
    console.log('Database migration and seeding completed successfully!')
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function seedPrizes() {
  // Seed prizes
  const prizes = [
    // Instant Win Prizes
    {
      name: 'SOJIKYO 5 KG',
      description: 'Premium quality rice for your daily needs',
      type: 'instant',
      value: '5 KG',
      quantity: 100
    },
    {
      name: 'Jiva Sprayer 2L',
      description: 'Professional-grade sprayer for your farming needs',
      type: 'instant',
      value: '2L',
      quantity: 50
    },
    {
      name: 'Jiva T-shirt',
      description: 'Comfortable and stylish Jiva branded t-shirt',
      type: 'instant',
      quantity: 200
    },
    {
      name: 'Jiva Hat',
      description: 'Protect yourself in style with our branded hat',
      type: 'instant',
      quantity: 150
    },
    {
      name: 'Jiva Toko Voucher',
      description: 'Rp 20.000 store credit',
      type: 'instant',
      value: 'Rp 20.000',
      quantity: 300
    },
    {
      name: 'Jiva Toko Voucher',
      description: 'Rp 50.000 store credit',
      type: 'instant',
      value: 'Rp 50.000',
      quantity: 200
    },
    {
      name: 'Jiva Toko Voucher',
      description: 'Rp 100.000 store credit',
      type: 'instant',
      value: 'Rp 100.000',
      quantity: 100
    },
    
    // Raffle Prizes
    {
      name: 'Bag of Cash',
      description: 'Rp 20.000.000 cash prize',
      type: 'raffle',
      value: 'Rp 20.000.000',
      quantity: 1
    },
    {
      name: 'Samsung Galaxy S22',
      description: 'Latest Samsung flagship smartphone',
      type: 'raffle',
      quantity: 1
    },
    {
      name: 'SOJIKYO 300-KG',
      description: 'Premium quality rice supply',
      type: 'raffle',
      value: '300 KG',
      quantity: 1
    },
    {
      name: '40" TV',
      description: 'High-definition smart television',
      type: 'raffle',
      quantity: 1
    },
    {
      name: 'Jiva Toko Voucher',
      description: 'Rp 2.000.000 store credit',
      type: 'raffle',
      value: 'Rp 2.000.000',
      quantity: 1
    }
  ]

  for (const prize of prizes) {
    await prisma.prize.upsert({
      where: { 
        name_type: {
          name: prize.name,
          type: prize.type
        }
      },
      update: prize,
      create: prize
    })
  }
}

async function seedPromoCodes() {
  // Generate 100 unique promo codes
  const promoCodes = Array.from({ length: 100 }, (_, i) => {
    const code = generateRandomCode()
    return {
      code,
      used: false
    }
  })

  // Insert promo codes into database
  for (const promoCode of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promoCode.code },
      update: promoCode,
      create: promoCode
    })
  }
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
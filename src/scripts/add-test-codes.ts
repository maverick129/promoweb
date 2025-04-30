import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const testCodes = [
  '6RY7CNCP',
  '5BB8MG8E',
  '6FEERL8K',
  'GTN4M6SP',
  'HJJVULHN',
  '7C2NT9H5',
  'GVUPR4PY',
  'EHLLHKHS',
  '52RZPEJ9',
  'UGRHDNYK'
]

async function addTestCodes() {
  try {
    // Add each code to the database
    for (const code of testCodes) {
      await prisma.promoCode.create({
        data: {
          code,
          used: false,
        },
      })
    }
    console.log('Successfully added test codes to the database')
  } catch (error) {
    console.error('Error adding test codes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestCodes() 
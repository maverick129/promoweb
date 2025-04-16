import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateCode(): string {
  // Generate 8 character alphanumeric code
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ' // Excluding similar looking characters like 0,1,I,O
  let code = ''
  
  // Generate 8 characters
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
}

async function main() {
  // Delete existing codes
  await prisma.code.deleteMany()

  const codes = []
  const usedCodes = new Set()

  // Generate 100 unique codes
  while (codes.length < 100) {
    const code = generateCode()
    if (!usedCodes.has(code)) {
      codes.push({ code })
      usedCodes.add(code)
    }
  }

  // Insert codes into database
  const result = await prisma.code.createMany({
    data: codes
  })

  console.log('Generated codes:')
  codes.forEach(({ code }) => console.log(code))
  console.log(`\nTotal codes created: ${result.count}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
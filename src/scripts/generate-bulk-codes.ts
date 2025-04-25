import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

async function exportToCSV(codes: string[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `promo-codes-${timestamp}.csv`
  const filepath = path.join(process.cwd(), 'exports', filename)
  
  // Create exports directory if it doesn't exist
  if (!fs.existsSync(path.join(process.cwd(), 'exports'))) {
    fs.mkdirSync(path.join(process.cwd(), 'exports'))
  }

  // Create CSV content
  const csvContent = 'Code\n' + codes.join('\n')
  
  // Write to file
  fs.writeFileSync(filepath, csvContent)
  console.log(`\nExported ${codes.length} codes to ${filepath}`)
}

async function generateBulkCodes(count: number) {
  console.log(`Starting to generate ${count} promo codes...`)
  
  const batchSize = 1000 // Process in batches to avoid memory issues
  const totalBatches = Math.ceil(count / batchSize)
  const usedCodes = new Set<string>()
  let totalGenerated = 0
  const allCodes: string[] = []

  for (let batch = 0; batch < totalBatches; batch++) {
    const codes = []
    const batchStart = batch * batchSize
    const batchEnd = Math.min((batch + 1) * batchSize, count)
    const batchSizeActual = batchEnd - batchStart

    console.log(`Generating batch ${batch + 1}/${totalBatches} (${batchSizeActual} codes)...`)

    // Generate unique codes for this batch
    while (codes.length < batchSizeActual) {
      const code = generatePromoCode()
      if (!usedCodes.has(code)) {
        codes.push({ code })
        usedCodes.add(code)
        allCodes.push(code)
      }
    }

    // Insert batch into database
    try {
      const result = await prisma.promoCode.createMany({
        data: codes,
        skipDuplicates: true
      })
      totalGenerated += result.count
      console.log(`Successfully added ${result.count} codes in batch ${batch + 1}`)
    } catch (error) {
      console.error(`Error in batch ${batch + 1}:`, error)
    }
  }

  console.log(`\nGeneration complete!`)
  console.log(`Total codes generated: ${totalGenerated}`)

  // Export to CSV
  await exportToCSV(allCodes)
}

// Generate 100,000 codes
generateBulkCodes(100000)
  .catch((e) => {
    console.error('Error in main process:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
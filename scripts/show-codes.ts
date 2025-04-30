import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const codes = await prisma.promoCode.findMany({
      include: {
        user: true,
        winner: true
      }
    })

    console.log('\nPromo Codes in database:')
    console.log('=====================\n')

    if (codes.length === 0) {
      console.log('No promo codes found in the database.')
    } else {
      codes.forEach((code, index) => {
        console.log(`Code ${index + 1}: ${code.code}`)
        console.log(`Status: ${code.used ? 'Used' : 'Unused'}`)
        if (code.user) {
          console.log(`Used by: ${code.user.name} (${code.user.phone})`)
        }
        if (code.winner) {
          console.log(`Prize ID: ${code.winner.prizeId}`)
        }
        console.log('-------------------\n')
      })
    }
  } catch (error) {
    console.error('Error fetching promo codes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 
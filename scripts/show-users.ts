import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        locationData: true,
        promoCodes: true,
        winners: true
      }
    })

    console.log('\nUsers in database:')
    console.log('=================\n')

    if (users.length === 0) {
      console.log('No users found in the database.')
    } else {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`)
        console.log(`Name: ${user.name}`)
        console.log(`Phone: ${user.phone}`)
        console.log(`Location: ${user.location}`)
        console.log(`Created At: ${user.createdAt}`)
        
        if (user.locationData) {
          console.log('Location Data:')
          console.log(`  Address: ${user.locationData.address}`)
          console.log(`  City: ${user.locationData.city}`)
          console.log(`  Province: ${user.locationData.province}`)
        }
        
        if (user.promoCodes.length > 0) {
          console.log('Promo Codes:')
          user.promoCodes.forEach(code => {
            console.log(`  ${code.code} (${code.used ? 'Used' : 'Unused'})`)
          })
        }
        
        if (user.winners.length > 0) {
          console.log('Prizes Won:')
          user.winners.forEach(win => {
            console.log(`  Prize ID: ${win.prizeId}`)
          })
        }
        
        console.log('-------------------\n')
      })
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 
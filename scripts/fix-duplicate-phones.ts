import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDuplicatePhones() {
  try {
    // Get all users grouped by phone number
    const duplicatePhones = await prisma.$queryRaw`
      SELECT phone, COUNT(*) as count, array_agg(id) as user_ids
      FROM "User"
      GROUP BY phone
      HAVING COUNT(*) > 1
    `

    console.log('Found duplicate phone numbers:', duplicatePhones)

    // For each group of duplicates, keep the most recent one and delete others
    for (const group of duplicatePhones as any[]) {
      const { phone, user_ids } = group
      
      // Get the most recent user
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: user_ids
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Keep the first (most recent) user and delete the rest
      const [keepUser, ...deleteUsers] = users
      const deleteIds = deleteUsers.map(u => u.id)

      console.log(`For phone ${phone}:`)
      console.log('- Keeping user:', keepUser.id)
      console.log('- Deleting users:', deleteIds)

      // Delete the duplicate users
      await prisma.user.deleteMany({
        where: {
          id: {
            in: deleteIds
          }
        }
      })
    }

    console.log('Successfully removed duplicate phone numbers')
  } catch (error) {
    console.error('Error fixing duplicate phone numbers:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixDuplicatePhones() 
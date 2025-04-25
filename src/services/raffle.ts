import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

export async function generateRaffleTicket(phone: string): Promise<string> {
  try {
    // Generate a unique ticket code
    const ticketCode = nanoid(10).toUpperCase()
    
    // Create the raffle ticket in the database
    await prisma.raffleTicket.create({
      data: {
        code: ticketCode,
        phone,
        status: 'PENDING',
      },
    })

    return ticketCode
  } catch (error) {
    console.error('Error generating raffle ticket:', error)
    throw new Error('Failed to generate raffle ticket')
  }
} 
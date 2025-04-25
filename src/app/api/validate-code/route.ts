import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, name, phone, location } = await request.json()

    // Validate input
    if (!code || !name || !phone || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if code exists and is unused
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    if (promoCode.used) {
      return NextResponse.json(
        { error: 'Code has already been used' },
        { status: 400 }
      )
    }

    // Start a transaction to update code and create raffle ticket
    const result = await prisma.$transaction(async (tx) => {
      // Mark code as used
      await tx.promoCode.update({
        where: { id: promoCode.id },
        data: { used: true }
      })

      // Create raffle ticket
      const raffleTicket = await tx.raffleTicket.create({
        data: {
          code: code.toUpperCase(),
          phone,
          status: 'PENDING'
        }
      })

      // Create or update user location
      const userLocation = await tx.location.create({
        data: {
          address: location,
          lat: 0, // You might want to parse these from the location string if available
          lng: 0,
          city: '', // These could be parsed from the location string if needed
          province: '',
          user: {
            create: {
              name,
              phone
            }
          }
        }
      })

      return { raffleTicket, userLocation }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in validate-code:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
} 
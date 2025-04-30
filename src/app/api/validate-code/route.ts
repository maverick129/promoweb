import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, name, phone, location } = await request.json()
    console.log('Received request:', { code, name, phone, location })

    // Validate input
    if (!code || !name || !phone || !location) {
      console.log('Missing required fields:', { code, name, phone, location })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if code exists and is unused
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })
    console.log('Found promo code:', promoCode)

    if (!promoCode) {
      console.log('Invalid code:', code)
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    if (promoCode.used) {
      console.log('Code already used:', code)
      return NextResponse.json(
        { error: 'Code has already been used' },
        { status: 400 }
      )
    }

    // Start a transaction to update code and create user
    const result = await prisma.$transaction(async (tx) => {
      console.log('Starting transaction')
      
      // Create user first
      const user = await tx.user.create({
        data: {
          name,
          phone,
          location: location // Store the raw location string
        }
      })
      console.log('Created user:', user)

      // Create location data
      const userLocation = await tx.location.create({
        data: {
          address: location,
          lat: 0,
          lng: 0,
          city: 'Unknown',
          province: 'Unknown'
        }
      })
      console.log('Created user location:', userLocation)

      // Mark code as used
      const updatedCode = await tx.promoCode.update({
        where: { id: promoCode.id },
        data: {
          used: true
        }
      })
      console.log('Updated promo code:', updatedCode)

      return { user, userLocation }
    })

    console.log('Transaction completed successfully')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in validate-code:', error)
    // Log the full error stack
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
} 
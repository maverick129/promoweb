import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize PrismaClient
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, location } = body

    // Validate required fields
    if (!name || !phone || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create location first
    const newLocation = await prisma.location.create({
      data: {
        lat: location.lat || 0,
        lng: location.lng || 0,
        address: location.address || '',
        city: location.city || '',
        province: location.province || ''
      }
    })

    // Then create user with the location
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        locationId: newLocation.id
      },
      include: {
        location: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        location: user.location
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 
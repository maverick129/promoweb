import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    // Find the code in the database
    const promotionCode = await prisma.code.findUnique({
      where: { code: code.toUpperCase() }
    })

    // If code doesn't exist
    if (!promotionCode) {
      return NextResponse.json(
        { error: 'Invalid promotion code' },
        { status: 400 }
      )
    }

    // If code has already been used
    if (promotionCode.used) {
      return NextResponse.json(
        { error: 'This code has already been used' },
        { status: 400 }
      )
    }

    // Mark code as used
    await prisma.code.update({
      where: { id: promotionCode.id },
      data: {
        used: true,
        usedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error validating code:', error)
    return NextResponse.json(
      { error: 'An error occurred while validating the code' },
      { status: 500 }
    )
  }
} 
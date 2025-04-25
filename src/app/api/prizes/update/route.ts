import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { prizeId } = await request.json()
    
    const prize = await prisma.prize.findUnique({
      where: { id: prizeId }
    })

    if (!prize) {
      return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
    }

    if (prize.remaining <= 0) {
      return NextResponse.json({ error: 'No prizes remaining' }, { status: 400 })
    }

    const updatedPrize = await prisma.prize.update({
      where: { id: prizeId },
      data: {
        remaining: prize.remaining - 1,
        claimed: prize.claimed + 1
      }
    })

    return NextResponse.json(updatedPrize)
  } catch (error) {
    console.error('Error updating prize:', error)
    return NextResponse.json({ error: 'Failed to update prize' }, { status: 500 })
  }
} 
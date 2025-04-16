import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Get all available prizes from the database
    const prizes = await db.prize.findMany({
      where: {
        remaining: {
          gt: 0
        }
      }
    })

    if (prizes.length === 0) {
      return NextResponse.json(
        { error: 'No prizes available' },
        { status: 400 }
      )
    }

    // Calculate total probability
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
    
    // Generate random number between 0 and total probability
    const random = Math.random() * totalProbability
    
    // Find the winning prize
    let currentSum = 0
    let winningPrize = null
    
    for (const prize of prizes) {
      currentSum += prize.probability
      if (random <= currentSum) {
        winningPrize = prize
        break
      }
    }

    if (!winningPrize) {
      return NextResponse.json(
        { error: 'Failed to determine winning prize' },
        { status: 500 }
      )
    }

    // Update prize inventory
    await db.prize.update({
      where: { id: winningPrize.id },
      data: {
        remaining: winningPrize.remaining - 1,
        claimed: winningPrize.claimed + 1
      }
    })

    // Create a record of the win
    await db.win.create({
      data: {
        prizeId: winningPrize.id,
        claimed: false,
        claimedAt: null
      }
    })

    return NextResponse.json({
      prize: {
        id: winningPrize.id,
        name: winningPrize.name,
        description: winningPrize.description,
        type: winningPrize.type
      }
    })
  } catch (error) {
    console.error('Error in spin API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
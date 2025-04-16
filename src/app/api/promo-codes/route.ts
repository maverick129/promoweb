import { NextResponse } from 'next/server'

// Sample promo codes - replace with actual data from your database
const promoCodes = [
  {
    code: 'ABC12345',
    status: 'available',
    prize: 'T-Shirt'
  },
  {
    code: 'DEF67890',
    status: 'available',
    prize: 'Cap'
  },
  {
    code: 'GHI24680',
    status: 'used',
    prize: 'Water Bottle',
    dateUsed: '2024-03-15'
  },
  {
    code: 'JKL13579',
    status: 'available',
    prize: 'T-Shirt'
  },
  {
    code: 'MNO86420',
    status: 'used',
    prize: 'Cap',
    dateUsed: '2024-03-10'
  },
  {
    code: 'PQR97531',
    status: 'available',
    prize: 'Water Bottle'
  },
  {
    code: 'STU12345',
    status: 'available',
    prize: 'T-Shirt'
  },
  {
    code: 'VWX67890',
    status: 'used',
    prize: 'Cap',
    dateUsed: '2024-03-05'
  }
]

export async function GET() {
  return NextResponse.json(promoCodes)
} 
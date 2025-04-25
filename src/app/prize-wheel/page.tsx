'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FaSpinner } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PrizeWheel from '@/components/PrizeWheel'

interface Prize {
  id: string
  name: string
  description: string
  type: string
  probability: number
  quantity: number
  remaining: number
  claimed: number
  color: string
  textColor: string
  symbol: string
}

const prizeColors = {
  'T-Shirt': { color: '#166534', textColor: '#FCD34D', symbol: '👕' },
  'Cap': { color: '#065F46', textColor: '#FCD34D', symbol: '🧢' },
  'Water Bottle': { color: '#047857', textColor: '#FCD34D', symbol: '🥤' },
  'Better Luck Next Time': { color: '#991B1B', textColor: '#FCD34D', symbol: '❌' }
}

export default function PrizeWheelPage() {
  const { t } = useLanguage()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [winner, setWinner] = useState<Prize | null>(null)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = async () => {
    try {
      const response = await fetch('/api/prizes')
      if (!response.ok) {
        throw new Error('Failed to fetch prizes')
      }
      const data = await response.json()
      const formattedPrizes = data.map((prize: Prize) => ({
        ...prize,
        ...prizeColors[prize.name as keyof typeof prizeColors]
      }))
      setPrizes(formattedPrizes)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching prizes:', error)
      setIsLoading(false)
    }
  }

  const updatePrize = async (prizeId: string) => {
    try {
      const response = await fetch('/api/prizes/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prizeId }),
      })
      if (!response.ok) {
        throw new Error('Failed to update prize')
      }
      await fetchPrizes() // Refresh prizes after update
    } catch (error) {
      console.error('Error updating prize:', error)
    }
  }

  const handleSpinComplete = async (prize: Prize) => {
    setWinner(prize)
    if (prize.name !== 'Better Luck Next Time') {
      await updatePrize(prize.id)
    }
    // Show message after a short delay
    setTimeout(() => {
      setShowMessage(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4">
            {t('prizeWheel.title')}
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('prizeWheel.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-12 w-12 text-green-600" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <PrizeWheel prizes={prizes} onSpinComplete={handleSpinComplete} />
            
            {showMessage && winner && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  {winner.name === 'Better Luck Next Time' 
                    ? t('prizeWheel.betterLuck')
                    : t('prizeWheel.congratulations')}
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  {winner.name === 'Better Luck Next Time'
                    ? t('prizeWheel.tryAgain')
                    : t(`prizeWheel.wonPrize.${winner.name}`)}
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    {t('prizeWheel.raffleEntry')}
                  </p>
                  <p className="text-green-600 mt-2">
                    {t('prizeWheel.raffleDescription')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
} 
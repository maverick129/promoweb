'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FaGift, FaTshirt, FaHatCowboy, FaWater, FaTractor, FaCalendarAlt, FaUsers } from 'react-icons/fa'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Prize {
  id: string
  name: string
  description: string
  type: 'instant' | 'raffle' | 'daily' | 'community' | 'seasonal'
  icon: React.ReactNode
  image: string
  quantity: number
  remaining: number
}

export default function Prizes() {
  const { t } = useLanguage()
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)

  const prizes: Prize[] = [
    {
      id: '1',
      name: t('prizes.tShirts.title'),
      description: t('prizes.tShirts.description'),
      type: 'instant',
      icon: <FaTshirt className="w-12 h-12" />,
      image: '/images/farmers/tshirt-farmer.jpg',
      quantity: 1000,
      remaining: 750
    },
    {
      id: '2',
      name: t('prizes.caps.title'),
      description: t('prizes.caps.description'),
      type: 'instant',
      icon: <FaHatCowboy className="w-12 h-12" />,
      image: '/images/farmers/cap-farmer.jpg',
      quantity: 1500,
      remaining: 1200
    },
    {
      id: '3',
      name: t('prizes.waterBottles.title'),
      description: t('prizes.waterBottles.description'),
      type: 'instant',
      icon: <FaWater className="w-12 h-12" />,
      image: '/images/farmers/water-bottle-farmer.jpg',
      quantity: 2000,
      remaining: 1500
    },
    {
      id: '4',
      name: t('prizes.majorPrizes.title'),
      description: t('prizes.majorPrizes.description'),
      type: 'raffle',
      icon: <FaTractor className="w-12 h-12" />,
      image: '/images/farmers/equipment-farmer.jpg',
      quantity: 50,
      remaining: 50
    },
    {
      id: '5',
      name: t('prizes.dailyPrizes.title'),
      description: t('prizes.dailyPrizes.description'),
      type: 'daily',
      icon: <FaCalendarAlt className="w-12 h-12" />,
      image: '/images/farmers/daily-farmer.jpg',
      quantity: 30,
      remaining: 30
    },
    {
      id: '6',
      name: t('prizes.communityEvents.title'),
      description: t('prizes.communityEvents.description'),
      type: 'community',
      icon: <FaUsers className="w-12 h-12" />,
      image: '/images/farmers/community-farmer.jpg',
      quantity: 20,
      remaining: 20
    },
    {
      id: '7',
      name: t('prizes.seasonalRewards.title'),
      description: t('prizes.seasonalRewards.description'),
      type: 'seasonal',
      icon: <FaGift className="w-12 h-12" />,
      image: '/images/farmers/seasonal-farmer.jpg',
      quantity: 10,
      remaining: 10
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <FaGift className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('prizes.title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('prizes.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPrize(prize)}
            >
              <div className="h-48 relative">
                <Image
                  src={prize.image}
                  alt={prize.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-24 h-24 text-white">
                    {prize.icon}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-green-800">
                    {prize.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    prize.type === 'instant'
                      ? 'bg-green-100 text-green-800'
                      : prize.type === 'raffle'
                      ? 'bg-blue-100 text-blue-800'
                      : prize.type === 'daily'
                      ? 'bg-yellow-100 text-yellow-800'
                      : prize.type === 'community'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {prize.type === 'instant' 
                      ? t('prizes.instantWin')
                      : prize.type === 'raffle'
                      ? t('prizes.rafflePrize')
                      : prize.type === 'daily'
                      ? t('prizes.dailyPrize')
                      : prize.type === 'community'
                      ? t('prizes.communityEvent')
                      : t('prizes.seasonalReward')}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{prize.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{t('prizes.total')}: {prize.quantity}</span>
                  <span>{t('prizes.remaining')}: {prize.remaining}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPrize && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-green-800">
                    {selectedPrize.name}
                  </h2>
                  <button
                    onClick={() => setSelectedPrize(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="h-64 relative mb-4">
                  <Image
                    src={selectedPrize.image}
                    alt={selectedPrize.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <p className="text-gray-600 mb-4">{selectedPrize.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Type:</span>{' '}
                    {selectedPrize.type === 'instant' 
                      ? 'Instant Win'
                      : selectedPrize.type === 'raffle'
                      ? 'Raffle Prize'
                      : selectedPrize.type === 'daily'
                      ? 'Daily Prize'
                      : selectedPrize.type === 'community'
                      ? 'Community Event'
                      : 'Seasonal Reward'}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Total Available:</span>{' '}
                    {selectedPrize.quantity}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Remaining:</span>{' '}
                    {selectedPrize.remaining}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Claimed:</span>{' '}
                    {selectedPrize.quantity - selectedPrize.remaining}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
} 
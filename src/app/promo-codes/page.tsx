'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'

interface PromoCode {
  code: string
  status: 'available' | 'used' | 'invalid'
  prize?: string
  dateUsed?: string
}

export default function PromoCodes() {
  const { t } = useLanguage()
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'available' | 'used'>('all')

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        // Simulating API call - replace with actual API endpoint
        const response = await fetch('/api/promo-codes')
        if (!response.ok) throw new Error('Failed to fetch promo codes')
        const data = await response.json()
        setPromoCodes(data)
      } catch (err) {
        setError('Failed to load promo codes')
        console.error('Error fetching promo codes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPromoCodes()
  }, [])

  const filteredCodes = promoCodes.filter(code => {
    if (filter === 'all') return true
    if (filter === 'available') return code.status === 'available'
    if (filter === 'used') return code.status === 'used'
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
            {t('promoCodes.title')}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('promoCodes.all')}
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'available'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('promoCodes.available')}
              </button>
              <button
                onClick={() => setFilter('used')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'used'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('promoCodes.used')}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCodes.length === 0 ? (
                  <div className="text-center text-gray-500">
                    {t('promoCodes.noCodes')}
                  </div>
                ) : (
                  filteredCodes.map((code) => (
                    <div
                      key={code.code}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="font-mono text-lg font-semibold">
                          {code.code}
                        </div>
                        {code.status === 'available' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {t('promoCodes.available')}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                            {t('promoCodes.used')}
                          </span>
                        )}
                      </div>
                      {code.prize && (
                        <div className="text-gray-600">
                          {code.prize}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              {t('promoCodes.howToUse')}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('promoCodes.step1')}</li>
              <li>{t('promoCodes.step2')}</li>
              <li>{t('promoCodes.step3')}</li>
              <li>{t('promoCodes.step4')}</li>
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
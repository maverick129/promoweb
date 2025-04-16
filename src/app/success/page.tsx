'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Success() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/code-entry')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          You've successfully won a prize! Our team will contact you shortly with details about your prize collection.
        </p>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            Next Steps
          </h2>
          <ol className="text-left text-gray-600 space-y-2">
            <li>1. Keep your winning code safe</li>
            <li>2. Wait for our SMS confirmation</li>
            <li>3. Visit the designated store to claim your prize</li>
          </ol>
        </div>

        <p className="text-sm text-gray-500">
          Redirecting to code entry in {countdown} seconds...
        </p>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import { FaTicketAlt, FaSpinner } from 'react-icons/fa'
import Footer from '@/components/Footer'

interface Prize {
  id: string
  name: string
  description: string
  image: string
  isInstantWin: boolean
}

export default function CodeEntry() {
  const router = useRouter()
  const { t } = useLanguage()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate code format
    if (!/^[A-Z0-9]{8}$/.test(code)) {
      setError(t('codeEntry.form.error.format'))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('codeEntry.form.error.invalid'))
      }

      // If successful, redirect to prize wheel
      router.push('/prize-wheel')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    // Allow all alphanumeric characters
    if (/^[A-Z0-9]*$/.test(value)) {
      setCode(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <FaTicketAlt className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('codeEntry.title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('codeEntry.subtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                {t('codeEntry.form.code')}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="code"
                  required
                  maxLength={8}
                  value={code}
                  onChange={handleCodeChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest uppercase"
                  placeholder={t('codeEntry.form.codePlaceholder')}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {t('codeEntry.step1')}
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 8}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || code.length !== 8
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('codeEntry.form.submit')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import Footer from '@/components/Footer'

// Icons
import { 
  FaTshirt, 
  FaTrophy, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaGift, 
  FaUsers, 
  FaCalendarAlt, 
  FaTruck, 
  FaSpinner, 
  FaQuestionCircle, 
  FaBox, 
  FaHatCowboy, 
  FaMoneyBillWave, 
  FaMobileAlt, 
  FaTv 
} from 'react-icons/fa'

import { 
  GiWheat, 
  GiCorn, 
  GiPlantRoots, 
  GiSpray, 
  GiFarmer, 
  GiPlantSeed, 
  GiFruitTree, 
  GiSeedling, 
  GiGrain, 
  GiPlantWatering, 
  GiFarmTractor 
} from 'react-icons/gi'

import { MdCelebration } from 'react-icons/md'
import { TbConfetti } from 'react-icons/tb'

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    isdCode: '+62', // Default to Indonesia
    phone: '',
    location: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate code format
    if (!/^[A-Z0-9]{8}$/.test(formData.code)) {
      setError(t('codeEntry.form.error.format'))
      setIsLoading(false)
      return
    }

    // Validate phone number (basic validation)
    const fullPhoneNumber = formData.isdCode + formData.phone
    if (!/^\+62\d{10,12}$|^\+91\d{10}$|^\+65\d{8}$/.test(fullPhoneNumber)) {
      setError(t('codeEntry.form.error.phoneFormat'))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: fullPhoneNumber
        }),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'code') {
      // Allow only alphanumeric characters and convert to uppercase for code
      const upperValue = value.toUpperCase()
      if (/^[A-Z0-9]*$/.test(upperValue)) {
        setFormData(prev => ({ ...prev, [name]: upperValue }))
      }
    } else if (name === 'phone') {
      // Allow only numbers for phone
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const getLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            const data = await response.json()
            const locationString = data.display_name || `${position.coords.latitude}, ${position.coords.longitude}`
            setFormData(prev => ({ ...prev, location: locationString }))
          } catch (error) {
            setError(t('codeEntry.form.error.locationFailed'))
          } finally {
            setIsGettingLocation(false)
          }
        },
        (error) => {
          setError(t('codeEntry.form.error.locationDenied'))
          setIsGettingLocation(false)
        }
      )
    } else {
      setError(t('codeEntry.form.error.locationNotSupported'))
      setIsGettingLocation(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="w-full">
            <img
              src="/images/promo.png"
              alt="Promo Header"
              className="w-full h-auto"
            />
          </div>

          {/* CTA Buttons Section */}
          <div className="bg-white py-6">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/store-finder"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  {t('navigation.findStore')}
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
                >
                  <FaQuestionCircle className="mr-2" />
                  {t('navigation.faq')}
                </Link>
                <Link
                  href="https://www.jivapetani.co.id/jivaprodi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
                >
                  <FaGift className="mr-2" />
                  {t('navigation.viewProducts')}
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Code Entry Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-green-900 mb-4">
              {t('codeEntry.title')}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('codeEntry.subtitle')}
            </p>
          </div>

          <div className="bg-white bg-opacity-60 py-4 sm:py-8 px-4 sm:px-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.code')} *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="code"
                    name="code"
                    required
                    maxLength={8}
                    value={formData.code}
                    onChange={handleInputChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg sm:text-xl tracking-widest uppercase"
                    placeholder={t('codeEntry.form.codePlaceholder')}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.name')} *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.namePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.phone')} *
                </label>
                <div className="mt-1 flex flex-col sm:flex-row gap-2">
                  <select
                    id="isdCode"
                    name="isdCode"
                    value={formData.isdCode}
                    onChange={handleInputChange}
                    className="block w-full sm:w-24 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  >
                    <option value="+62">+62 (ID)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+65">+65 (SG)</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.phonePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.location')} *
                </label>
                <div className="mt-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.locationPlaceholder')}
                    disabled={isLoading || isGettingLocation}
                  />
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={isLoading || isGettingLocation}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                  >
                    {isGettingLocation ? (
                      <FaSpinner className="motion-safe:animate-spin h-5 w-5" />
                    ) : (
                      <FaMapMarkerAlt className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 sm:p-4">
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
                  disabled={isLoading || formData.code.length !== 8 || !formData.name || !formData.phone || !formData.location}
                  className={`w-full flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || formData.code.length !== 8 || !formData.name || !formData.phone || !formData.location
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="motion-safe:animate-spin h-5 w-5 mr-2" />
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

        {/* Prizes Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-green-900 mb-4">
              {t('prizes.title')}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-12"></div>

            {/* Instant Win Prizes */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-green-800 mb-8">
                {t('prizes.instantWin')}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaBox className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.sojikyo5kg.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.sojikyo5kg.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <GiSpray className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.sprayer.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.sprayer.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTshirt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.tshirt.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.tshirt.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaHatCowboy className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.hat.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.hat.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTicketAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.voucher20k.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.voucher20k.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTicketAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.voucher50k.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.voucher50k.description')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTicketAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.instantPrizes.voucher100k.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.instantPrizes.voucher100k.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Raffle Prizes */}
            <div>
              <h3 className="text-2xl font-bold text-center text-green-800 mb-8">
                {t('prizes.rafflePrize')}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="absolute -top-4 right-4">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      {t('prizes.grandPrize')}
                    </span>
                  </div>
                  <div className="text-green-600 mb-4">
                    <FaMoneyBillWave className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.rafflePrizes.cash.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.rafflePrizes.cash.description')}
                  </p>
                  <div className="mt-4 text-sm text-green-700">
                    {t('prizes.rafflePrizes.cash.drawingDate')}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaMobileAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.rafflePrizes.phone.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.rafflePrizes.phone.description')}
                  </p>
                  <div className="mt-4 text-sm text-green-700">
                    {t('prizes.rafflePrizes.phone.drawingDate')}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaBox className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.rafflePrizes.sojikyo300kg.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.rafflePrizes.sojikyo300kg.description')}
                  </p>
                  <div className="mt-4 text-sm text-green-700">
                    {t('prizes.rafflePrizes.sojikyo300kg.drawingDate')}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTv className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.rafflePrizes.tv.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.rafflePrizes.tv.description')}
                  </p>
                  <div className="mt-4 text-sm text-green-700">
                    {t('prizes.rafflePrizes.tv.drawingDate')}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
                  <div className="text-green-600 mb-4">
                    <FaTicketAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-900">
                    {t('prizes.rafflePrizes.voucher2m.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('prizes.rafflePrizes.voucher2m.description')}
                  </p>
                  <div className="mt-4 text-sm text-green-700">
                    {t('prizes.rafflePrizes.voucher2m.drawingDate')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

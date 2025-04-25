'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTshirt, FaTrophy, FaMapMarkerAlt, FaGift, FaTruck, FaSpinner, FaQuestionCircle } from 'react-icons/fa'
import { GiWheat, GiCorn, GiPlantRoots, GiSpray, GiFarmer } from 'react-icons/gi'
import { MdCelebration } from 'react-icons/md'
import { TbConfetti } from 'react-icons/tb'
import { useLanguage } from '@/contexts/LanguageContext'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    code: '',
    name: '',
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
    if (!/^\d{10,12}$/.test(formData.phone)) {
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
        body: JSON.stringify(formData),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          } catch {
            setError(t('codeEntry.form.error.locationFailed'))
          } finally {
            setIsGettingLocation(false)
          }
        },
        () => {
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 relative overflow-hidden">
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <GiWheat className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <GiCorn className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <GiPlantRoots className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/2 right-1/3 animate-float-delay-3">
              <GiSpray className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/3 left-1/2 animate-float-delay-4">
              <FaTruck className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/5 right-1/5 animate-float-delay-5">
              <GiFarmer className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/5 left-1/5 animate-float-delay-6">
              <MdCelebration className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-2/3 right-1/6 animate-float-delay-7">
              <TbConfetti className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/6 left-1/6 animate-float-delay-8">
              <GiCorn className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/6 right-1/6 animate-float-delay-9">
              <GiWheat className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('home.title')}
            </h1>
            <p className="text-lg mb-6 text-white">
              {t('home.subtitle')}
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/store-finder"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaMapMarkerAlt className="mr-2" />
                {t('navigation.findStore')}
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaQuestionCircle className="mr-2" />
                {t('navigation.faq')}
              </Link>
              <Link
                href="https://www.myinstants.com/en/instant/darth-vader-nooooooooo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaGift className="mr-2" />
                {t('navigation.viewProducts')}
              </Link>
            </div>
          </div>
        </div>

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

          <div className="bg-white bg-opacity-60 py-8 px-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest uppercase"
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
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.namePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.phone')} *
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.phonePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  {t('codeEntry.form.location')} *
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder={t('codeEntry.form.locationPlaceholder')}
                    disabled={isLoading || isGettingLocation}
                  />
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={isLoading || isGettingLocation}
                    className="px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
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
                  disabled={isLoading || formData.code.length !== 8 || !formData.name || !formData.phone || !formData.location}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
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
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              {t('home.prizes.title')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTshirt className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.tShirts.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.tShirts.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTrophy className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.caps.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.caps.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.waterBottles.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.waterBottles.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTruck className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.majorPrizes.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.majorPrizes.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

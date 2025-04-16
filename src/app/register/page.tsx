'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { FaUser, FaPhone, FaMapMarkerAlt, FaSpinner, FaLocationArrow } from 'react-icons/fa'

export default function Register() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      lat: 0,
      lng: 0,
      address: '',
      city: '',
      province: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [useManualLocation, setUseManualLocation] = useState(false)

  const handleGetLocation = () => {
    setLocationStatus('loading')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
          setLocationStatus('success')
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationStatus('error')
          setError(t('register.form.location.error'))
        }
      )
    } else {
      setLocationStatus('error')
      setError(t('register.form.location.notSupported'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/code-entry')
    } catch (err) {
      setError(t('register.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const isLocationValid = () => {
    if (useManualLocation) {
      return formData.location.address && formData.location.city && formData.location.province
    }
    return locationStatus === 'success'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('register.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('register.subtitle')}</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('register.form.name')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={t('register.form.namePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('register.form.phone')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={t('register.form.phonePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('register.form.location.label')}
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {t('register.form.location.description')}
              </p>
              
              {!useManualLocation ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationStatus === 'loading'}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      locationStatus === 'loading'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    {locationStatus === 'loading' ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        {t('register.form.location.gettingLocation')}
                      </>
                    ) : (
                      <>
                        <FaLocationArrow className="-ml-1 mr-2 h-5 w-5" />
                        {t('register.form.location.getLocation')}
                      </>
                    )}
                  </button>
                  {locationStatus === 'success' && (
                    <p className="mt-2 text-sm text-green-600">
                      {t('register.form.location.success')}
                    </p>
                  )}
                  {locationStatus === 'error' && (
                    <p className="mt-2 text-sm text-red-600">
                      {t('register.form.location.error')}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setUseManualLocation(true)}
                    className="mt-2 text-sm text-green-600 hover:text-green-700"
                  >
                    {t('register.form.location.manual')}
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {t('register.form.location.address')}
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={formData.location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder={t('register.form.location.addressPlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      {t('register.form.location.city')}
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={formData.location.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder={t('register.form.location.cityPlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      {t('register.form.location.province')}
                    </label>
                    <input
                      type="text"
                      id="province"
                      required
                      value={formData.location.province}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, province: e.target.value }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder={t('register.form.location.provincePlaceholder')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseManualLocation(false)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    {t('register.form.location.getLocation')}
                  </button>
                </div>
              )}
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
                disabled={isLoading || !isLocationValid()}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || !isLocationValid()
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
                  t('register.form.submit')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
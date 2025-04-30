'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { FaMapMarkerAlt, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

interface Store {
  id: string
  name: string
  address: string
  city: string
  province: string
  latitude: number
  longitude: number
  distance?: number
  phone: string
}

export default function StoreFinder() {
  const { t } = useLanguage()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [currentPage, setCurrentPage] = useState(1)
  const storesPerPage = 5
  const [, setSearchLocation] = useState<[number, number] | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  // Helper function to validate Indonesian and Singaporean phone numbers
  const isValidPhone = (phone: string): boolean => {
    // Remove any spaces, dashes, or plus signs
    const cleanedPhone = phone.replace(/[\s\-+]/g, '')
    
    // Check if it's a valid Indonesian or Singaporean phone number format
    // Indonesian: +62 XXXX XXXX XXXX or 08XX XXXX XXXX
    // Singaporean: +65 XXXX XXXX or 65 XXXX XXXX or 9XXXXXXX
    const phoneRegex = /^(?:(?:\+62|0)(?:\d{8,15})|(?:\+65|65)(?:\d{8})|9\d{7})$/
    return phoneRegex.test(cleanedPhone)
  }

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLocationPermission('denied')
      return
    }

    // Check permission status
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      setLocationPermission(permissionStatus.state)
      permissionStatus.onchange = () => {
        setLocationPermission(permissionStatus.state)
      }
    })
  }, [])

  // Helper function to calculate distance between two points in kilometers
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {

    const toRad = (value: number) => {
      return value * Math.PI / 180
    }

    const R = 6371 // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  const handleUseMyLocation = () => {
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])
        setSearchLocation([latitude, longitude])

        // Calculate distances for all stores
        const storesWithDistances = stores.map(store => {
          const distance = calculateDistance(
            latitude,
            longitude,
            store.latitude,
            store.longitude
          )
          return { ...store, distance }
        })

        // Sort stores by distance
        const sortedStores = [...storesWithDistances].sort((a, b) => 
          (a.distance || Infinity) - (b.distance || Infinity)
        )
        
        setStores(sortedStores)
        setLoading(false)
        setLocationPermission('granted')
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
            setLocationPermission('denied')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

  useEffect(() => {
    // Load stores from API
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores')
        if (!response.ok) throw new Error('Failed to fetch stores')
        const data = await response.json()

        // If user location is available, sort stores by distance
        if (userLocation) {
          const storesWithDistances = data.map((store: Store) => {
            const distance = calculateDistance(
              userLocation[0],
              userLocation[1],
              store.latitude,
              store.longitude
            )
            return { ...store, distance }
          })

          // Sort stores by distance
          const sortedStores = [...storesWithDistances].sort((a, b) => 
            (a.distance || Infinity) - (b.distance || Infinity)
          )

          setStores(sortedStores)
        } else {
          setStores(data)
        }
      } catch (err) {
        setError('Failed to load stores')
        console.error('Error fetching stores:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [userLocation, calculateDistance]) // Add userLocation as dependency

  const handleAddressSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    // Check if the search query is a phone number
    if (isValidPhone(searchQuery)) {
      // Search by phone number
      const filteredByPhone = stores.filter(store => 
        store.phone.replace(/[\s\-+]/g, '').includes(searchQuery.replace(/[\s\-+]/g, ''))
      )
      
      if (filteredByPhone.length === 0) {
        setError('No stores found with this phone number')
        setLoading(false)
        return
      }

      setStores(filteredByPhone)
      setLoading(false)
      return
    }

    try {
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      )
      
      if (!response.ok) throw new Error('Failed to geocode address')
      
      const data = await response.json()
      
      if (data.length === 0) {
        throw new Error('No results found for this address')
      }

      const { lat, lon } = data[0]
      const searchCoords: [number, number] = [parseFloat(lat), parseFloat(lon)]
      setSearchLocation(searchCoords)
      
      // Calculate distances for all stores
      const storesWithDistances = stores.map(store => {
        const distance = calculateDistance(
          searchCoords[0],
          searchCoords[1],
          store.latitude,
          store.longitude
        )
        return { ...store, distance }
      })
      
      // Sort stores by distance
      const sortedStores = [...storesWithDistances].sort((a, b) => 
        (a.distance || Infinity) - (b.distance || Infinity)
      )
      
      setStores(sortedStores)
    } catch (err) {
      setError('Failed to find location. Please try a different address.')
      console.error('Error geocoding address:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store => {
    const query = searchQuery.toLowerCase()
    return (
      store.name.toLowerCase().includes(query) ||
      store.province.toLowerCase().includes(query)
    )
  })

  // Calculate pagination
  const indexOfLastStore = currentPage * storesPerPage
  const indexOfFirstStore = indexOfLastStore - storesPerPage
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore)
  const totalPages = Math.ceil(filteredStores.length / storesPerPage)

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
  }

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  }

  const mapCenter = selectedStore 
    ? { lat: selectedStore.latitude, lng: selectedStore.longitude }
    : defaultCenter

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="w-full">
          <img
            src="/images/store-finder-header.png"
            alt="Store Finder Header"
            className="w-full h-auto"
          />
        </div>

        {/* Search and Map Section */}
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Search Section */}
            <div className="bg-white bg-opacity-60 p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
              <div className="mb-3 sm:mb-4 md:mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {t('storeFinder.search.label')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex flex-1">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('storeFinder.search.placeholder')}
                      className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      onClick={handleAddressSearch}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {t('storeFinder.search.button')}
                    </button>
                  </div>
                  <button
                    onClick={handleUseMyLocation}
                    disabled={loading || locationPermission === 'denied'}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaMapMarkerAlt />
                    )}
                    {t('storeFinder.useMyLocation')}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                  </p>
                )}
              </div>

              {/* Store List */}
              <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                {currentStores.map((store) => (
                  <div
                    key={store.id}
                    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedStore?.id === store.id
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => handleStoreSelect(store)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{store.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{store.address}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{store.phone}</p>
                      </div>
                      {store.distance !== undefined && (
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                          <FaMapMarkerAlt className="text-blue-600 text-xs" />
                          <span className="text-xs sm:text-sm text-blue-600 font-medium">
                            {store.distance.toFixed(1)} km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-3 sm:mt-4 md:mt-6 flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    {t('common.previous')}
                  </button>
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    {t('common.next')}
                  </button>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-white bg-opacity-60 p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
              <div className="w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map
                  userLocation={userLocation}
                  stores={filteredStores}
                  onStoreSelect={handleStoreSelect}
                  center={mapCenter}
                  zoom={13}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
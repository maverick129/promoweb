'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import dynamic from 'next/dynamic'
import { FaMapMarkerAlt, FaSearch, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  const [searchLocation, setSearchLocation] = useState<[number, number] | null>(null)

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

  useEffect(() => {
    // Load stores from API
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores')
        if (!response.ok) throw new Error('Failed to fetch stores')
        const data = await response.json()
        setStores(data)
      } catch (err) {
        setError('Failed to load stores')
        console.error('Error fetching stores:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  // Helper function to calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const toRad = (value: number) => {
    return value * Math.PI / 180
  }

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

  const handleAddressSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">
            {t('storeFinder.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            {t('storeFinder.subtitle')}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search and Store List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddressSearch()
                        }
                      }}
                      placeholder={t('storeFinder.searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  <button
                    onClick={handleUseMyLocation}
                    disabled={loading || locationPermission === 'denied'}
                    className={`flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-md ${
                      locationPermission === 'denied'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t('storeFinder.useMyLocation')}
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        {t('storeFinder.useMyLocation')}
                      </>
                    )}
                  </button>

                  {locationPermission === 'denied' && (
                    <div className="text-red-500 text-sm flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      {t('storeFinder.locationDenied')}
                    </div>
                  )}

                  {error && (
                    <div className="text-red-500 text-sm flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      {error}
                    </div>
                  )}

                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {t('storeFinder.stores')} ({filteredStores.length})
                    </h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {currentStores.map((store) => (
                        <div
                          key={store.id}
                          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUserLocation([store.latitude, store.longitude])}
                        >
                          <h3 className="font-semibold text-green-800">{store.name}</h3>
                          <p className="text-sm text-gray-600">{store.address}</p>
                          <p className="text-sm text-gray-600">{store.city}, {store.province}</p>
                          {store.distance && (
                            <p className="text-sm text-green-600 mt-1">
                              {store.distance.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-4 space-x-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px]">
                <Map
                  stores={filteredStores}
                  userLocation={searchLocation || userLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
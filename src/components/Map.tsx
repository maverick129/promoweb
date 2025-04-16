'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

interface MapProps {
  userLocation: [number, number] | null
  stores: Store[]
  onStoreSelect?: (store: Store) => void
}

// Custom store marker icon
const storeIcon = L.icon({
  iconUrl: '/images/store-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

// User location marker icon
const userIcon = L.icon({
  iconUrl: '/images/user-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Selected store marker icon
const selectedStoreIcon = L.icon({
  iconUrl: '/images/selected-store-marker.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
})

// Add pulsing effect to markers
const createPulsingIcon = (icon: L.Icon) => {
  const iconSize = icon.options.iconSize as [number, number]
  const pulsingIcon = L.divIcon({
    className: 'pulsing-marker',
    html: `<div class="pulsing-marker-inner" style="background-image: url('${icon.options.iconUrl}'); width: ${iconSize[0]}px; height: ${iconSize[1]}px;"></div>`,
    iconSize: iconSize,
    iconAnchor: icon.options.iconAnchor as [number, number],
    popupAnchor: icon.options.popupAnchor as [number, number]
  })
  return pulsingIcon
}

// Dynamically import the MapContainer and other components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Create a wrapper component for the map content
const MapContentWrapper = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { useMap } = mod
    return function MapContent({ userLocation, stores, onStoreSelect }: MapProps) {
      const map = useMap()
      const [selectedStore, setSelectedStore] = useState<Store | null>(null)
      const [isMapReady, setIsMapReady] = useState(false)

      useEffect(() => {
        if (map) {
          setIsMapReady(true)
        }
      }, [map])

      useEffect(() => {
        if (isMapReady && userLocation) {
          map.setView(userLocation, 13)
        } else if (isMapReady && stores.length > 0) {
          // Center on first store if no user location
          const firstStore = stores[0]
          map.setView([firstStore.latitude, firstStore.longitude], 13)
        }
      }, [map, userLocation, stores, isMapReady])

      const handleStoreClick = (store: Store) => {
        setSelectedStore(store)
        onStoreSelect?.(store)
        map.setView([store.latitude, store.longitude], 15)
      }

      if (!isMapReady) {
        return null
      }

      return (
        <>
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="font-medium">Your Location</div>
              </Popup>
            </Marker>
          )}

          {stores.map((store) => (
            <Marker
              key={store.id}
              position={[store.latitude, store.longitude]}
              icon={selectedStore?.id === store.id ? createPulsingIcon(selectedStoreIcon) : createPulsingIcon(storeIcon)}
              eventHandlers={{
                click: () => handleStoreClick(store)
              }}
            >
              <Popup>
                <div className="min-w-[250px] p-3">
                  <h3 className="font-bold text-lg text-green-800 mb-2">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                  <p className="text-sm text-gray-600 mb-2">{store.city}, {store.province}</p>
                  {store.distance && (
                    <p className="text-sm text-green-600 font-medium mb-3">
                      Distance: {store.distance.toFixed(1)} km
                    </p>
                  )}
                  <button
                    onClick={() => handleStoreClick(store)}
                    className="w-full py-2 px-4 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    View Store
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )
    }
  }),
  { ssr: false }
)

export default function Map({ userLocation, stores, onStoreSelect }: MapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Default to Jakarta if no location is available
  const defaultCenter: [number, number] = [-6.2088, 106.8456]

  if (!isClient) {
    return (
      <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapContentWrapper userLocation={userLocation} stores={stores} onStoreSelect={onStoreSelect} />
      </MapContainer>
    </div>
  )
} 
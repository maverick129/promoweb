import { GoogleMap as GoogleMapComponent, useLoadScript, Libraries } from '@react-google-maps/api'
import { ReactNode } from 'react'

interface GoogleMapProps {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  mapContainerClassName: string
  children?: ReactNode
}

const libraries: Libraries = ['places']

export function GoogleMap({ center, zoom, mapContainerClassName, children }: GoogleMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }

  return (
    <GoogleMapComponent
      mapContainerClassName={mapContainerClassName}
      center={center}
      zoom={zoom}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      {children}
    </GoogleMapComponent>
  )
} 
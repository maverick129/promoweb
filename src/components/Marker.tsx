import { Marker as MarkerComponent } from '@react-google-maps/api'
import { ReactNode } from 'react'

interface MarkerProps {
  position: {
    lat: number
    lng: number
  }
  title?: string
  children?: ReactNode
}

export function Marker({ position, title, children }: MarkerProps) {
  return (
    <MarkerComponent position={position} title={title}>
      {children}
    </MarkerComponent>
  )
} 
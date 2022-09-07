import { useState } from 'react'
import { CarCallout } from './CarCallout'
import { Icon, IconArea, MarkerMB } from './style'

interface Coordinate {
  latitude: number
  longitude: number
}

interface MarkerProps {
  coordinate: Coordinate
  plate: string
}

export function CarMarker({ coordinate, plate }: MarkerProps) {
  const [showCallout, setShowCallout] = useState<boolean>(false)

  return (
    <MarkerMB latitude={coordinate?.latitude} longitude={coordinate?.longitude}>
      <IconArea onClick={() => setShowCallout(!showCallout)}>
        <Icon size={35} src={'/assets/car.png'} />
        <Icon size={10} src={'/assets/triangle.png'} />
      </IconArea>
      <CarCallout plate={plate} showCallout={showCallout} />
    </MarkerMB>
  )
}

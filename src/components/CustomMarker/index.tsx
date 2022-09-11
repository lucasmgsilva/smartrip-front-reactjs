import { useState } from 'react'
import { MarkerCallout } from './MarkerCallout'
import { Icon, IconArea, Marker } from './style'

interface Coordinate {
  latitude: number
  longitude: number
}

interface MarkerProps {
  type: 'bus' | 'minibus' | 'van' | 'stoppingPoint'
  coordinate: Coordinate
  title: string
  subtitle?: string
}

export function CustomMarker({
  type,
  coordinate,
  title,
  subtitle,
}: MarkerProps) {
  const [showCallout, setShowCallout] = useState<boolean>(false)

  const IconChoice = {
    bus: '/assets/bus.png',
    minibus: '/assets/minibus.png',
    van: '/assets/van.png',
    stoppingPoint: '/assets/stoppingPoint.png',
  }

  return (
    <Marker latitude={coordinate?.latitude} longitude={coordinate?.longitude}>
      <IconArea onClick={() => setShowCallout(!showCallout)}>
        <Icon size={35} src={IconChoice[type]} />
        {type !== 'stoppingPoint' && (
          <Icon size={10} src={'/assets/triangle.png'} />
        )}
      </IconArea>
      {title && (
        <MarkerCallout
          title={title}
          subtitle={subtitle}
          showCallout={showCallout}
        />
      )}
    </Marker>
  )
}

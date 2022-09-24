import { useRef, useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CarAreaSlider } from '../components/CarAreaSlider'
import { Box, Flex, Spinner } from '@chakra-ui/react'

const API_TOKEN =
  'pk.eyJ1IjoibHVjYXNtZ3NpbHZhIiwiYSI6ImNreHF0aGVidDRlaGQybm80OWg2dzVoeXQifQ.exF-UiLvicFXXWKMkn4Kfg'

interface Region {
  latitude: number
  longitude: number
  zoom: number
}

interface Tracking {
  lat: number
  lng: number
  speed: number
  stoppingPointsPerformed_id?: string[]
}

interface Trip {
  _id: string
  route_id: string
  vehicle_id: string
  startTime: Date
  endTime?: Date
  isWayBack: boolean
  stoppingPointsPerformed_id: string[]
  tracking: Tracking[]
}

interface Coordinate {
  lat: number
  lng: number
}

interface StoppingPoint {
  _id: string
  description: string
  executionOrder: number
  coordinates: Coordinate
}

interface Route {
  description: string
  stoppingPoints: StoppingPoint[]
  passengers_id: string[]
}

interface Vehicle {
  _id: string
  description: string
  licensePlate: string
  type: 'bus' | 'minibus' | 'van'
}

export function RoutesOld() {
  const mapRef = useRef(null) as any
  const zoom = 17
  const [region, setRegion] = useState<Region>()

  return (
    <Box>
      {!region && (
        <Flex justify="center" mt="20">
          <Spinner size="lg" />
        </Flex>
      )}

      {/* {!!region && ( */}
      <Map
        mapboxAccessToken={API_TOKEN}
        initialViewState={region}
        style={{
          minHeight: '70vh',
          borderRadius: 5,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        ref={mapRef}
        // scrollZoom={false}
        touchZoomRotate={false}
        doubleClickZoom={false}
        onClick={(e) => console.log(e)}
      >
        {/* {route?.stoppingPoints?.map((stoppingPoint) => (
            <CustomMarker
              key={stoppingPoint._id}
              type="stoppingPoint"
              coordinate={{
                latitude: stoppingPoint.coordinates.lat,
                longitude: stoppingPoint.coordinates.lng,
              }}
              title={`PONTO DE PARADA (${stoppingPoint.executionOrder})`}
              subtitle={stoppingPoint.description}
            />
          ))} */}
      </Map>
      {/* )} */}
      <CarAreaSlider>
        {/* {cars?.map((car, index) => (
          <CarItem
            key={index}
            plate={car?.id}
            speed={car.location.speed}
            onPress={() => handleCarItemClick(car?.location)}
          />
        ))} */}
      </CarAreaSlider>
      <Box></Box>
    </Box>
  )
}

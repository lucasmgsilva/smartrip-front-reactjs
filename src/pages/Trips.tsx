import { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CarAreaSlider } from '../components/CarAreaSlider'
import { CarItem } from '../components/CarItem'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { CustomMarker } from '../components/CustomMarker'

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
}

interface Trip {
  _id: string
  route_id: string
  vehicle_id: string
  startTime: Date
  endTime?: Date
  isWayBack: boolean
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

export function Trips() {
  const mapRef = useRef(null) as any
  const zoom = 17
  const [region, setRegion] = useState<Region>()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [currentVehicleLocation, setCurrentVehicleLocation] =
    useState<Tracking | null>(null)

  const tripId = '63081c4d555fc889e64545d3'

  async function getCurrentTrip() {
    try {
      const response = await api.get(`/trips/${tripId}`)
      const data = response.data
      setTrip(data)
      console.log('Trip: ', data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Requisição inválida!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      // setIsSubmitting(false)
    }
  }

  async function getCurrentRoute() {
    try {
      const response = await api.get(`/routes/${trip?.route_id}`)
      const data = response.data
      setRoute(data)
      console.log('Route: ', data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Requisição inválida!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      // setIsSubmitting(false)
    }
  }

  async function getCurrentVehicle() {
    try {
      const response = await api.get(`/vehicles/${trip?.vehicle_id}`)
      const data = response.data
      setVehicle(data)
      console.log('Vehicle: ', data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Requisição inválida!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      // setIsSubmitting(false)
    }
  }

  async function getCurrentVehicleLocation() {
    try {
      const response = await api.get(
        `/trips/${trip?._id}/currentVehicleLocation`,
      )
      const data = response.data as Tracking
      setCurrentVehicleLocation(data)
      setRegion({
        latitude: data.lat,
        longitude: data.lng,
        zoom,
      })
      console.log('Vehicle Location: ', data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Requisição inválida!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      // setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!trip) {
      console.log('aq')
      getCurrentTrip()
    } else if (!route) {
      getCurrentRoute()
    } else if (!vehicle) {
      getCurrentVehicle()
    } else {
      getCurrentVehicleLocation()
      setInterval(() => {
        getCurrentVehicleLocation()
      }, 5000)
    }
  }, [trip, route, vehicle])

  function handleCarItemClick(location: Location) {
    mapRef.current?.flyTo({
      center: [location.lng, location.lat],
      zoom,
      speed: 0.75,
      curve: 1,
      essential: true,
    })
  }

  return (
    <Box>
      {!region && (
        <Flex justify="center" mt="20">
          <Spinner size="lg" />
        </Flex>
      )}

      {!!region && (
        <Map
          mapboxAccessToken={API_TOKEN}
          initialViewState={region}
          style={{
            minHeight: '70vh',
            borderRadius: 5,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          ref={mapRef}
          scrollZoom={false}
          touchZoomRotate={false}
          doubleClickZoom={false}
        >
          {vehicle && currentVehicleLocation && (
            <CustomMarker
              key={vehicle._id}
              type={vehicle.type}
              coordinate={{
                latitude: currentVehicleLocation.lat,
                longitude: currentVehicleLocation.lng,
              }}
              title={vehicle.licensePlate}
              subtitle={vehicle.description}
            />
          )}
          {route?.stoppingPoints?.map((stoppingPoint) => (
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
          ))}
        </Map>
      )}
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
    </Box>
  )
}

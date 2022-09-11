import { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { RTDB } from '../services/RTDB'
import { onValue } from 'firebase/database'
import { CarMarker } from '../components/CarMarker'
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

interface Location {
  lat: number
  lng: number
  speed: number
}

interface Car {
  id: string
  playAlarmSound: boolean
  location: Location
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

export function Trips() {
  const mapRef = useRef(null) as any
  const zoom = 17
  const [region, setRegion] = useState<Region>()
  const [cars, setCars] = useState<Car[]>([])

  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)

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

  useEffect(() => {
    if (!trip) {
      console.log('aq')
      getCurrentTrip()
    } else if (!route) {
      getCurrentRoute()
    }
  }, [trip, route])

  useEffect(() => {
    if (!!cars && !region) {
      if (cars[0]) {
        setRegion({
          latitude: cars[0]?.location.lat,
          longitude: cars[0]?.location.lng,
          zoom,
        })
      }
    }
  }, [cars, region])

  useEffect(() => {
    onValue(RTDB.carsReference, (snapshot) => {
      const updatedCars = [] as Car[]

      snapshot.forEach((child) => {
        const newCar = {
          id: child.key,
          ...child.val(),
        }
        updatedCars.push(newCar)
        // console.log('Car: ', newCar)
      })

      setCars(updatedCars)
    })
  }, [])

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
          {cars?.map((car, index) => (
            <CustomMarker
              key={index}
              type="bus"
              coordinate={{
                latitude: car?.location?.lat,
                longitude: car?.location?.lng,
              }}
              title={car?.id}
            />
          ))}
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
        {cars?.map((car, index) => (
          <CarItem
            key={index}
            plate={car?.id}
            speed={car.location.speed}
            onPress={() => handleCarItemClick(car?.location)}
          />
        ))}
      </CarAreaSlider>
    </Box>
  )
}

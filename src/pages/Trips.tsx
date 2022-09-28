import { useEffect, useRef, useState } from 'react'
import Map, { Layer, Source } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CarAreaSlider } from '../components/CarAreaSlider'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { CustomMarker } from '../components/CustomMarker'
import { directionsApi } from '../services/directionsApi'
import isEqual from 'lodash/isEqual'
import { intervalToDuration } from 'date-fns'

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

export function Trips() {
  const mapRef = useRef(null) as any
  const zoom = 17
  const [region, setRegion] = useState<Region>()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [currentVehicleLocation, setCurrentVehicleLocation] =
    useState<Tracking | null>(null)
  const [directions, setDirections] = useState<any>(null)

  const tripId = '632cedf5bf2505eb437fcf1e'

  const tripDistanceInMeter =
    directions?.routes?.length > 0 ? directions.routes[0].distance : undefined

  const tripDuration =
    directions?.routes?.length > 0
      ? intervalToDuration({
          start: 0,
          end: directions.routes[0].duration * 1000,
        })
      : undefined

  const tripGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry:
          directions?.routes?.length > 0 ? directions.routes[0].geometry : null,
      },
    ],
  }

  async function getCurrentTrip() {
    try {
      const response = await api.get(`/trips/${tripId}`)
      const data = response.data

      if (!isEqual(trip, data)) {
        setTrip((state) => data)
        console.log('Trip: ', data)
      }
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
      const data: Route = response.data

      if (!isEqual(route, data)) {
        // Ordena os pontos de parada pela ordem de execução
        const dataWithSortedStoppingPoints = (
          data as Route
        ).stoppingPoints.sort((a, b) => a.executionOrder - b.executionOrder)

        data.stoppingPoints = dataWithSortedStoppingPoints

        setRoute((state) => data)
        console.log('Route: ', data)
      }
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

      if (!isEqual(vehicle, data)) {
        setVehicle((state) => data)
        console.log('Vehicle: ', data)
      }
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

      if (!isEqual(currentVehicleLocation, data as Tracking | null)) {
        if (Object.keys(data).length > 0) {
          setCurrentVehicleLocation((state) => data)
          setRegion((state) => ({
            latitude: data.lat,
            longitude: data.lng,
            zoom,
          }))

          getDirections(data)
        } else {
          if (route && route?.stoppingPoints?.length > 0) {
            setRegion((state) => ({
              latitude: route.stoppingPoints[0].coordinates.lat,
              longitude: route.stoppingPoints[0].coordinates.lng,
              zoom,
            }))
          }
        }

        console.log('Vehicle location: ', data)
      }
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

  async function getDirections(trackingVehicleData: Tracking) {
    try {
      const remainingStoppingPoint =
        route?.stoppingPoints.filter(
          (stoppingPoint) =>
            !trackingVehicleData.stoppingPointsPerformed_id?.includes(
              stoppingPoint._id,
            ),
        ) ?? []

      if (remainingStoppingPoint?.length > 0) {
        console.log('Pontos de parada remanescentes: ', remainingStoppingPoint)

        const { lng: vehicleLng, lat: vehicleLat } = trackingVehicleData
        const { lng: stoppingPointLng, lat: stoppingPointLat } =
          remainingStoppingPoint[
            trip?.isWayBack ? remainingStoppingPoint.length - 1 : 0
          ].coordinates

        const response = await directionsApi.get(
          `/${vehicleLng},${vehicleLat};${stoppingPointLng},${stoppingPointLat}`,
        )
        const data = response.data
        /* setDirections((state) => ({
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: data.routes[0].geometry }],
        })) */
        setDirections(data)

        console.log('Directions: ', data)
      } else {
        setDirections(null)
        /* setDirections((state) => ({
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: null }],
        })) */
        console.log('Não há mais pontos de parada')
      }
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

  /*   function handleCarItemClick(location: Location) {
      mapRef.current?.flyTo({
        center: [location.lng, location.lat],
        zoom,
        speed: 0.75,
        curve: 1,
        essential: true,
      })
    } */

  useEffect(() => {
    if (!trip) {
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
          // scrollZoom={false}
          touchZoomRotate={false}
          doubleClickZoom={false}
        >
          <Source type="geojson" data={tripGeoJson as any}>
            <Layer
              id="route"
              type="line"
              source="route"
              layout={{
                'line-join': 'round',
                'line-cap': 'round',
              }}
              paint={{
                'line-color': '#888',
                'line-width': 8,
              }}
            />
          </Source>
          {vehicle && currentVehicleLocation && (
            <CustomMarker
              key={vehicle._id}
              type={vehicle.type}
              coordinate={{
                latitude: currentVehicleLocation.lat,
                longitude: currentVehicleLocation.lng,
              }}
              /* title={`${FriendlyVehicleType[vehicle.type].toUpperCase()} (${
                vehicle.licensePlate
              })`} */
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
      <Box>
        {tripDistanceInMeter && (
          <Text>
            Distância:{' '}
            {tripDistanceInMeter >= 1000
              ? (tripDistanceInMeter / 1000).toFixed(2)
              : tripDistanceInMeter.toFixed(2)}{' '}
            {tripDistanceInMeter >= 1000 ? 'km' : 'm'}
          </Text>
        )}
        {tripDuration && (
          <Text>
            Duração Estimada:
            {tripDuration.hours > 0
              ? ` ${tripDuration.hours}h ${tripDuration.minutes}min`
              : tripDuration.minutes > 0
              ? ` ${tripDuration.minutes}min ${tripDuration.seconds}seg`
              : ` ${tripDuration.seconds}seg`}
          </Text>
        )}
        {/* {trip?.endTime && <Text>Viagem encerrada!</Text>} */}
      </Box>
    </Box>
  )
}

import { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { RTDB } from '../services/RTDB'
import { onValue } from 'firebase/database'
import { CarMarker } from '../components/CarMarker'
import { CarAreaSlider } from '../components/CarAreaSlider'
import { CarItem } from '../components/CarItem'
import { Box, Flex, Spinner } from '@chakra-ui/react'

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

export function Trips() {
  const mapRef = useRef(null) as any
  const zoom = 17
  const [region, setRegion] = useState<Region>()
  const [cars, setCars] = useState<Car[]>([])

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
        console.log('Car: ', newCar)
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
            <CarMarker
              key={index}
              coordinate={{
                latitude: car?.location?.lat,
                longitude: car?.location?.lng,
              }}
              plate={car?.id}
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

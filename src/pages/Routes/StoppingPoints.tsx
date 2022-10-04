import { useContext, useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { CustomMarker } from '../../components/CustomMarker'
import { MapLayerMouseEvent } from 'mapbox-gl'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { StoppingPointModal } from '../../modals/StoppingPointModal'
import { useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { toast } from 'react-toastify'
import { AiOutlineDelete } from 'react-icons/ai'
import { Dialog } from '../../components/Dialog'
import { useDialog } from '../../contexts/DialogContext'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { AuthContext } from '../../contexts/AuthContext'

const API_TOKEN =
  'pk.eyJ1IjoibHVjYXNtZ3NpbHZhIiwiYSI6ImNreHF0aGVidDRlaGQybm80OWg2dzVoeXQifQ.exF-UiLvicFXXWKMkn4Kfg'

interface Region {
  latitude: number
  longitude: number
  zoom: number
}

export interface Coordinate {
  lat: number
  lng: number
}

export interface StoppingPoint {
  _id?: string
  description: string
  executionOrder: number
  coordinates: Coordinate
}

interface Route {
  _id: string
  description: string
  stoppingPoints: StoppingPoint[]
  passengers_id: string[]
}

export function StoppingPoints() {
  const modalDisclosure = useDisclosure()
  const dialogDisclosure = useDialog()

  const { user } = useContext(AuthContext)

  const mapRef = useRef(null) as any
  const [region, setRegion] = useState<Region>({
    latitude: -21.434987,
    longitude: -48.95058,
    zoom: 9,
  })

  const [isLoading, setIsLoading] = useState(true)

  const [isInsertMarkerAction, setIsInsertMarkerAction] =
    useState<boolean>(false)
  const [route, setRoute] = useState<Route>()
  const [selectedStoppingPointId, setSelectedStoppingPointId] = useState<
    string | undefined
  >()
  const [coords, setCoords] = useState<Coordinate>()

  const { id: RouteId } = useParams()

  function navigateTo(coordinates: Coordinate) {
    mapRef.current?.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
      speed: 0.75,
      curve: 1,
      essential: true,
    })
  }

  function handleAddStoppingPoint(e: MapLayerMouseEvent) {
    if (isInsertMarkerAction) {
      setSelectedStoppingPointId(undefined)
      modalDisclosure.onOpen()

      const { lat, lng } = e.lngLat

      setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) })

      setIsInsertMarkerAction(false)
    }
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const isAdministrator = user.type === 'administrator'

  function sortRouteStoppingPoints(r: Route) {
    const sortedStoppingPoints = r.stoppingPoints.sort(
      (spA, spB) => spA.executionOrder - spB.executionOrder,
    )

    r.stoppingPoints = sortedStoppingPoints

    return r
  }

  async function getRoute() {
    setIsLoading(true)
    try {
      const response = await api.get(`/routes/${RouteId}`)
      setRoute(sortRouteStoppingPoints(response.data))
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter veículos!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  function addStoppingPoint(route: Route) {
    setRoute(sortRouteStoppingPoints(route))
    setIsInsertMarkerAction(false)
  }

  function updateStoppingPoint(route: Route) {
    setRoute(sortRouteStoppingPoints(route))
  }

  async function deleteStoppingPoint() {
    if (selectedStoppingPointId && route) {
      try {
        const currRoute = { ...route }
        currRoute.stoppingPoints = currRoute.stoppingPoints?.filter(
          (stoppingPoint) => stoppingPoint._id !== selectedStoppingPointId,
        )
        await api.put(`/routes/${route?._id}`, currRoute)

        setRoute(sortRouteStoppingPoints(sortRouteStoppingPoints(currRoute)))
        toast.success('Ponto de parada removido com sucesso!')
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error('Falha ao remover ponto de parada!')
        } else {
          toast.error(
            'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
          )
        }
      } finally {
        dialogDisclosure.onClose()
      }
    }
  }

  useEffect(() => {
    getRoute()
  }, [])

  return (
    <Box>
      {!region && (
        <Flex justify="center" mt="20">
          <Spinner size="lg" />
        </Flex>
      )}
      <Flex mb="8" flexDir="column" width="100%">
        <Flex
          flexDir={['column', null, null, 'row']}
          flex={1}
          justifyContent="space-between"
          rowGap="4"
        >
          <Heading size="lg" fontWeight="normal">
            Pontos de Parada
          </Heading>
          {isAdministrator && (
            <Button
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              filter={
                isInsertMarkerAction ? 'brightness(0.5)' : 'brightness(1)'
              }
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              onClick={() => {
                setIsInsertMarkerAction(!isInsertMarkerAction)
              }}
            >
              Adicionar Ponto de Parada
            </Button>
          )}
        </Flex>
        {route?.description ? (
          <Heading size="md" fontWeight="normal" mt={['4', null, null, 0]}>
            {route?.description}
          </Heading>
        ) : (
          <Skeleton height={35} width="100%" mb={2} />
        )}
      </Flex>

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
          onClick={handleAddStoppingPoint}
        >
          {route?.stoppingPoints.map((stoppingPoint) => (
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

      <SimpleGrid mt="12">
        {isLoading ? (
          Array(15)
            .fill(0)
            .map((val, i) => (
              <Skeleton key={i} height={35} width="100%" mb={2} />
            ))
        ) : (
          <TableContainer>
            <Table variant="striped" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Or. Exec.</Th>
                  <Th width="50%">Descrição</Th>
                  <Th>Latitude</Th>
                  <Th>Longitude</Th>
                  <Th>Controles</Th>
                </Tr>
              </Thead>
              <Tbody>
                {route?.stoppingPoints.map((stoppingPoint) => {
                  return (
                    <Tr key={stoppingPoint._id}>
                      <Td>{stoppingPoint.executionOrder}</Td>
                      <Td>{stoppingPoint.description}</Td>
                      <Td>{stoppingPoint.coordinates.lat}</Td>
                      <Td>{stoppingPoint.coordinates.lng}</Td>
                      <Td>
                        <Flex gap="1">
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="teal"
                            leftIcon={
                              <Icon as={FaMapMarkerAlt} fontSize="16" />
                            }
                            onClick={() =>
                              navigateTo({
                                lat: stoppingPoint.coordinates.lat,
                                lng: stoppingPoint.coordinates.lng,
                              } as Coordinate)
                            }
                          >
                            {isWideVersion && 'Seguir'}
                          </Button>
                          {isAdministrator && (
                            <>
                              <Button
                                size="sm"
                                fontSize="sm"
                                colorScheme="purple"
                                leftIcon={
                                  <Icon as={RiPencilLine} fontSize="16" />
                                }
                                onClick={() => {
                                  setSelectedStoppingPointId(stoppingPoint._id)
                                  modalDisclosure.onOpen()
                                }}
                              >
                                {isWideVersion && 'Editar'}
                              </Button>
                              <Button
                                size="sm"
                                fontSize="sm"
                                colorScheme="red"
                                leftIcon={
                                  <Icon as={AiOutlineDelete} fontSize="16" />
                                }
                                onClick={() => {
                                  setSelectedStoppingPointId(stoppingPoint._id)
                                  dialogDisclosure.onOpen()
                                }}
                              >
                                {isWideVersion && 'Remover'}
                              </Button>
                            </>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </SimpleGrid>
      <StoppingPointModal
        disclosure={modalDisclosure}
        onAddStoppingPoint={addStoppingPoint}
        onUpdateStoppingPoint={updateStoppingPoint}
        selectedRouteId={RouteId}
        selectedStoppingPointId={selectedStoppingPointId}
        coords={coords}
      />
      <Dialog
        title="Remover Ponto de Parada"
        message={`Tem certeza que deseja remover o ponto de parada "${
          route?.stoppingPoints.find(
            (stoppingPoint) => stoppingPoint._id === selectedStoppingPointId,
          )?.description
        }"? Você não pode desfazer essa ação depois.`}
        onDeleteAction={deleteStoppingPoint}
      />
    </Box>
  )
}

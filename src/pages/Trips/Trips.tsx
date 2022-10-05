import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Skeleton,
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
import { useContext, useEffect, useState } from 'react'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { TripModal } from '../../modals/TripModal'
import { api } from '../../services/api'
import { Dialog } from '../../components/Dialog'
import { useDialog } from '../../contexts/DialogContext'
import { AuthContext } from '../../contexts/AuthContext'
import { Route } from '../Routes/Routes'
import { Vehicle } from '../Vehicles'
import { FaLocationArrow } from 'react-icons/fa'
import { useNavigate } from 'react-router'

export interface Trip {
  _id: string
  route_id: string
  startTime: Date
  endTime: Date
  vehicle_id: string
  isWayBack: boolean

  route: Route
  vehicle: Vehicle
}

export function Trips() {
  const { user } = useContext(AuthContext)

  const modalDisclosure = useDisclosure()
  const dialogDisclosure = useDialog()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripId, setSelectedTripId] = useState<String | undefined>()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const isAdministratorOrDriver =
    user.type === 'administrator' || user.type === 'driver'

  const isAdministrator = user.type === 'administrator'

  async function getTrips() {
    setIsLoading(true)
    try {
      const response = await api.get(`/trips/byUser/${user._id}`)

      const tripsData = response.data.map(async (trip: Trip) => {
        const routeResponse = await api.get(`/routes/${trip.route_id}`)

        trip.route = routeResponse.data

        const vehicleResponse = await api.get(`/vehicles/${trip.vehicle_id}`)

        trip.vehicle = vehicleResponse.data
        return trip
      })

      setTrips(await Promise.all(tripsData))
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter viagens!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function addTrip(trip: Trip) {
    const routeResponse = await api.get(`/routes/${trip.route_id}`)

    const vehicleResponse = await api.get(`/vehicles/${trip.vehicle_id}`)

    trip.route = routeResponse.data
    trip.vehicle = vehicleResponse.data

    setTrips([...trips, trip])
  }

  async function updateTrip(trip: Trip) {
    const routeResponse = await api.get(`/routes/${trip.route_id}`)

    const vehicleResponse = await api.get(`/vehicles/${trip.vehicle_id}`)

    trip.route = routeResponse.data
    trip.vehicle = vehicleResponse.data

    setTrips((state) => state.map((v) => (v._id === trip._id ? trip : v)))
  }

  async function deleteTrip() {
    if (selectedTripId) {
      try {
        await api.delete(`/trips/${selectedTripId}`)

        setTrips((state) => state.filter((v) => v._id !== selectedTripId))

        toast.success('Viagem removido com sucesso!')
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error('Falha ao remover viagem!')
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
    getTrips()
  }, [])

  return (
    <Box>
      <Flex mb="8" justifyContent="space-between" alignItems="center">
        <Heading size="lg" fontWeight="normal">
          Viagens
        </Heading>
        {isAdministratorOrDriver && (
          <Button
            size="sm"
            fontSize="sm"
            colorScheme="pink"
            leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            onClick={() => {
              setSelectedTripId(undefined)
              modalDisclosure.onOpen()
            }}
          >
            Iniciar Viagem
          </Button>
        )}
      </Flex>
      <SimpleGrid>
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
                  <Th width="50%">Desc. da Rota</Th>
                  <Th>Veículo</Th>
                  <Th>Status</Th>
                  <Th>Controles</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trips.map((trip) => {
                  const inicio = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(trip.startTime))

                  const fim =
                    trip?.endTime &&
                    new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(trip.endTime))

                  return (
                    <Tr key={trip._id}>
                      <Td>{trip.route?.description}</Td>
                      <Td>{trip?.vehicle?.licensePlate}</Td>
                      <Td>
                        {trip.endTime ? (
                          <Badge colorScheme="red" title={fim}>
                            Finalizada
                          </Badge>
                        ) : (
                          <Badge colorScheme="green" title={inicio}>
                            Em andamento
                          </Badge>
                        )}
                      </Td>
                      <Td>
                        <Flex gap="1">
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="teal"
                            leftIcon={
                              <Icon as={FaLocationArrow} fontSize="16" />
                            }
                            onClick={() => {
                              navigate(`/viagens/${trip._id}`)
                            }}
                            disabled={!!trip.endTime}
                          >
                            {isWideVersion && 'Acompanhar'}
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
                                  setSelectedTripId(trip._id)
                                  modalDisclosure.onOpen()
                                }}
                                disabled={!!trip.endTime}
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
                                  setSelectedTripId(trip._id)
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
      <TripModal
        disclosure={modalDisclosure}
        onAddTrip={addTrip}
        onUpdateTrip={updateTrip}
        selectedTripId={selectedTripId}
      />
      <Dialog
        title="Remover Viagem"
        message={`Tem certeza que deseja remover a viagem "${
          trips.find((v) => v._id === selectedTripId)?.route.description
        }"? Você não pode desfazer essa ação depois.`}
        onDeleteAction={deleteTrip}
      />
    </Box>
  )
}

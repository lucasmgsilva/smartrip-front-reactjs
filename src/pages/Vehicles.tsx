import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
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
import { useEffect, useState } from 'react'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { VehiclesModal } from '../modals/VehicleModal'
import { api } from '../services/api'
import { Dialog } from '../components/Dialog'
import { useDialog } from '../contexts/DialogContext'

export type VehicleType = 'bus' | 'micro_bus' | 'van'

const FriendlyVehicleType = {
  bus: 'Ônibus',
  micro_bus: 'Micro-ônibus',
  van: 'Van',
}

export interface Vehicle {
  _id?: string
  description: string
  licensePlate: string
  type: VehicleType
}

export function Vehicles() {
  const modalDisclosure = useDisclosure()
  const dialogDisclosure = useDialog()

  const [isLoading, setIsLoading] = useState(true)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    String | undefined
  >()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  async function getVehicles() {
    setIsLoading(true)
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
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

  function addVehicle(vehicle: Vehicle) {
    setVehicles([...vehicles, vehicle])
  }

  function updateVehicle(vehicle: Vehicle) {
    setVehicles((state) =>
      state.map((v) => (v._id === vehicle._id ? vehicle : v)),
    )
  }

  async function deleteVehicle() {
    if (selectedVehicleId) {
      try {
        await api.delete(`/vehicles/${selectedVehicleId}`)

        setVehicles((state) => state.filter((v) => v._id !== selectedVehicleId))

        toast.success('Veículo removido com sucesso!')
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error('Falha ao remover veículo!')
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
    getVehicles()
  }, [])

  return (
    <Box>
      <Flex mb="8" justifyContent="space-between" alignItems="center">
        <Heading size="lg" fontWeight="normal">
          Veículos
        </Heading>
        <Button
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          leftIcon={<Icon as={RiAddLine} fontSize="20" />}
          onClick={() => {
            setSelectedVehicleId(undefined)
            modalDisclosure.onOpen()
          }}
        >
          Cadastrar Veículo
        </Button>
      </Flex>
      <Box>
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
                  <Th width="50%">Descrição</Th>
                  <Th>Placa</Th>
                  <Th>Tipo</Th>
                  <Th>Controles</Th>
                </Tr>
              </Thead>
              <Tbody>
                {vehicles.map((vehicle) => {
                  return (
                    <Tr key={vehicle._id}>
                      <Td>{vehicle.description}</Td>
                      <Td>{vehicle.licensePlate}</Td>
                      <Td>{FriendlyVehicleType[vehicle.type]}</Td>
                      <Td>
                        <Flex gap="1">
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                            onClick={() => {
                              setSelectedVehicleId(vehicle._id)
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
                              setSelectedVehicleId(vehicle._id)
                              dialogDisclosure.onOpen()
                            }}
                          >
                            {isWideVersion && 'Remover'}
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <VehiclesModal
        disclosure={modalDisclosure}
        onAddVehicle={addVehicle}
        onUpdateVehicle={updateVehicle}
        selectedVehicleId={selectedVehicleId}
      />
      <Dialog
        title="Remover Veículo"
        message={`Tem certeza que deseja remover o veículo "${
          vehicles.find((v) => v._id === selectedVehicleId)?.description
        }"? Você não pode desfazer essa ação depois.`}
        onDeleteAction={deleteVehicle}
      />
    </Box>
  )
}

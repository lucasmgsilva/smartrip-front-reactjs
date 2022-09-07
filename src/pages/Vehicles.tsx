import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { VehiclesModal } from '../modals/VehicleModal'
import { api } from '../services/api'

export type VehicleType = 'bus' | 'micro_bus' | 'van'

const FriendlyVehicleType = {
  bus: 'Ônibus',
  micro_bus: 'Micro-ônibus',
  van: 'Van',
}

interface Vehicle {
  _id: string
  description: string
  licensePlate: string
  type: VehicleType
}

export function Vehicles() {
  const disclosure = useDisclosure()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  async function getVehicles() {
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
          onClick={disclosure.onOpen}
        >
          Cadastrar Veículo
        </Button>
      </Flex>
      <Box overflowX="scroll">
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
                    <Td></Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <VehiclesModal disclosure={disclosure} />
    </Box>
  )
}

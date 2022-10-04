import {
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
import { MdEditLocationAlt } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { RoutesModal } from '../../modals/RouteModal'
import { api } from '../../services/api'
import { Dialog } from '../../components/Dialog'
import { useDialog } from '../../contexts/DialogContext'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

import { isAdmin } from '@firebase/util'
interface Coordinate {
  lat: number
  lng: number
}

interface StoppingPoint {
  _id?: string
  description: string
  executionOrder: number
  coordinates: Coordinate
}

export interface Route {
  _id: string
  description: string
  stoppingPoints: StoppingPoint[]
  passengers_id: string[]
}

export function Routes() {
  const modalDisclosure = useDisclosure()
  const dialogDisclosure = useDialog()

  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(true)
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<String | undefined>()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const isAdministrator = user.type === 'administrator'

  async function getRoutes() {
    setIsLoading(true)
    try {
      const response = await api.get('/routes')
      setRoutes(response.data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter rotas!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  function addRoute(route: Route) {
    setRoutes([...routes, route])
  }

  function updateRoute(route: Route) {
    setRoutes((state) => state.map((v) => (v._id === route._id ? route : v)))
  }

  async function deleteRoute() {
    if (selectedRouteId) {
      try {
        await api.delete(`/routes/${selectedRouteId}`)

        setRoutes((state) => state.filter((v) => v._id !== selectedRouteId))

        toast.success('Rota removido com sucesso!')
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error('Falha ao remover rota!')
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
    getRoutes()
  }, [])

  return (
    <Box>
      <Flex mb="8" justifyContent="space-between" alignItems="center">
        <Heading size="lg" fontWeight="normal">
          Rotas
        </Heading>
        {isAdministrator && (
          <Button
            size="sm"
            fontSize="sm"
            colorScheme="pink"
            leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            onClick={() => {
              setSelectedRouteId(undefined)
              modalDisclosure.onOpen()
            }}
          >
            Cadastrar Rota
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
                  <Th width="50%">Descrição</Th>
                  <Th>Qtd. Pontos de Parada</Th>
                  <Th>Qtd. Passageiros</Th>
                  {isAdministrator && <Th>Controles</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {routes.map((route) => {
                  return (
                    <Tr key={route._id}>
                      <Td>{route.description}</Td>
                      <Td>{route.stoppingPoints.length}</Td>
                      <Td>{route.passengers_id.length}</Td>
                      {isAdministrator && (
                        <Td>
                          <Flex gap="1">
                            <Button
                              size="sm"
                              fontSize="sm"
                              colorScheme="purple"
                              leftIcon={
                                <Icon as={RiPencilLine} fontSize="16" />
                              }
                              onClick={() => {
                                setSelectedRouteId(route._id)
                                modalDisclosure.onOpen()
                              }}
                            >
                              {isWideVersion && 'Editar'}
                            </Button>
                            <Button
                              size="sm"
                              fontSize="sm"
                              colorScheme="teal"
                              leftIcon={
                                <Icon as={MdEditLocationAlt} fontSize="16" />
                              }
                              onClick={() =>
                                navigate(`/rotas/pontos-de-parada/${route._id}`)
                              }
                            >
                              {isWideVersion && 'Pontos de Parada'}
                            </Button>
                            <Button
                              size="sm"
                              fontSize="sm"
                              colorScheme="red"
                              leftIcon={
                                <Icon as={AiOutlineDelete} fontSize="16" />
                              }
                              onClick={() => {
                                setSelectedRouteId(route._id)
                                dialogDisclosure.onOpen()
                              }}
                            >
                              {isWideVersion && 'Remover'}
                            </Button>
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </SimpleGrid>
      <RoutesModal
        disclosure={modalDisclosure}
        onAddRoute={addRoute}
        onUpdateRoute={updateRoute}
        selectedRouteId={selectedRouteId}
      />
      <Dialog
        title="Remover Rota"
        message={`Tem certeza que deseja remover o rota "${
          routes.find((v) => v._id === selectedRouteId)?.description
        }"? Você não pode desfazer essa ação depois.`}
        onDeleteAction={deleteRoute}
      />
    </Box>
  )
}

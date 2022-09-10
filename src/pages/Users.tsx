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
import { api } from '../services/api'
import { Dialog } from '../components/Dialog'
import { useDialog } from '../contexts/DialogContext'
import { UserModal } from '../modals/UserModal'

export type UserType = 'student' | 'driver' | 'administrator'

const FriendlyUserType = {
  student: 'Estudante',
  driver: 'Motorista',
  administrator: 'Administrador',
}

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  cellPhone: string
  educationalInstitution?: string
  type: UserType
}

export function Users() {
  const modalDisclosure = useDisclosure()
  const dialogDisclosure = useDialog()

  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<String | undefined>()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  async function getUsers() {
    setIsLoading(true)
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter Usuários!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  function addUser(user: User) {
    setUsers([...users, user])
  }

  function updateUser(user: User) {
    setUsers((state) => state.map((u) => (u._id === user._id ? user : u)))
  }

  async function deleteUser() {
    if (selectedUserId) {
      try {
        await api.delete(`/users/${selectedUserId}`)

        setUsers((state) => state.filter((u) => u._id !== selectedUserId))

        toast.success('Usuário removido com sucesso!')
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error('Falha ao remover Usuário!')
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
    getUsers()
  }, [])

  return (
    <Box>
      <Flex mb="8" justifyContent="space-between" alignItems="center">
        <Heading size="lg" fontWeight="normal">
          Usuários
        </Heading>
        <Button
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          leftIcon={<Icon as={RiAddLine} fontSize="20" />}
          onClick={() => {
            setSelectedUserId(undefined)
            modalDisclosure.onOpen()
          }}
        >
          Cadastrar Usuário
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
                  <Th width="25%">Nome</Th>
                  <Th>Email</Th>
                  <Th>Telefone</Th>
                  <Th>Instituição</Th>
                  <Th>Tipo</Th>
                  <Th>Controles</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => {
                  return (
                    <Tr key={user._id}>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.cellPhone}</Td>
                      <Td>{user.educationalInstitution}</Td>
                      <Td>{FriendlyUserType[user.type]}</Td>
                      <Td>
                        <Flex gap="1">
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                            onClick={() => {
                              setSelectedUserId(user._id)
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
                              setSelectedUserId(user._id)
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
      <UserModal
        disclosure={modalDisclosure}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        selectedUserId={selectedUserId}
      />
      <Dialog
        title="Remover Usuário"
        message={`Tem certeza que deseja remover o usuário "${
          users.find((u) => u._id === selectedUserId)?.name
        }"? Você não pode desfazer essa ação depois.`}
        onDeleteAction={deleteUser}
      />
    </Box>
  )
}

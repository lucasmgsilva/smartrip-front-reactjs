import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { GrFormViewHide, GrFormView } from 'react-icons/gr'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { User, UserType } from '../pages/Users'
import { api } from '../services/api'

interface UserModalProps {
  disclosure: UseDisclosureReturn
  onAddUser: (user: User) => void
  onUpdateUser: (user: User) => void
  selectedUserId?: String | undefined
}

export function UserModal({
  disclosure,
  onAddUser,
  onUpdateUser,
  selectedUserId,
}: UserModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [show, setShow] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cellPhone, setCellPhone] = useState('')
  const [educationalInstitution, setEducationalInstitution] = useState('')
  const [type, setType] = useState<UserType>('student')

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setEmail('')
      setPassword('')
      setCellPhone('')
      setEducationalInstitution('')
      setType('student')
    } else {
      if (selectedUserId) {
        getVehicle()
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  function handleShowPassword() {
    setShow(!show)
  }

  async function handleSaveClick() {
    setIsSubmitting(true)

    try {
      if (!selectedUserId) {
        const response = await api.post('/users', {
          name,
          email,
          password,
          cellPhone,
          educationalInstitution,
          type,
        })
        const user = response.data

        onAddUser(user)
      } else {
        const response = await api.put(`/users/${selectedUserId}`, {
          name,
          email,
          password,
          cellPhone,
          educationalInstitution,
          type,
        })
        const user = response.data

        onUpdateUser(user)
      }

      toast.success('Usuário salvo com sucesso!')
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao salvar usuário. Dados inválidos!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function getVehicle() {
    setIsLoading(true)
    try {
      const response = await api.get(`/users/${selectedUserId}`)
      const user = response.data

      setName(user.name)
      setEmail(user.email)
      setPassword(user.password)
      setCellPhone(user.cellPhone)
      setEducationalInstitution(user.educationalInstitution)
      setType(user.type)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter usuário!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent bgColor="gray.800">
          <ModalHeader fontSize="2xl">Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex as="form" width="100%">
              <Stack spacing={4} flex={1}>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Nome</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                    />
                  </Skeleton>
                </FormControl>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Email</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                    />
                  </Skeleton>
                </FormControl>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Senha</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <InputGroup>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? 'text' : 'password'}
                        focusBorderColor="pink.500"
                        bgColor="gray.900"
                        _hover={{
                          bgColor: 'gray.900',
                        }}
                        variant="filled"
                        size="lg"
                      />
                      <InputRightElement width="4rem" height="3rem">
                        <Button
                          h="1.75rem"
                          size="xs"
                          onClick={handleShowPassword}
                          // style={{ background: 'transparent' }}
                        >
                          {show ? (
                            <Icon
                              as={GrFormView}
                              fontSize={20}
                              color="red.500"
                            />
                          ) : (
                            <Icon
                              as={GrFormViewHide}
                              fontSize={20}
                              color="red.500"
                            />
                          )}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Skeleton>
                </FormControl>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Telefone</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={cellPhone}
                      onChange={(e) => setCellPhone(e.target.value)}
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                    />
                  </Skeleton>
                </FormControl>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Instituição</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={educationalInstitution}
                      onChange={(e) =>
                        setEducationalInstitution(e.target.value)
                      }
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                    />
                  </Skeleton>
                </FormControl>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Tipo</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <RadioGroup
                      value={type}
                      onChange={(value: UserType) => setType(value)}
                    >
                      <Stack direction="row" spacing={8}>
                        <Radio value="student" colorScheme="pink" size="lg">
                          Estudante
                        </Radio>
                        <Radio value="driver" colorScheme="pink" size="lg">
                          Motorista
                        </Radio>
                        <Radio
                          value="administrator"
                          colorScheme="pink"
                          size="lg"
                        >
                          Administrador
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Skeleton>
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isSubmitting}
              loadingText="Salvando..."
              onClick={handleSaveClick}
              disabled={isLoading || isSubmitting}
            >
              Salvar
            </Button>
            <Button colorScheme="yellow" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

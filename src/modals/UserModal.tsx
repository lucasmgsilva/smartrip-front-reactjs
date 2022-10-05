import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../services/api'

const userFormSchema = zod.object({
  name: zod
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: zod
    .string()
    .min(3, 'E-mail deve ter pelo menos 3 caracteres')
    .max(64, 'E-mail deve ter no máximo 64 caracteres')
    .email('E-mail é inválido')
    .transform((value) => value.toLowerCase()),
  password: zod
    .string()
    .max(24, 'Senha deve ter no máximo 24 caracteres')
    .refine((password) => password.length === 0 || password.length >= 6, {
      message: 'Senha deve ter pelo menos 6 caracteres',
    }),
  cellPhone: zod.string().length(15, 'Telefone deve ter 15 caracteres'),
  educationalInstitution: zod
    .string()
    .max(50, 'Instituição de Ensino deve ter no máximo 50 caracteres')
    .refine(
      (value) => value.length === 0 || value.length >= 3,
      'Instituição de Ensino deve ter pelo menos 3 caracteres',
    ),
  // type: zod.string(),
})

export type UserFormData = zod.infer<typeof userFormSchema>

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

  const [type, setType] = useState<UserType>('student')

  const UserForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  })

  const { register, handleSubmit, formState, setValue, reset } = UserForm
  const { errors } = formState

  useEffect(() => {
    if (!isOpen) {
      reset()
      setType('student')
      setShow(false)
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

  async function handleSaveClick(data: UserFormData) {
    setIsSubmitting(true)

    try {
      if (!selectedUserId) {
        const response = await api.post('/users', {
          ...data,
          type,
        })
        const user = response.data

        onAddUser(user)
      } else {
        const response = await api.put(`/users/${selectedUserId}`, {
          ...data,
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

      setValue('name', user.name)
      setValue('email', user.email)
      setValue('password', user.password)
      setValue('cellPhone', user.cellPhone)
      setValue('educationalInstitution', user.educationalInstitution ?? '')
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
            <Flex
              as="form"
              id="userForm"
              width="100%"
              onSubmit={handleSubmit(handleSaveClick)}
            >
              <Stack spacing={4} flex={1}>
                <FormControl isInvalid={!!errors?.name}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Nome</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      autoFocus
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                      {...register('name')}
                    />
                    {!!errors?.name?.message && (
                      <FormErrorMessage>
                        {errors?.name?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl isInvalid={!!errors?.email}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Email</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                      {...register('email')}
                    />
                    {!!errors?.email?.message && (
                      <FormErrorMessage>
                        {errors?.email?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl isInvalid={!!errors?.password}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Senha</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <InputGroup>
                      <Input
                        type={show ? 'text' : 'password'}
                        focusBorderColor="pink.500"
                        bgColor="gray.900"
                        _hover={{
                          bgColor: 'gray.900',
                        }}
                        variant="filled"
                        size="lg"
                        {...register('password')}
                      />
                      <InputRightElement width="4rem" height="3rem">
                        <Button
                          h="1.75rem"
                          size="xs"
                          onClick={handleShowPassword}
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
                    {!!errors?.password?.message && (
                      <FormErrorMessage>
                        {errors?.password?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl isInvalid={!!errors?.cellPhone}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Telefone</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                      {...register('cellPhone')}
                    />
                    {!!errors?.cellPhone?.message && (
                      <FormErrorMessage>
                        {errors?.cellPhone?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl isInvalid={!!errors?.educationalInstitution}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Instituição de Ensino</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      focusBorderColor="pink.500"
                      bgColor="gray.900"
                      _hover={{
                        bgColor: 'gray.900',
                      }}
                      variant="filled"
                      size="lg"
                      {...register('educationalInstitution')}
                    />
                    {!!errors?.educationalInstitution?.message && (
                      <FormErrorMessage>
                        {errors?.educationalInstitution?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.type} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Tipo</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <RadioGroup
                      value={type}
                      onChange={(value: UserType) => setType(value)}
                      // {...register('type')}
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
                    {/* {!!errors?.type?.message && (
                      <FormErrorMessage>
                        {errors?.type?.message}
                      </FormErrorMessage>
                    )} */}
                  </Skeleton>
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="userForm"
              colorScheme="blue"
              mr={3}
              isLoading={isSubmitting}
              loadingText="Salvando..."
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

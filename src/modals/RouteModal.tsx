import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Route } from '../pages/Routes'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../services/api'

import Select from 'react-select'
import { User } from '../pages/Users'

const routeFormSchema = zod.object({
  description: zod
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(75, 'Descrição deve ter no máximo 75 caracteres'),
})

export type RouteFormData = zod.infer<typeof routeFormSchema>

interface RouteModalProps {
  disclosure: UseDisclosureReturn
  onAddRoute: (route: Route) => void
  onUpdateRoute: (route: Route) => void
  selectedRouteId?: String | undefined
}

export function RoutesModal({
  disclosure,
  onAddRoute,
  onUpdateRoute,
  selectedRouteId,
}: RouteModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [route, setRoute] = useState<Route>()
  const [users, setUsers] = useState<User[]>([])

  const passengersOptions = users.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
  }))

  const [selectedPassengers, setSelectedPassengers] = useState<any>()

  const RouteForm = useForm<RouteFormData>({
    resolver: zodResolver(routeFormSchema),
  })

  const { register, handleSubmit, formState, setValue, reset } = RouteForm
  const { errors } = formState

  useEffect(() => {
    if (!isOpen) {
      reset()
      setRoute(undefined)
      setSelectedPassengers([])
    } else {
      getUsers()
      if (selectedRouteId) {
        setIsLoading(true)
        getRoute()
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (route && route.passengers_id.length > 0 && users.length > 0) {
      setSelectedPassengers(
        route.passengers_id.map((passenger_id) => {
          const passenger = users.find((user) => user._id === passenger_id)

          if (passenger) {
            return {
              value: passenger?._id,
              label: `${passenger.name} (${passenger.email})`,
            }
          }
        }),
      )
    }
  }, [route, users])

  async function handleSaveClick(data: RouteFormData) {
    setIsSubmitting(true)

    try {
      const passengers_id = selectedPassengers.map(
        (selectedPassenger) => selectedPassenger.value,
      )

      if (!selectedRouteId) {
        const response = await api.post('/routes', {
          ...data,
          stoppingPoints: [],
          passengers_id,
        })
        const rRoute = response.data

        onAddRoute(rRoute)
      } else {
        const response = await api.put(`/routes/${selectedRouteId}`, {
          ...route,
          ...data,
          passengers_id,
        })
        const rRoute = response.data

        onUpdateRoute(rRoute)
      }

      toast.success('Rota salvo com sucesso!')
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao salvar rota. Dados inválidos!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function getUsers() {
    setIsLoading(true)
    try {
      const response = await api.get(`/users`)
      const users = response.data

      setUsers(users)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter usuários!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function getRoute() {
    setIsLoading(true)
    try {
      const response = await api.get(`/routes/${selectedRouteId}`)
      const route: Route = response.data

      setValue('description', route.description)
      setRoute(route)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter rota!')
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
          <ModalHeader fontSize="2xl">Rota</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              as="form"
              id="routeForm"
              width="100%"
              onSubmit={handleSubmit(handleSaveClick)}
            >
              <Stack spacing={4} flex={1}>
                <FormControl isInvalid={!!errors?.description}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Descrição</FormLabel>
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
                      {...register('description')}
                    />
                    {!!errors?.description?.message && (
                      <FormErrorMessage>
                        {errors?.description?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.users} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Passageiros</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Select
                      isMulti
                      isSearchable
                      closeMenuOnSelect={false}
                      value={selectedPassengers}
                      onChange={setSelectedPassengers}
                      options={passengersOptions}
                    />
                    {/* {!!errors?.description?.message && (
                      <FormErrorMessage>
                        {errors?.description?.message}
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
              form="routeForm"
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

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
  Select,
  Skeleton,
  Stack,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../services/api'
import { Route } from '../pages/Routes'
import { Coordinate, StoppingPoint } from '../pages/StoppingPoints'

const stoppingPointFormSchema = zod.object({
  description: zod
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(25, 'Descrição deve ter no máximo 25 caracteres'),
  executionOrder: zod.string(),
  /* coordinates: zod.object({
    lat: zod.string(),
    lng: zod.string(),
  }), */
})

export type StoppingPointFormData = zod.infer<typeof stoppingPointFormSchema>

interface StoppingPointModalProps {
  disclosure: UseDisclosureReturn
  onAddStoppingPoint: (route: Route) => void
  onUpdateStoppingPoint: (route: Route) => void
  selectedRouteId?: string | undefined
  selectedStoppingPointId?: string | undefined
  coords?: Coordinate | undefined
}

export function StoppingPointModal({
  disclosure,
  onAddStoppingPoint,
  onUpdateStoppingPoint,
  selectedRouteId,
  selectedStoppingPointId,
  coords,
}: StoppingPointModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const StoppingPointForm = useForm<StoppingPointFormData>({
    resolver: zodResolver(stoppingPointFormSchema),
  })

  const [route, setRoute] = useState<Route>()
  const [coordinates, setCoordinates] = useState<Coordinate>()

  const { register, handleSubmit, formState, setValue, reset } =
    StoppingPointForm
  const { errors } = formState

  useEffect(() => {
    if (!isOpen) {
      reset()
      setRoute(undefined)
      setCoordinates(undefined)
    } else {
      if (selectedStoppingPointId) {
        getStoppingPoint()
      } else {
        getRoute()
        setCoordinates(coords)
      }
    }
  }, [isOpen])

  async function handleSaveClick(data: StoppingPointFormData) {
    setIsSubmitting(true)

    try {
      if (!selectedStoppingPointId) {
        const currRoute = { ...route }

        currRoute.stoppingPoints?.push({
          ...data,
          executionOrder: Number(data.executionOrder),
          coordinates: coordinates!,
        })

        const response = await api.put(`/routes/${selectedRouteId}`, currRoute)

        const r = response.data

        onAddStoppingPoint(r)
      } else {
        const currRoute = { ...route }

        const updatedStoppingPoint: StoppingPoint = {
          ...data,
          _id: selectedStoppingPointId,
          executionOrder: Number(data.executionOrder),
          coordinates: coordinates!,
        }

        currRoute.stoppingPoints = currRoute.stoppingPoints?.map(
          (stoppingPoint) => {
            if (stoppingPoint._id === selectedStoppingPointId) {
              return updatedStoppingPoint
            }
            return stoppingPoint
          },
        )

        const response = await api.put(`/routes/${selectedRouteId}`, currRoute)

        const r = response.data

        onUpdateStoppingPoint(r)
      }

      toast.success('Ponto de parada salvo com sucesso!')
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao salvar ponto de parada. Dados inválidos!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function getRoute() {
    setIsLoading(true)
    try {
      const response = await api.get(`/routes/${selectedRouteId}`)
      const route = response.data
      setRoute(route)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter rota do ponto de parada!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function getStoppingPoint() {
    setIsLoading(true)
    try {
      const response = await api.get(`/routes/${selectedRouteId}`)
      const route: Route = response.data
      setRoute(route)
      const stoppingPoint = route.stoppingPoints.find(
        (stoppingPoint) => stoppingPoint._id === selectedStoppingPointId,
      )

      if (stoppingPoint) {
        setValue('description', stoppingPoint.description)
        setValue('executionOrder', String(stoppingPoint.executionOrder))
        setCoordinates(stoppingPoint.coordinates)
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter ponto de parada!')
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
          <ModalHeader fontSize="2xl">Ponto de parada</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              as="form"
              id="stoppingPointForm"
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
                <FormControl isInvalid={!!errors?.executionOrder}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Ordem de Execução</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Select {...register('executionOrder')}>
                      {Array(25)
                        .fill(0)
                        .map((_, index) => (
                          <option key={index} value={Number(index + 1)}>
                            {index + 1}
                          </option>
                        ))}
                    </Select>
                    {!!errors?.executionOrder?.message && (
                      <FormErrorMessage>
                        {errors?.executionOrder?.message}
                      </FormErrorMessage>
                    )}
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.coordinates?.lat} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Latitude</FormLabel>
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
                      // {...register('coordinates.lat')}
                      value={coordinates?.lat}
                      onChange={(e) => {
                        setCoordinates({
                          ...coordinates,
                          lat: Number(e.target.value),
                        } as Coordinate)
                      }}
                    />
                    {/* {!!errors?.coordinates?.lat?.message && (
                      <FormErrorMessage>
                        {errors?.coordinates?.lat?.message}
                      </FormErrorMessage>
                    )} */}
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.coordinates?.lng} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Longitude</FormLabel>
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
                      // {...register('coordinates.lng')}
                      value={coordinates?.lng}
                      onChange={(e) => {
                        setCoordinates({
                          ...coordinates,
                          lng: Number(e.target.value),
                        } as Coordinate)
                      }}
                    />
                    {/* {!!errors?.coordinates?.lng?.message && (
                      <FormErrorMessage>
                        {errors?.coordinates?.lng?.message}
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
              form="stoppingPointForm"
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

import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
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
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { Trip } from '../pages/Trips/Trips'

import Select from 'react-select'
import { Route } from '../pages/Routes/Routes'
import { Vehicle } from '../pages/Vehicles'

interface TripModalProps {
  disclosure: UseDisclosureReturn
  onAddTrip: (trip: Trip) => void
  onUpdateTrip: (trip: Trip) => void
  selectedTripId?: String | undefined
}

export function TripModal({
  disclosure,
  onAddTrip,
  onUpdateTrip,
  selectedTripId,
}: TripModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [trip, setTrip] = useState<Trip>()
  const [routes, setRoutes] = useState<Route[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const routesOptions = routes.map((route) => ({
    value: route._id,
    label: route.description,
  }))

  const vehiclesOptions = vehicles.map((vehicle) => ({
    value: vehicle._id,
    label: vehicle.licensePlate,
  }))

  const [selectedRoute, setSelectedRoute] = useState<any>()
  const [selectedVehicle, setSelectedVehicle] = useState<any>()
  const [isWayBack, setIsWayBack] = useState<boolean>()

  useEffect(() => {
    if (!isOpen) {
      setIsWayBack(false)
    } else {
      getRoutes()
      getVehicles()

      if (selectedTripId) {
        getTrip()
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  async function handleSaveClick() {
    setIsSubmitting(true)

    try {
      if (!selectedTripId) {
        const response = await api.post('/trips', {
          ...trip,
          route_id: selectedRoute.value,
          vehicle_id: selectedVehicle.value,
          isWayBack,
        })
        const t = response.data

        onAddTrip(t)
      } else {
        const response = await api.put(`/trips/${selectedTripId}`, {
          ...trip,
          route_id: selectedRoute.value,
          vehicle_id: selectedVehicle.value,
          isWayBack,
        })
        const t = response.data

        onUpdateTrip(t)
      }

      toast.success('Viagem salvo com sucesso!')
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao salvar viagem. Dados inválidos!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function getRoutes() {
    setIsLoading(true)
    try {
      const response = await api.get(`/routes`)

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

  async function getVehicles() {
    setIsLoading(true)
    try {
      const response = await api.get(`/vehicles`)

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

  async function getTrip() {
    setIsLoading(true)
    try {
      const response = await api.get(`/trips/${selectedTripId}`)
      setTrip(response.data)
      setIsWayBack(response.data.isWayBack)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter viagem!')
      } else {
        toast.error(
          'Falha ao conectar-se ao servidor. Tente novamente mais tarde!',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTripId && trip) {
      if (routes && routes.length > 0) {
        const r = routes.find((route) => route._id === trip.route_id)
        if (r) {
          setSelectedRoute({
            value: r?._id,
            label: r?.description,
          })
        }
      }

      if (vehicles && vehicles.length > 0) {
        const v = vehicles.find((vehicle) => vehicle._id === trip.vehicle_id)

        if (v) {
          setSelectedVehicle({
            value: v?._id,
            label: v?.licensePlate,
          })
        }
      }
    } else {
      setSelectedRoute({})
      setSelectedVehicle({})
    }
  }, [trip, routes, vehicles])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent bgColor="gray.800">
          <ModalHeader fontSize="2xl">Viagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex as="form" width="100%">
              <Stack spacing={4} flex={1}>
                <FormControl /* isInvalid={!!errors?.description} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Rota</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Select
                      isSearchable
                      value={selectedRoute}
                      onChange={setSelectedRoute}
                      options={routesOptions}
                      isDisabled={!!selectedTripId}
                    />
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.licensePlate} */>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Veículo</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Select
                      isSearchable
                      value={selectedVehicle}
                      onChange={setSelectedVehicle}
                      options={vehiclesOptions}
                    />
                  </Skeleton>
                </FormControl>
                <FormControl /* isInvalid={!!errors?.licensePlate} */>
                  <Skeleton isLoaded={!isLoading}>
                    <Checkbox
                      size="md"
                      colorScheme="purple"
                      isChecked={isWayBack}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setIsWayBack(e.target.checked)
                      }
                      isDisabled={!!selectedTripId}
                    >
                      Viagem de Retorno?
                    </Checkbox>
                  </Skeleton>
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSaveClick}
              colorScheme="blue"
              mr={3}
              isLoading={isSubmitting}
              loadingText={selectedTripId ? 'Salvando...' : 'Iniciando...'}
              disabled={isLoading || isSubmitting}
            >
              {selectedTripId ? 'Salvar' : 'Iniciar'}
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

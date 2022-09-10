import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Vehicle, VehicleType } from '../pages/Vehicles'
import { api } from '../services/api'

interface VehicleModalProps {
  disclosure: UseDisclosureReturn
  onAddVehicle: (vehicle: Vehicle) => void
  onUpdateVehicle: (vehicle: Vehicle) => void
  selectedVehicleId?: String | undefined
}

export function VehiclesModal({
  disclosure,
  onAddVehicle,
  onUpdateVehicle,
  selectedVehicleId,
}: VehicleModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [type, setType] = useState<VehicleType>('bus')

  useEffect(() => {
    if (!isOpen) {
      setDescription('')
      setLicensePlate('')
      setType('bus')
    } else {
      if (selectedVehicleId) {
        getVehicle()
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  async function handleSaveClick() {
    setIsSubmitting(true)

    try {
      if (!selectedVehicleId) {
        const response = await api.post('/vehicles', {
          description,
          licensePlate,
          type,
        })
        const vehicle = response.data

        onAddVehicle(vehicle)
      } else {
        const response = await api.put(`/vehicles/${selectedVehicleId}`, {
          description,
          licensePlate,
          type,
        })
        const vehicle = response.data

        onUpdateVehicle(vehicle)
      }

      toast.success('Veículo salvo com sucesso!')
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao salvar veículo. Dados inválidos!')
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
      const response = await api.get(`/vehicles/${selectedVehicleId}`)
      const vehicle = response.data

      setDescription(vehicle.description)
      setLicensePlate(vehicle.licensePlate)
      setType(vehicle.type)
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error('Falha ao obter veículo!')
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
          <ModalHeader fontSize="2xl">Veículo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex as="form" width="100%">
              <Stack spacing={4} flex={1}>
                <FormControl>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Descrição</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                    <FormLabel>Placa</FormLabel>
                  </Skeleton>
                  <Skeleton isLoaded={!isLoading}>
                    <Input
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
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
                      onChange={(value: VehicleType) => setType(value)}
                    >
                      <Stack direction="row" spacing={8}>
                        <Radio value="bus" colorScheme="pink" size="lg">
                          Ônibus
                        </Radio>
                        <Radio value="micro_bus" colorScheme="pink" size="lg">
                          Micro-ônibus
                        </Radio>
                        <Radio value="van" colorScheme="pink" size="lg">
                          Van
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

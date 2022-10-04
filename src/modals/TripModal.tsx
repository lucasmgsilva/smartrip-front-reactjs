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
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Vehicle, VehicleType } from '../pages/Vehicles'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../services/api'

const vehicleFormSchema = zod.object({
  description: zod
    .string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(25, 'Descrição deve ter no máximo 25 caracteres'),
  licensePlate: zod.string().length(8, 'Placa deve ter 8 caracteres'),
  // type: zod.string(),
})

export type VehicleFormData = zod.infer<typeof vehicleFormSchema>

interface VehicleModalProps {
  disclosure: UseDisclosureReturn
  onAddVehicle: (vehicle: Vehicle) => void
  onUpdateVehicle: (vehicle: Vehicle) => void
  selectedVehicleId?: String | undefined
}

export function TripModal({
  disclosure,
  onAddVehicle,
  onUpdateVehicle,
  selectedVehicleId,
}: VehicleModalProps) {
  const { isOpen, onClose } = disclosure

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [type, setType] = useState<VehicleType>('bus')

  const VehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
  })

  const { register, handleSubmit, formState, setValue, reset } = VehicleForm
  const { errors } = formState

  useEffect(() => {
    if (!isOpen) {
      reset()
      setType('bus')
    } else {
      if (selectedVehicleId) {
        getVehicle()
      } else {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  async function handleSaveClick(data: VehicleFormData) {
    setIsSubmitting(true)

    try {
      if (!selectedVehicleId) {
        const response = await api.post('/vehicles', {
          ...data,
          type,
        })
        const vehicle = response.data

        onAddVehicle(vehicle)
      } else {
        const response = await api.put(`/vehicles/${selectedVehicleId}`, {
          ...data,
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

      setValue('description', vehicle.description)
      setValue('licensePlate', vehicle.licensePlate)
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
            <Flex
              as="form"
              id="vehicleForm"
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
                <FormControl isInvalid={!!errors?.licensePlate}>
                  <Skeleton isLoaded={!isLoading}>
                    <FormLabel>Placa</FormLabel>
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
                      {...register('licensePlate')}
                    />
                    {!!errors?.licensePlate?.message && (
                      <FormErrorMessage>
                        {errors?.licensePlate?.message}
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
                      onChange={(value: VehicleType) => setType(value)}
                      // {...register('type')}
                    >
                      <Stack
                        direction={['column', null, null, 'row']}
                        spacing={[2, null, null, 8]}
                      >
                        <Radio value="bus" colorScheme="pink" size="lg">
                          Ônibus
                        </Radio>
                        <Radio value="minibus" colorScheme="pink" size="lg">
                          Micro-ônibus
                        </Radio>
                        <Radio value="van" colorScheme="pink" size="lg">
                          Van
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
              form="vehicleForm"
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

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
  Stack,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { VehicleType } from '../pages/Vehicles'
import { api } from '../services/api'

interface VehicleModalProps {
  disclosure: UseDisclosureReturn
}

export function VehiclesModal({ disclosure }: VehicleModalProps) {
  const { isOpen, onClose } = disclosure
  const initialRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [type, setType] = useState<VehicleType>('bus')

  console.log(description, licensePlate, type)

  useEffect(() => {
    if (!isOpen) {
      setDescription('')
      setLicensePlate('')
      setType('bus')
    }
  }, [isOpen])

  async function handleSaveClick() {
    setIsSubmitting(true)

    try {
      const response = await api.post('/vehicles', {
        description,
        licensePlate,
        type,
      })

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

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Veículo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex as="form" width="100%">
              <Stack spacing={4} flex={1}>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                    borderColor="base.border"
                    focusBorderColor="brand.blue"
                    bgColor="base.input"
                    color={'base.text'}
                    _placeholder={{ color: 'base.label' }}
                    size="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Placa</FormLabel>
                  <Input
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    borderColor="base.border"
                    focusBorderColor="brand.blue"
                    bgColor="base.input"
                    color={'base.text'}
                    _placeholder={{ color: 'base.label' }}
                    size="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo</FormLabel>
                  <RadioGroup
                    value={type}
                    onChange={(value: VehicleType) => setType(value)}
                  >
                    <Stack direction="row">
                      <Radio value="bus" size="lg">
                        Ônibus
                      </Radio>
                      <Radio value="micro_bus" size="lg">
                        Micro-ônibus
                      </Radio>
                      <Radio value="van" size="lg">
                        Van
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="facebook"
              mr={3}
              isLoading={isSubmitting}
              loadingText="Salvando..."
              onClick={handleSaveClick}
            >
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

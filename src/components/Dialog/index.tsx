import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDialog } from '../../contexts/DialogContext'

interface DialogProps {
  title: string
  message: string
  onDeleteAction: () => void
}

export function Dialog({ title, message, onDeleteAction }: DialogProps) {
  const { isOpen, onClose } = useDialog()

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="gray.800">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              colorScheme="red"
              isLoading={isSubmitting}
              loadingText="Removendo..."
              onClick={() => {
                setIsSubmitting(true)
                onDeleteAction()
                setIsSubmitting(false)
              }}
            >
              Remover
            </Button>
            <Button colorScheme="yellow" onClick={onClose} ml={3}>
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

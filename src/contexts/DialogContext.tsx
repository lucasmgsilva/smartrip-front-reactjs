import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
import { createContext, ReactNode, useContext } from 'react'

interface DialogProviderProps {
  children: ReactNode
}

type DialogContextData = UseDisclosureReturn

const DialogContext = createContext({} as DialogContextData)

export function DialogProvider({ children }: DialogProviderProps) {
  const disclosure = useDisclosure()

  return (
    <DialogContext.Provider value={disclosure}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  return useContext(DialogContext)
}

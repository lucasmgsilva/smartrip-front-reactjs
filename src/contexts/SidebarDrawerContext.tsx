import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
// import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SidebarDrawerProviderProps {
  children: ReactNode
}

type SidebarDrawerContextData = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData)

export function SidebarDrawerProvider({
  children,
}: SidebarDrawerProviderProps) {
  const disclosure = useDisclosure()
  // const { pathname } = useLocation()

  // Quando o caminho da aplicação mudar o Drawer será fechado
  useEffect(
    () => {
      disclosure.onClose()
    },
    [
      /* pathname */
    ],
  )

  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  )
}

export const useSidebarDrawer = () => {
  return useContext(SidebarDrawerContext)
}

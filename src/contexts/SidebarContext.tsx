import { createContext, ReactNode, useContext, useState } from 'react'

interface SidebarProviderProps {
  children: ReactNode
}

interface SidebarContextData {
  isExtendedVersion: boolean
  toggleExtendedVersion: () => void
}

const SidebarContext = createContext({} as SidebarContextData)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExtendedVersion, setIsExtendedVersion] = useState(true)

  function toggleExtendedVersion() {
    setIsExtendedVersion(!isExtendedVersion)
  }

  return (
    <SidebarContext.Provider
      value={{ isExtendedVersion, toggleExtendedVersion }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}

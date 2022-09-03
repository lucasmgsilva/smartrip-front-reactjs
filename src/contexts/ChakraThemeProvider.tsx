import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { createContext, ReactNode, useContext } from 'react'
import { lightTheme, darkTheme } from '../styles/chakra-ui/'

interface ChakraThemeProviderProps {
  children: ReactNode
}

interface ChakraThemeContextData {
  colorTheme: string
  changeTheme: () => void
}

const ChakraThemeContext = createContext({} as ChakraThemeContextData)

export const ChakraThemeProvider = ({ children }: ChakraThemeProviderProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const colorTheme = colorMode

  function changeTheme() {
    toggleColorMode()
  }

  return (
    <ChakraThemeContext.Provider value={{ colorTheme, changeTheme }}>
      <ChakraProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ChakraProvider>
    </ChakraThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ChakraThemeContext)

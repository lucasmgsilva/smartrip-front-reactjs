// import { ThemeProvider } from 'styled-components'
// import { GlobalStyle } from './styles/styled-components/globals'
// import { defaultTheme } from './styles/styled-components/themes/default'

import { BrowserRouter } from 'react-router-dom'
import { SidebarDrawerProvider } from './contexts/SidebarDrawerContext'
import { Router } from './Router'
import { SidebarProvider } from './contexts/SidebarContext'

import { theme } from './styles/chakra-ui/themes/default'
import { ChakraProvider } from '@chakra-ui/react'
import { DialogProvider } from './contexts/DialogContext'
import { AuthContextProvider } from './contexts/AuthContext'

export function App() {
  return (
    <ChakraProvider theme={theme}>
      {/* <ThemeProvider theme={defaultTheme}> */}
      <SidebarDrawerProvider>
        <SidebarProvider>
          <DialogProvider>
            <BrowserRouter>
              <AuthContextProvider>
                <Router />
              </AuthContextProvider>
            </BrowserRouter>
          </DialogProvider>
        </SidebarProvider>
      </SidebarDrawerProvider>
      {/* </ThemeProvider> */}
    </ChakraProvider>
  )
}

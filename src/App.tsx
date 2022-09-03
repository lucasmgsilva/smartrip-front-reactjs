// import { ThemeProvider } from 'styled-components'
// import { GlobalStyle } from './styles/styled-components/globals'
// import { defaultTheme } from './styles/styled-components/themes/default'

import { ColorModeProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { SidebarDrawerProvider } from './contexts/SidebarDrawerContext'
import { ChakraThemeProvider } from './contexts/ChakraThemeProvider'
import { Router } from './Router'
import { SidebarProvider } from './contexts/SidebarContext'

export function App() {
  return (
    <ColorModeProvider>
      <ChakraThemeProvider>
        {/* <ThemeProvider theme={defaultTheme}> */}
        <SidebarDrawerProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </SidebarProvider>
        </SidebarDrawerProvider>
        {/* </ThemeProvider> */}
      </ChakraThemeProvider>
    </ColorModeProvider>
  )
}

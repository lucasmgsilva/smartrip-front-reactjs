import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
// import { ThemeProvider } from 'styled-components'
import { Router } from './Router'
// import { GlobalStyle } from './styles/globals'
import { theme } from './styles/theme'
// import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    // <ThemeProvider theme={defaultTheme}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Router />
        {/* <GlobalStyle /> */}
      </BrowserRouter>
    </ChakraProvider>
    // </ThemeProvider>
  )
}

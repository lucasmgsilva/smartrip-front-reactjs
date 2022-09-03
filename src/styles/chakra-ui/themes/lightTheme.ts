import { extendTheme } from '@chakra-ui/react'

export const lightTheme = extendTheme({
  colors: {
    base: {
      background: '#FAFAFA',
      card: '#F3F2F2',
      card2: '#F3F2F2',
      border: '#E6E5E5',
      text: '#574F4D',
      label: '#8D8686',
      title: '#272221',
      span: '#D7D5D5',
      button: '#3294F8',
      subtitle: '#403937',
      input: '#EDEDED',
    },
    brand: {
      blue: '#3294F8',
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      body: {
        bg: 'base.background',
        color: 'base.text',
      },
    },
  },
})

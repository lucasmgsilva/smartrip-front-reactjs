import { extendTheme } from '@chakra-ui/react'

export const darkTheme = extendTheme({
  colors: {
    base: {
      background: '#071422',
      card: '#112131',
      card2: '#0B1B2B',
      border: '#1C2F41',
      text: '#AFC2D4',
      label: '#3A536B',
      title: '#E7EDF4',
      subtitle: '#C4D4E3',
      span: '#7B96B2',
      input: '#0B1B2B',
      button: '#3294F8',
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

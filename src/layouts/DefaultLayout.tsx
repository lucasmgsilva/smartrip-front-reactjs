import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Box } from '@chakra-ui/react'

export function DefaultLayout() {
  return (
    <Box px="4" py="0" maxW={1440} marginY="0" marginX="auto">
      <Header />
      <Outlet />
    </Box>
  )
}

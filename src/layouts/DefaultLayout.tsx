import { Outlet } from 'react-router-dom'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'

export function DefaultLayout() {
  const { isExtendedVersion } = useSidebar()
  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Flex h="100vh" direction="column">
      <Header />
      <Flex w="100%" maxWidth={1920} flex="1" mx="auto">
        {(isExtendedVersion || isDrawerSidebar) && <Sidebar />}
        <Box flex="1" borderRadius={8} bg="base.card" p="6" mx="4" mb="4">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

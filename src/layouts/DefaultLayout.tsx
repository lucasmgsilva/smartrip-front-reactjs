import { Outlet } from 'react-router-dom'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function DefaultLayout() {
  const { isExtendedVersion } = useSidebar()
  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        {(isExtendedVersion || isDrawerSidebar) && <Sidebar />}
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Outlet />
        </Box>
      </Flex>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
      />
    </Flex>
  )
}

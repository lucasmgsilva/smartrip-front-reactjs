import { Outlet, useLocation } from 'react-router-dom'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { useSidebarDrawer } from '../contexts/SidebarDrawerContext'

export function DefaultLayout() {
  const location = useLocation()
  const { isExtendedVersion } = useSidebar()
  const disclosure = useSidebarDrawer()

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
  })

  useEffect(() => {
    disclosure.onClose()
  }, [location.pathname])

  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={'4'}>
        {(isExtendedVersion || isDrawerSidebar) && <Sidebar />}
        <Box flex="1" borderRadius={8} bg="gray.800" p="6">
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

import {
  Button,
  Flex,
  Icon,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { MdLogout } from 'react-icons/md'
import { RiMenuLine } from 'react-icons/ri'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { useSidebar } from '../../contexts/SidebarContext'
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext'
import { Logo } from './Logo'
import { NotificationsNav } from './NotificationsNav'
import { Profile } from './Profile'

export function Header() {
  const { handleUserLogout } = useContext(AuthContext)

  const { onOpen } = useSidebarDrawer()
  const { toggleExtendedVersion } = useSidebar()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  function handleLogout() {
    handleUserLogout()
  }

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      pr="6"
      pl={['2', '4']}
      align="center"
    >
      <IconButton
        icon={<Icon as={RiMenuLine} />}
        fontSize="24"
        variant="unstyled"
        onClick={!isWideVersion ? onOpen : toggleExtendedVersion}
        aria-label="Abrir Navegação"
        mr="2"
        lineHeight={0}
      ></IconButton>

      <Flex w="56" px="1" justify="space-between" align="center">
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Flex>

      <Flex align="center" ml="auto">
        <Button
          background={'red.500'}
          color="white.300"
          _hover={{
            background: 'red.600',
          }}
          onClick={handleLogout}
        >
          <MdLogout size={20} />
        </Button>
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  )
}

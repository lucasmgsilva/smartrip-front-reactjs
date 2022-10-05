import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri'
import { NavLink } from 'react-router-dom'
import { useSidebar } from '../../contexts/SidebarContext'
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext'
import { Logo } from './Logo'
import { NotificationsNav } from './NotificationsNav'
import { Profile } from './Profile'

export function Header() {
  const { onOpen } = useSidebarDrawer()
  const { toggleExtendedVersion } = useSidebar()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="14"
      mx="auto"
      mt="4"
      pr="4"
      pl={'2'}
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
      />

      <Flex w="56" px="1" justify="space-between" align="center">
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Flex>

      <Flex align="center" ml="auto">
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  )
}

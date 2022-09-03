import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri'
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
      maxWidth={1920}
      mx="auto"
      px="4"
      h="20"
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

      <Logo />

      <Flex align="center" ml="auto">
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  )
}

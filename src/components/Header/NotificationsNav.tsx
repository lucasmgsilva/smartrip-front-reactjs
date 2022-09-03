import { HStack, Icon, IconButton } from '@chakra-ui/react'
import { RiNotificationLine } from 'react-icons/ri'
import { BsMoonStarsFill } from 'react-icons/bs'
import { FaSun } from 'react-icons/fa'
import { useTheme } from '../../contexts/ChakraThemeProvider'

export function NotificationsNav() {
  const { colorTheme, changeTheme } = useTheme()

  return (
    <HStack
      spacing={['4', '6']}
      mx={[0, 0, 0, '8']}
      pr={[0, 0, 0, '8']}
      py="1"
      color="base.label"
      borderRightWidth={[0, 0, 0, 1]}
      borderColor="base.border"
    >
      <Icon as={RiNotificationLine} fontSize="20" />

      <IconButton
        aria-label="Alternar entre tema escuro e tema claro"
        icon={<Icon as={colorTheme === 'light' ? BsMoonStarsFill : FaSun} />}
        color={colorTheme === 'light' ? 'base.label' : 'yellow.500'}
        fontSize="20"
        onClick={changeTheme}
        title="Alternar entre tema escuro e tema claro"
      />
    </HStack>
  )
}

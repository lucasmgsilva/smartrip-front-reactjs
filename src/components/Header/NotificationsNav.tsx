import { Button, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { MdLogout } from 'react-icons/md'
import { AuthContext } from '../../contexts/AuthContext'

export function NotificationsNav() {
  const { handleUserLogout } = useContext(AuthContext)

  function handleLogout() {
    handleUserLogout()
  }

  return (
    <HStack
      spacing={['6', '8']}
      mx={['6', '8']}
      pr={['6', '8']}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      {/* <Icon as={RiNotificationLine} fontSize="20" /> */}
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
    </HStack>
  )
}

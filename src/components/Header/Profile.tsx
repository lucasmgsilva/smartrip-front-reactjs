import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { handleUserLogout } = useContext(AuthContext)

  const { user } = useContext(AuthContext)

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}
      <Menu>
        <MenuButton>
          <Avatar size="md" name={user.name} />
        </MenuButton>
        <MenuList>
          <MenuItem bg="white" color="black" onClick={handleUserLogout}>
            Sair
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

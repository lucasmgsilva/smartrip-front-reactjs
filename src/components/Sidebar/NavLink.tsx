import {
  Icon,
  Text,
  LinkProps as ChakraLinkProps,
  Link as ChakraLink,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import { ElementType } from 'react'
import { ActiveLink } from '../ActiveLink'
import { VscCircleFilled } from 'react-icons/vsc'

interface NavLinkProps extends ChakraLinkProps {
  to: string
  title: string
  icon?: ElementType
}

export function NavLink({ to, title, icon }: NavLinkProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ActiveLink to={to}>
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        onClick={isOpen ? onClose : onOpen}
        cursor="pointer"
        userSelect="none"
        ml="2"
        _hover={{
          textDecoration: 'underline',
        }}
        transition="all 0.2s"
      >
        <Icon as={icon ?? VscCircleFilled} />
        <Text ml="2" fontWeight="medium">
          {title}
        </Text>
      </Flex>
    </ActiveLink>
  )
}

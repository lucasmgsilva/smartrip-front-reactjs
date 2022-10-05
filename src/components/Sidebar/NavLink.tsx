import {
  Icon,
  Link as ChakraLink,
  Text,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react'
import { ElementType } from 'react'
import { ActiveLink } from '../ActiveLink'

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType
  children: string
  to: string
  isDisabled?: boolean
  shouldMatchExactHref?: boolean
}

export function NavLink({
  icon,
  children,
  to,
  isDisabled = false,
  shouldMatchExactHref,
  ...rest
}: NavLinkProps) {
  return !isDisabled ? (
    <ActiveLink to={to} shouldMatchExactHref={shouldMatchExactHref}>
      <ChakraLink display="flex" alignContent="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  ) : (
    <ChakraLink
      display="flex"
      alignContent="center"
      {...rest}
      opacity={0.25}
      _hover={{
        cursor: 'not-allowed',
      }}
    >
      <Icon as={icon} fontSize="20" />
      <Text ml="4" fontWeight="medium">
        {children}
      </Text>
    </ChakraLink>
  )
}

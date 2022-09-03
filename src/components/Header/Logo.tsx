import { Flex, Text } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

export function Logo() {
  return (
    <Flex w="56" px="1" justify="space-between" align="center">
      <NavLink to="/">
        <Text
          fontSize={['2xl', '3xl']}
          fontWeight="bold"
          letterSpacing="tight"
          w="64"
        >
          Smar
          <Text as="span" ml="1" color="pink.500">
            Trip
          </Text>
        </Text>
      </NavLink>
    </Flex>
  )
}

import { Text, TextProps } from '@chakra-ui/react'

interface LogoProps extends TextProps {}

export function Logo({ ...rest }: LogoProps) {
  return (
    <Text
      fontSize={['2xl', '3xl']}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
      {...rest}
    >
      Smar
      <Text as="span" ml="1" color="pink.500">
        Trip
      </Text>
    </Text>
  )
}

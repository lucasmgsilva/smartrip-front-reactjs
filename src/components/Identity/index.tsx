import { Icon } from '@chakra-ui/icon'
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/layout'
import { UserType } from '../../pages/Users'
import { BiUser } from 'react-icons/bi'

interface IdentityProps {
  name: string
  email: string
  cellPhone: string
  educationalInstitution: string
  type: UserType
}

export function Identity({
  name,
  email,
  cellPhone,
  educationalInstitution,
  type,
}: IdentityProps) {
  return (
    <Flex
      flexDir="column"
      gap="10"
      bg="whiteAlpha.100"
      px="8"
      py="8"
      borderRadius="8px"
    >
      <Heading size="lg" fontWeight="bold" textAlign="center">
        Identidade SmarTrip
      </Heading>
      <Flex
        flexDir={['column']}
        alignItems="center"
        justifyContent="center"
        gap="12"
      >
        <Flex>
          <Box borderRadius="100%" bg="whiteAlpha.200" p="6">
            <Icon as={BiUser} width={20} height={20} lineHeight="0" />
          </Box>
        </Flex>
        <SimpleGrid
          columns={[1, null, 2]}
          rowGap="6"
          columnGap="16"
          fontSize={18}
        >
          <Box>
            <Text fontWeight="bold">Nome</Text>
            <Text fontStyle="italic">{name}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Instituição de Ensino</Text>
            <Text fontStyle="italic">
              {educationalInstitution || 'Não informado'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">E-mail</Text>
            <Text fontStyle="italic">{email}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Telefone</Text>
            <Text fontStyle="italic">{cellPhone}</Text>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

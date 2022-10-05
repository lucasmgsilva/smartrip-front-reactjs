import { Icon } from '@chakra-ui/icon'
import { Box, Flex } from '@chakra-ui/layout'
import { IconType } from 'react-icons/lib'

interface InfoMonitorProps {
  icon?: IconType
  title: string
  value?: string
}

export function InfoMonitor({ icon, title, value }: InfoMonitorProps) {
  return (
    <Flex
      borderRadius="4"
      bg="whiteAlpha.100"
      overflow="hidden"
      boxShadow={'md'}
    >
      <Flex bgColor="white" alignItems="center" px="4" py="2">
        <Icon as={icon} color="black" height="6" width="6" />
      </Flex>
      <Flex flexDir="column" width="100%">
        <Box py="1" px="2" fontWeight="bold" bg="gray.900">
          {title}
        </Box>
        <Box py="1" px="2">
          {value}
        </Box>
      </Flex>
    </Flex>
  )
}

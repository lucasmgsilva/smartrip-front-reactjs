import {
  Box,
  Collapse,
  Flex,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { ElementType, ReactNode } from 'react'
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri'
import { ActiveSection } from '../ActiveSection'

interface NavSectionProps {
  to: string
  title: string
  icon: ElementType
  isNavigateLink?: boolean
  children?: ReactNode
}

export function NavSection({
  to,
  title,
  icon,
  isNavigateLink,
  children,
}: NavSectionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box w="100%">
      <ActiveSection
        to={to}
        isNavigateLink={isNavigateLink}
        shouldMatchExactHref={to === '/'}
      >
        <Flex
          justifyContent="space-between"
          onClick={children ? (isOpen ? onClose : onOpen) : undefined}
          cursor="pointer"
          userSelect="none"
          color="base.text"
          _hover={{
            color: 'base.button',
          }}
          transition="all 0.2s"
        >
          <Flex gap="2">
            <Icon as={icon} />
            <Text fontWeight="bold" fontSize="small" textTransform="uppercase">
              {title}
            </Text>
          </Flex>
          {children &&
            (!isOpen ? (
              <Icon as={RiArrowDropUpLine} />
            ) : (
              <Icon as={RiArrowDropDownLine} />
            ))}
        </Flex>
      </ActiveSection>
      <Collapse in={isOpen} animateOpacity>
        <Stack spacing="2" mt="3" align="strech">
          {children}
        </Stack>
      </Collapse>
    </Box>
  )
}

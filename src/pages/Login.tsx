import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Header/Logo'

const loginFormSchema = zod.object({
  email: zod
    .string()
    .min(3, 'E-mail deve ter pelo menos 3 caracteres')
    .max(64, 'E-mail deve ter no máximo 64 caracteres')
    .email('E-mail é inválido')
    .transform((value) => value.toLowerCase()),
  password: zod
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(24, 'Senha deve ter no máximo 24 caracteres'),
})

export type LoginFormData = zod.infer<typeof loginFormSchema>

export default function Login() {
  const navigate = useNavigate()

  const LoginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const { register, handleSubmit, formState } = LoginForm
  const { errors } = formState

  function handleLogin(data: LoginFormData) {
    console.log(data)
  }

  function handleNavigateToRegister() {
    navigate('/register')
  }

  return (
    <Flex minW="100vw" minH="100vh" alignItems="center" justifyContent="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={540}
        bg="gray.800"
        padding="8"
        borderRadius={8}
        flexDirection="column"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Flex justifyContent="center" pb="10">
          <Logo textAlign="center" />
        </Flex>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors?.email}>
            <FormLabel>E-mail</FormLabel>
            <Input
              focusBorderColor="pink.500"
              bgColor="gray.900"
              _hover={{
                bgColor: 'gray.900',
              }}
              variant="filled"
              size="lg"
              {...register('email')}
            />
            {!!errors?.email?.message && (
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors?.password}>
            <FormLabel>Senha</FormLabel>
            <Input
              focusBorderColor="pink.500"
              bgColor="gray.900"
              _hover={{
                bgColor: 'gray.900',
              }}
              variant="filled"
              size="lg"
              {...register('password')}
            />
            {!!errors?.password?.message && (
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            )}
          </FormControl>
          <Link color="blue.500">Esqueci minha senha</Link>
        </Stack>
        <Button
          type="submit"
          mt="5"
          colorScheme="blue"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
        <Flex flexDirection="column" alignItems="center" mt="5">
          <Divider maxWidth={200} />
          <Text mt="4">
            Não tem uma conta?{' '}
            <Link onClick={handleNavigateToRegister} color="blue.500">
              Cadastre-se
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

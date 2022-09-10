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

const registerFormSchema = zod
  .object({
    name: zod
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres'),
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
    confirmPassword: zod.string().min(1, 'Confirmação da senha é obrigatório'),
    cellPhone: zod.string().length(15, 'Telefone deve ter 15 caracteres'),
    educationalInstitution: zod
      .string()
      .max(50, 'Instituição de Ensino deve ter no máximo 50 caracteres')
      .refine(
        (value) => value.length === 0 || value.length >= 3,
        'Instituição de Ensino deve ter pelo menos 3 caracteres',
      ),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'As senhas devem ser exatamente iguais',
    path: ['confirmPassword'],
  })

export type RegisterFormData = zod.infer<typeof registerFormSchema>

export default function Register() {
  const navigate = useNavigate()

  const RegisterForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const { register, handleSubmit, formState } = RegisterForm
  const { errors } = formState

  function handleRegister(data: RegisterFormData) {
    console.log(data)
  }

  function handleNavigateToLogin() {
    navigate('/login')
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
        onSubmit={handleSubmit(handleRegister)}
      >
        <Flex justifyContent="center" pb="10">
          <Logo textAlign="center" />
        </Flex>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors?.name}>
            <FormLabel>Nome</FormLabel>
            <Input
              focusBorderColor="pink.500"
              bgColor="gray.900"
              _hover={{
                bgColor: 'gray.900',
              }}
              variant="filled"
              size="lg"
              {...register('name')}
            />
            {!!errors?.name?.message && (
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            )}
          </FormControl>
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
          <Stack
            direction={['column', 'row']}
            alignItems="flex-start"
            spacing={4}
          >
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
            <FormControl isInvalid={!!errors?.confirmPassword}>
              <FormLabel>Confirmação da Senha</FormLabel>
              <Input
                focusBorderColor="pink.500"
                bgColor="gray.900"
                _hover={{
                  bgColor: 'gray.900',
                }}
                variant="filled"
                size="lg"
                {...register('confirmPassword')}
              />
              {!!errors?.confirmPassword?.message && (
                <FormErrorMessage>
                  {errors?.confirmPassword?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
          <Stack
            direction={['column', 'row']}
            alignItems="flex-start"
            spacing={4}
          >
            <FormControl isInvalid={!!errors?.cellPhone}>
              <FormLabel>Telefone</FormLabel>
              <Input
                focusBorderColor="pink.500"
                bgColor="gray.900"
                _hover={{
                  bgColor: 'gray.900',
                }}
                variant="filled"
                size="lg"
                {...register('cellPhone')}
              />
              {!!errors?.cellPhone?.message && (
                <FormErrorMessage>
                  {errors?.cellPhone?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors?.educationalInstitution}>
              <FormLabel>Instituição de Ensino</FormLabel>
              <Input
                focusBorderColor="pink.500"
                bgColor="gray.900"
                _hover={{
                  bgColor: 'gray.900',
                }}
                variant="filled"
                size="lg"
                {...register('educationalInstitution')}
              />
              {!!errors?.educationalInstitution?.message && (
                <FormErrorMessage>
                  {errors?.educationalInstitution?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
        </Stack>
        <Button
          type="submit"
          mt="5"
          colorScheme="blue"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Cadastrar
        </Button>
        <Flex flexDirection="column" alignItems="center" mt="5">
          <Divider maxWidth={200} />
          <Text mt="4">
            Já tem uma conta?{' '}
            <Link onClick={handleNavigateToLogin} color="blue.500">
              Entrar
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

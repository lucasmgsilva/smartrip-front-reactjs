import { ChangeEvent } from "react"

export const TelMask = (element: ChangeEvent<HTMLInputElement>) => {
  const field = element.target

  field.value = field.value.replace(/\D/g, '') // Remove tudo o que não é dígito
  field.value = field.value.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
  field.value = field.value.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos

  return field
}

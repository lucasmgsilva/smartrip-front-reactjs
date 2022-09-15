import { createContext, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type UserType = {
  name: string
  email: string
  password: string
  cellPhone: string
  educationalInstitution: string
  type: string
}

interface AuthContextData {
  user: UserType
  handleUserAuth: (user: UserType) => void
  handleUserLogout: () => void
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as UserType)
  const navigate = useNavigate()

  function handleUserAuth(user: UserType) {
    setUser(user)
  }

  function handleUserLogout() {
    setUser({} as UserType)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, handleUserAuth, handleUserLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

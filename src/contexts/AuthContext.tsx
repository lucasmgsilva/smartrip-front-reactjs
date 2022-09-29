import { createContext, ReactNode, useEffect, useState } from 'react'
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

    const stateJSON = JSON.stringify(user)
    localStorage.setItem('@SmarTrip:User-1.0.0', stateJSON)
  }

  function handleUserLogout() {
    setUser({} as UserType)

    localStorage.removeItem('@SmarTrip:User-1.0.0')
    navigate('/login')
  }

  useEffect(() => {
    const user = localStorage.getItem('@SmarTrip:User-1.0.0')
    if (user) {
      setUser(JSON.parse(user))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, handleUserAuth, handleUserLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

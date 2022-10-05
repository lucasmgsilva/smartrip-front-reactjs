import { createContext, ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserType } from '../pages/Users'

interface User {
  _id: string
  name: string
  email: string
  password?: string
  cellPhone: string
  educationalInstitution: string
  type: UserType
}

interface AuthContextData {
  user: User
  handleUserAuth: (user: User) => void
  handleUserLogout: () => void
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as User)
  const navigate = useNavigate()

  function handleUserAuth(user: User) {
    setUser(user)

    const stateJSON = JSON.stringify(user)
    localStorage.setItem('@SmarTrip:User-1.0.0', stateJSON)
  }

  function handleUserLogout() {
    setUser({} as User)

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

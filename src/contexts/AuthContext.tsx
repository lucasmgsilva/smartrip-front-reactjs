import { createContext, ReactNode, useState } from "react"

interface AuthContextData {
  user: string
  handleUserAuth: (user: string) => void
  handleUserLogout: () => void
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState('')

  function handleUserAuth(user: string) {
    setUser(user)
  }

  function handleUserLogout() {
    setUser('')
  }

  return (
    <AuthContext.Provider value={{ user, handleUserAuth, handleUserLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Trips } from './pages/Trips'
import { Users } from './pages/Users'
import { Vehicles } from './pages/Vehicles'

export function Router() {
  const { user } = useContext(AuthContext)
  console.log(user)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {user.name ? (
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/veiculos" element={<Vehicles />} />

          <Route path="/rotas" element={<Home />} />

          <Route path="/usuarios" element={<Users />} />

          <Route path="/viagens" element={<Trips />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  )
}

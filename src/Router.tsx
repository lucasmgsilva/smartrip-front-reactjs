import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Routes as RoutesPage } from './pages/Routes'
import { Trips } from './pages/Trips'
import { Users } from './pages/Users'
import { Vehicles } from './pages/Vehicles'

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/veiculos" element={<Vehicles />} />

        <Route path="/rotas" element={<RoutesPage />} />

        <Route path="/usuarios" element={<Users />} />

        <Route path="/viagens" element={<Trips />} />
      </Route>
    </Routes>
  )
}

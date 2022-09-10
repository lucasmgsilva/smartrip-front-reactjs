import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'
import { Trips } from './pages/Trips'
import { Users } from './pages/Users'
import { Vehicles } from './pages/Vehicles'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/veiculos" element={<Vehicles />} />

        <Route path="/rotas" element={<Home />} />

        <Route path="/usuarios" element={<Users />} />

        <Route path="/viagens" element={<Trips />} />
      </Route>
    </Routes>
  )
}

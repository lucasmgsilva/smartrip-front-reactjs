import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/veiculos" element={<Home />} />

        <Route path="/rotas" element={<Home />} />

        <Route path="/usuarios" element={<Home />} />

        <Route path="/viagens" element={<Home />} />
      </Route>
    </Routes>
  )
}

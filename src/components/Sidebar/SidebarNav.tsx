import { Stack } from '@chakra-ui/react'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

import { HiHome } from 'react-icons/hi'
import { FaBusAlt, FaRoute } from 'react-icons/fa'
import { MdAltRoute } from 'react-icons/md'
import { TbUsers } from 'react-icons/tb'

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="Geral">
        <NavLink to="/" title="Início" icon={HiHome} shouldMatchExactHref>
          Início
        </NavLink>
        <NavLink to="/veiculos" title="Veículos" icon={FaBusAlt}>
          Veículos
        </NavLink>
        <NavLink to="/rotas" title="Rotas" icon={MdAltRoute}>
          Rotas
        </NavLink>
        <NavLink to="/usuarios" title="Usuários" icon={TbUsers}>
          Usuários
        </NavLink>
      </NavSection>

      <NavSection title="Controle">
        <NavLink to="/viagens" title="Viagens" icon={FaRoute}>
          Viagens
        </NavLink>
      </NavSection>
    </Stack>
  )
}

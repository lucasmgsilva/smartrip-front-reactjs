import { Stack } from '@chakra-ui/react'
import { HiHome } from 'react-icons/hi'
import { FaBusAlt, FaRoute } from 'react-icons/fa'
import { MdAltRoute } from 'react-icons/md'
import { TbUsers } from 'react-icons/tb'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="8" align="flex-start">
      <NavSection to="/" title="Início" icon={HiHome} isNavigateLink />

      <NavSection to="/veiculos" icon={FaBusAlt} title="Veículos">
        <NavLink to="/veiculos" title="Veículos" />
      </NavSection>

      <NavSection to="/rotas" title="Rotas" icon={MdAltRoute}>
        <NavLink to="/rotas" title="Rotas" />
      </NavSection>

      <NavSection to="/usuarios" title="Usuários" icon={TbUsers}>
        <NavLink to="/usuarios" title="Usuários" />
      </NavSection>

      <NavSection to="/viagens" icon={FaRoute} title="Viagens">
        <NavLink to="/viagens" title="Viagens" />
      </NavSection>
    </Stack>
  )
}

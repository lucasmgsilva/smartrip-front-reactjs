import { Stack } from '@chakra-ui/react'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

import { HiHome } from 'react-icons/hi'
import { FaBusAlt, FaRoute } from 'react-icons/fa'
import { MdAltRoute } from 'react-icons/md'
import { TbUsers } from 'react-icons/tb'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

export function SidebarNav() {
  const { user } = useContext(AuthContext)

  const isAdministrator = user.type === 'administrator'

  const isAdministratorOrDriver =
    user.type === 'administrator' || user.type === 'driver'

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="Geral">
        <NavLink to="/" title="Início" icon={HiHome} shouldMatchExactHref>
          Início
        </NavLink>
      </NavSection>

      <NavSection title="Controle">
        <NavLink
          to="/veiculos"
          title="Veículos"
          icon={FaBusAlt}
          isDisabled={!isAdministratorOrDriver}
        >
          Veículos
        </NavLink>
        <NavLink
          to="/rotas"
          title="Rotas"
          icon={MdAltRoute}
          isDisabled={!isAdministratorOrDriver}
        >
          Rotas
        </NavLink>
        <NavLink
          to="/usuarios"
          title="Usuários"
          icon={TbUsers}
          isDisabled={!isAdministrator}
        >
          Usuários
        </NavLink>
      </NavSection>

      <NavSection title="Monitoramento">
        <NavLink to="/viagens" title="Viagens" icon={FaRoute}>
          Viagens
        </NavLink>
      </NavSection>
    </Stack>
  )
}

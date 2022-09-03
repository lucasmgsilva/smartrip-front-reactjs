import { cloneElement, ReactElement } from 'react'
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom'
import { useSidebar } from '../contexts/SidebarContext'
import { useSidebarDrawer } from '../contexts/SidebarDrawerContext'

interface ActiveLinkProps extends NavLinkProps {
  children: ReactElement
  shouldMatchExactHref?: boolean
}

export function ActiveLink({
  children,
  shouldMatchExactHref = false,
  ...rest
}: ActiveLinkProps) {
  const { pathname } = useLocation()
  const disclosure = useSidebarDrawer()
  const { isExtendedVersion } = useSidebar()

  let isActive = false

  function handleLinkClick() {
    if (isExtendedVersion) {
      disclosure.onClose()
    }
  }

  if (shouldMatchExactHref && pathname === rest.to) {
    isActive = true
  }

  if (!shouldMatchExactHref && pathname.startsWith(String(rest.to))) {
    isActive = true
  }

  return (
    <NavLink {...rest} onClick={handleLinkClick}>
      {cloneElement(children, {
        color: isActive ? 'brand.blue' : 'base.title',
      })}
    </NavLink>
  )
}

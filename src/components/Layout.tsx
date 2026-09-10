import { NavLink, Outlet } from 'react-router-dom'
import UserMenu from './UserMenu'
import './Layout.css'

const links = [
  { to: '/calendario', label: 'Calendario' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/abogados', label: 'Abogados' },
  { to: '/turnos', label: 'Turnos' },
  { to: '/casos', label: 'Casos' },
]

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">OC & Asociados</div>
        <p className="sidebar__sub">Backoffice</p>
        <nav className="sidebar__nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <UserMenu />
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

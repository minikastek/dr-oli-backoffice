import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth'
import './UserMenu.css'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="user-menu__name">{user?.name ?? 'Usuario'}</span>
        <span className="user-menu__chev" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div className="user-menu__panel" role="menu">
          <div className="user-menu__info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <hr />
          {/* ponytail: más ítems acá cuando haya perfil, config, etc. */}
          <button
            type="button"
            role="menuitem"
            className="user-menu__item user-menu__item--danger"
            onClick={() => {
              setOpen(false)
              logout()
            }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}

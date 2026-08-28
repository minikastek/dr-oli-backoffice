import { useMemo, useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { clientFullName, clients, norm } from '../data/mock'
import './backoffice.css'

export default function ClientsPage() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const term = norm(q.trim())
    if (!term) return clients
    return clients.filter((c) => {
      const full = norm(clientFullName(c))
      return (
        full.includes(term) ||
        norm(c.firstName).includes(term) ||
        norm(c.lastName).includes(term) ||
        c.dni.includes(term)
      )
    })
  }, [q])

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Clientes</h1>
          <p>Buscá por nombre, apellido o DNI.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Nombre, apellido o DNI…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar clientes"
        />
        <span className="toolbar__count">{filtered.length} resultado(s)</span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Apellido y nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado del caso</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="data-table__empty">
                  No hay clientes que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>{clientFullName(c)}</td>
                  <td>{c.dni}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <StatusBadge status={c.caseStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

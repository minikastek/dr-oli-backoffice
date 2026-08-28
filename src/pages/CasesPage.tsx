import { useMemo, useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import {
  CASE_STATUS_LABEL,
  cases,
  clientById,
  clientFullName,
  lawyers,
  lawyerName,
  norm,
  type CaseStatus,
} from '../data/mock'
import './backoffice.css'

export default function CasesPage() {
  const [q, setQ] = useState('')
  const [lawyerId, setLawyerId] = useState('')
  const [status, setStatus] = useState<CaseStatus | ''>('')

  const filtered = useMemo(() => {
    const term = norm(q.trim())
    return cases.filter((caso) => {
      const client = clientById(caso.clientId)
      if (!client) return false
      if (lawyerId && caso.lawyerId !== lawyerId) return false
      if (status && caso.status !== status) return false
      if (!term) return true
      const full = norm(clientFullName(client))
      return (
        full.includes(term) ||
        norm(client.firstName).includes(term) ||
        norm(client.lastName).includes(term) ||
        client.dni.includes(term) ||
        norm(caso.title).includes(term) ||
        norm(caso.id).includes(term)
      )
    })
  }, [q, lawyerId, status])

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Casos</h1>
          <p>Buscá y filtrá por abogada, DNI o nombre del cliente.</p>
        </div>
      </div>

      <div className="toolbar toolbar--filters">
        <input
          type="search"
          placeholder="Nombre, apellido, DNI o título…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar casos"
        />
        <select
          value={lawyerId}
          onChange={(e) => setLawyerId(e.target.value)}
          aria-label="Filtrar por abogada"
        >
          <option value="">Todas las abogadas</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CaseStatus | '')}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {(Object.keys(CASE_STATUS_LABEL) as CaseStatus[]).map((s) => (
            <option key={s} value={s}>
              {CASE_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <span className="toolbar__count">{filtered.length} caso(s)</span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Caso</th>
              <th>Cliente</th>
              <th>DNI</th>
              <th>Abogada</th>
              <th>Estado</th>
              <th>Apertura</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="data-table__empty">
                  No hay casos con esos filtros.
                </td>
              </tr>
            ) : (
              filtered.map((caso) => {
                const client = clientById(caso.clientId)!
                return (
                  <tr key={caso.id}>
                    <td className="mono">{caso.id}</td>
                    <td>{caso.title}</td>
                    <td>{clientFullName(client)}</td>
                    <td>{client.dni}</td>
                    <td>{lawyerName(caso.lawyerId)}</td>
                    <td>
                      <StatusBadge status={caso.status} />
                    </td>
                    <td>{new Date(caso.openedAt).toLocaleDateString('es-AR')}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

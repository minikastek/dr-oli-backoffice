import { useEffect, useState } from 'react'
import { useApi, type ApiAppointment, type ApiLawyer } from '../lib/api'
import './backoffice.css'

export default function AppointmentsPage() {
  const api = useApi()
  const [rows, setRows] = useState<ApiAppointment[]>([])
  const [lawyers, setLawyers] = useState<ApiLawyer[]>([])
  const [lawyerId, setLawyerId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
      api.getLawyers().then((r) => setLawyers(r.lawyers)),
      api.getAppointments(lawyerId || undefined).then((r) => setRows(r.appointments)),
    ])
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false))
  }, [lawyerId])

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Turnos</h1>
          <p>Turnos asignados a cada abogada (solo fechas futuras).</p>
        </div>
      </div>

      <div className="toolbar toolbar--filters">
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
        <span className="toolbar__count">{rows.length} turno(s)</span>
      </div>

      {loading ? <p className="booking-loading">Cargando turnos…</p> : null}
      {error ? <p className="booking-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Abogada</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="data-table__empty">
                    No hay turnos asignados.
                  </td>
                </tr>
              ) : (
                rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {new Date(`${a.date}T12:00:00`).toLocaleDateString('es-AR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>{a.time}</td>
                    <td>{a.lawyerName}</td>
                    <td>{a.clientName}</td>
                    <td>{a.email}</td>
                    <td>{a.phone}</td>
                    <td>{a.type === 'consulta' ? 'Consulta online' : 'Turno presencial'}</td>
                    <td>
                      <span className="badge badge--confirmado">{a.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

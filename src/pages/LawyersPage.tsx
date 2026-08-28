import { useMemo, useState } from 'react'
import AvailabilityModal from '../components/AvailabilityModal'
import { StatusBadge } from '../components/StatusBadge'
import {
  casesByLawyer,
  clientById,
  clientFullName,
  formatDateRange,
  lawyers as initialLawyers,
  scheduleSummary,
  type Lawyer,
} from '../data/mock'
import { WEEKDAY_LABEL } from '../data/mock'
import './backoffice.css'

export default function LawyersPage() {
  const [list, setList] = useState<Lawyer[]>(() =>
    structuredClone(initialLawyers),
  )
  const [selectedId, setSelectedId] = useState<string>(initialLawyers[0]?.id ?? '')
  const [modalLawyerId, setModalLawyerId] = useState<string | null>(null)

  const selected = useMemo(
    () => list.find((l) => l.id === selectedId) ?? list[0],
    [list, selectedId],
  )

  const lawyerCases = useMemo(
    () => (selected ? casesByLawyer(selected.id) : []),
    [selected],
  )

  const modalLawyer = modalLawyerId ? list.find((l) => l.id === modalLawyerId) : null

  function saveLawyer(updated: Lawyer) {
    setList((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
  }

  if (!selected) {
    return (
      <section className="page">
        <h1>Abogados</h1>
        <p>No hay abogados cargados.</p>
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Abogados</h1>
          <p>Seleccioná un profesional para ver sus datos, casos y disponibilidad.</p>
        </div>
      </div>

      <div className="lawyers-layout">
        <aside className="lawyers-list">
          <h2 className="lawyers-list__title">Equipo</h2>
          <ul>
            {list.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  className={l.id === selected.id ? 'is-selected' : ''}
                  onClick={() => setSelectedId(l.id)}
                >
                  <span className="lawyers-list__name">{l.name}</span>
                  <span className="lawyers-list__spec">{l.specialty}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lawyer-detail">
          <header className="lawyer-detail__head">
            <div>
              <h2>{selected.name}</h2>
              <p>{selected.specialty}</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setModalLawyerId(selected.id)}
            >
              Disponibilidad
            </button>
          </header>

          <div className="lawyer-detail__grid">
            <section className="detail-block">
              <h3>Datos</h3>
              <dl className="detail-dl">
                <div>
                  <dt>Email</dt>
                  <dd>{selected.email}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{selected.phone}</dd>
                </div>
                <div>
                  <dt>Matrícula</dt>
                  <dd>{selected.matricula}</dd>
                </div>
              </dl>
            </section>

            <section className="detail-block">
              <h3>Horario general</h3>
              <p className="detail-block__summary">{scheduleSummary(selected.weeklySchedule)}</p>
              <ul className="schedule-summary">
                {selected.weeklySchedule.map((s) => (
                  <li key={s.day} className={s.enabled ? '' : 'is-off'}>
                    <span>{WEEKDAY_LABEL[s.day]}</span>
                    <span>{s.enabled ? `${s.from} – ${s.to}` : 'No atiende'}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="detail-block detail-block--full">
              <h3>Ausencias puntuales</h3>
              {selected.unavailableRanges.length === 0 ? (
                <p className="detail-block__muted">Sin ausencias registradas.</p>
              ) : (
                <ul className="absence-summary">
                  {selected.unavailableRanges.map((r) => (
                    <li key={r.id}>
                      <strong>{formatDateRange(r.from, r.to)}</strong>
                      {r.note ? <span>{r.note}</span> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="detail-block detail-block--full">
              <h3>Casos asociados ({lawyerCases.length})</h3>
              {lawyerCases.length === 0 ? (
                <p className="detail-block__muted">No tiene casos asignados.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Caso</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Apertura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lawyerCases.map((caso) => {
                        const client = clientById(caso.clientId)
                        return (
                          <tr key={caso.id}>
                            <td className="mono">{caso.id}</td>
                            <td>{caso.title}</td>
                            <td>{client ? clientFullName(client) : '—'}</td>
                            <td>
                              <StatusBadge status={caso.status} />
                            </td>
                            <td>
                              {new Date(caso.openedAt).toLocaleDateString('es-AR')}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {modalLawyer ? (
        <AvailabilityModal
          lawyer={modalLawyer}
          onSave={saveLawyer}
          onClose={() => setModalLawyerId(null)}
        />
      ) : null}
    </section>
  )
}

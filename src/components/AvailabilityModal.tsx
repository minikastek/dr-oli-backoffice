import { useEffect, useState } from 'react'
import type { Lawyer, UnavailableRange, WeeklySlot } from '../data/mock'
import { WEEKDAY_LABEL, WEEKDAYS } from '../data/mock'
import './AvailabilityModal.css'

type Props = {
  lawyer: Lawyer
  onSave: (updated: Lawyer) => void
  onClose: () => void
}

export default function AvailabilityModal({ lawyer, onSave, onClose }: Props) {
  const [tab, setTab] = useState<'general' | 'ausencias'>('general')
  const [weekly, setWeekly] = useState<WeeklySlot[]>(lawyer.weeklySchedule)
  const [ranges, setRanges] = useState<UnavailableRange[]>(lawyer.unavailableRanges)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    setWeekly(lawyer.weeklySchedule)
    setRanges(lawyer.unavailableRanges)
  }, [lawyer])

  function updateSlot(day: WeeklySlot['day'], patch: Partial<WeeklySlot>) {
    setWeekly((prev) => prev.map((s) => (s.day === day ? { ...s, ...patch } : s)))
  }

  function addRange(e: React.FormEvent) {
    e.preventDefault()
    if (!from || !to) return
    if (from > to) return
    setRanges((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from, to, note: note.trim() || undefined },
    ])
    setFrom('')
    setTo('')
    setNote('')
  }

  function removeRange(id: string) {
    setRanges((prev) => prev.filter((r) => r.id !== id))
  }

  function handleSave() {
    onSave({ ...lawyer, weeklySchedule: weekly, unavailableRanges: ranges })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="avail-title"
        aria-modal="true"
      >
        <header className="modal__head">
          <div>
            <h2 id="avail-title">Disponibilidad</h2>
            <p>{lawyer.name}</p>
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="modal__tabs">
          <button
            type="button"
            className={tab === 'general' ? 'is-active' : ''}
            onClick={() => setTab('general')}
          >
            Horario general
          </button>
          <button
            type="button"
            className={tab === 'ausencias' ? 'is-active' : ''}
            onClick={() => setTab('ausencias')}
          >
            Ausencias puntuales
          </button>
        </div>

        <div className="modal__body">
          {tab === 'general' ? (
            <div className="schedule-edit">
              <p className="modal__hint">
                Días y horarios habituales de atención. No afecta las ausencias puntuales.
              </p>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Activo</th>
                    <th>Desde</th>
                    <th>Hasta</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKDAYS.map((day) => {
                    const slot = weekly.find((s) => s.day === day)!
                    return (
                      <tr key={day}>
                        <td>{WEEKDAY_LABEL[day]}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={(e) => updateSlot(day, { enabled: e.target.checked })}
                            aria-label={`${WEEKDAY_LABEL[day]} activo`}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            value={slot.from}
                            disabled={!slot.enabled}
                            onChange={(e) => updateSlot(day, { from: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            value={slot.to}
                            disabled={!slot.enabled}
                            onChange={(e) => updateSlot(day, { to: e.target.value })}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="absence-edit">
              <p className="modal__hint">
                Marcá días o semanas en las que no estará disponible (licencias, feriados, etc.).
              </p>
              <form className="absence-form" onSubmit={addRange}>
                <label>
                  Desde
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
                </label>
                <label>
                  Hasta
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
                </label>
                <label className="absence-form__note">
                  Motivo (opcional)
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej. vacaciones, congreso…"
                  />
                </label>
                <button type="submit" className="btn-primary">
                  Agregar ausencia
                </button>
              </form>
              {ranges.length === 0 ? (
                <p className="modal__empty">No hay ausencias registradas.</p>
              ) : (
                <ul className="absence-list">
                  {ranges.map((r) => (
                    <li key={r.id}>
                      <div>
                        <strong>{formatRangeLabel(r.from, r.to)}</strong>
                        {r.note ? <span>{r.note}</span> : null}
                      </div>
                      <button type="button" onClick={() => removeRange(r.id)}>
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <footer className="modal__foot">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Guardar cambios
          </button>
        </footer>
      </div>
    </div>
  )
}

function formatRangeLabel(from: string, to: string) {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  const a = new Date(from + 'T12:00:00').toLocaleDateString('es-AR', opts)
  const b = new Date(to + 'T12:00:00').toLocaleDateString('es-AR', opts)
  return from === to ? a : `${a} — ${b}`
}

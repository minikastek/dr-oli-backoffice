import { useState } from 'react'
import { YearCalendar } from '../components/MonthCalendar'
import './backoffice.css'

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear())

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Calendario</h1>
          <p>Vista anual dividida por meses.</p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn-ghost" onClick={() => setYear((y) => y - 1)}>
            ← {year - 1}
          </button>
          <span className="page__year">{year}</span>
          <button type="button" className="btn-ghost" onClick={() => setYear((y) => y + 1)}>
            {year + 1} →
          </button>
        </div>
      </div>
      <YearCalendar year={year} />
    </section>
  )
}

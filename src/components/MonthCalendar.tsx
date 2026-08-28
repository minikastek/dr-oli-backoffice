const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function mondayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

type MonthCalendarProps = {
  year: number
  month: number
}

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const offset = mondayOffset(year, month)
  const total = daysInMonth(year, month)
  const cells = Array.from({ length: offset + total }, (_, i) =>
    i < offset ? null : i - offset + 1,
  )
  const today = new Date()
  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  return (
    <article className="month-card">
      <h3>{MONTHS[month]}</h3>
      <div className="month-card__weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="month-card__grid">
        {cells.map((day, i) => (
          <span
            key={i}
            className={[
              'month-card__day',
              day === null ? 'is-empty' : '',
              day !== null && isToday(day) ? 'is-today' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {day ?? ''}
          </span>
        ))}
      </div>
    </article>
  )
}

export function YearCalendar({ year }: { year: number }) {
  return (
    <div className="year-calendar">
      {MONTHS.map((_, month) => (
        <MonthCalendar key={month} year={year} month={month} />
      ))}
    </div>
  )
}

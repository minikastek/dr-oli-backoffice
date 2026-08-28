export type CaseStatus = 'pendiente' | 'en_tramite' | 'cerrado' | 'archivado'

export type Weekday = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'

export type WeeklySlot = {
  day: Weekday
  enabled: boolean
  from: string
  to: string
}

export type UnavailableRange = {
  id: string
  from: string
  to: string
  note?: string
}

export type Lawyer = {
  id: string
  name: string
  specialty: string
  email: string
  phone: string
  matricula: string
  weeklySchedule: WeeklySlot[]
  unavailableRanges: UnavailableRange[]
}

export type Client = {
  id: string
  firstName: string
  lastName: string
  dni: string
  email: string
  phone: string
  caseStatus: CaseStatus
}

export type Case = {
  id: string
  title: string
  clientId: string
  lawyerId: string
  status: CaseStatus
  openedAt: string
}

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  pendiente: 'Pendiente',
  en_tramite: 'En trámite',
  cerrado: 'Cerrado',
  archivado: 'Archivado',
}

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
}

export const WEEKDAYS: Weekday[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']

export function defaultWeeklySchedule(): WeeklySlot[] {
  return WEEKDAYS.map((day) => ({
    day,
    enabled: day !== 'sab' && day !== 'dom',
    from: '09:00',
    to: '18:00',
  }))
}

export const lawyers: Lawyer[] = [
  {
    id: 'mariela',
    name: 'Mariela Olivera Villafañe',
    specialty: 'Laboral y Previsional',
    email: 'mariela@estudio.oliveracarrion.com',
    phone: '+54 351 555-0201',
    matricula: 'M.P. 1-45001',
    weeklySchedule: defaultWeeklySchedule(),
    unavailableRanges: [
      { id: 'u1', from: '2026-09-01', to: '2026-09-07', note: 'Vacaciones' },
    ],
  },
  {
    id: 'laura',
    name: 'Laura Chumbita',
    specialty: 'Civil y Comercial',
    email: 'laura@estudio.oliveracarrion.com',
    phone: '+54 351 555-0202',
    matricula: 'M.P. 1-45002',
    weeklySchedule: defaultWeeklySchedule().map((s) =>
      s.day === 'vie' ? { ...s, to: '14:00' } : s,
    ),
    unavailableRanges: [],
  },
  {
    id: 'ana',
    name: 'Ana Belén Gómez',
    specialty: 'Familia',
    email: 'ana@estudio.oliveracarrion.com',
    phone: '+54 351 555-0203',
    matricula: 'M.P. 1-45003',
    weeklySchedule: defaultWeeklySchedule(),
    unavailableRanges: [
      { id: 'u2', from: '2026-08-25', to: '2026-08-25', note: 'Trámite personal' },
    ],
  },
]

export const clients: Client[] = [
  {
    id: 'c1',
    firstName: 'Juan',
    lastName: 'Pérez',
    dni: '30123456',
    email: 'juan.perez@mail.com',
    phone: '+54 351 555-0101',
    caseStatus: 'en_tramite',
  },
  {
    id: 'c2',
    firstName: 'María',
    lastName: 'González',
    dni: '28987654',
    email: 'maria.gonzalez@mail.com',
    phone: '+54 351 555-0102',
    caseStatus: 'pendiente',
  },
  {
    id: 'c3',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    dni: '33445566',
    email: 'carlos.rodriguez@mail.com',
    phone: '+54 351 555-0103',
    caseStatus: 'cerrado',
  },
  {
    id: 'c4',
    firstName: 'Lucía',
    lastName: 'Fernández',
    dni: '35667788',
    email: 'lucia.fernandez@mail.com',
    phone: '+54 351 555-0104',
    caseStatus: 'en_tramite',
  },
  {
    id: 'c5',
    firstName: 'Roberto',
    lastName: 'Martínez',
    dni: '27889900',
    email: 'roberto.martinez@mail.com',
    phone: '+54 351 555-0105',
    caseStatus: 'archivado',
  },
]

export const cases: Case[] = [
  {
    id: 'caso-001',
    title: 'Reclamo laboral por despido',
    clientId: 'c1',
    lawyerId: 'mariela',
    status: 'en_tramite',
    openedAt: '2026-01-15',
  },
  {
    id: 'caso-002',
    title: 'Divorcio de común acuerdo',
    clientId: 'c2',
    lawyerId: 'ana',
    status: 'pendiente',
    openedAt: '2026-02-03',
  },
  {
    id: 'caso-003',
    title: 'Sucesión intestada',
    clientId: 'c3',
    lawyerId: 'laura',
    status: 'cerrado',
    openedAt: '2025-08-20',
  },
  {
    id: 'caso-004',
    title: 'Contrato de alquiler comercial',
    clientId: 'c4',
    lawyerId: 'laura',
    status: 'en_tramite',
    openedAt: '2026-03-10',
  },
  {
    id: 'caso-005',
    title: 'Jubilación — moratoria',
    clientId: 'c5',
    lawyerId: 'mariela',
    status: 'archivado',
    openedAt: '2024-11-05',
  },
]

export function lawyerName(id: string) {
  return lawyers.find((l) => l.id === id)?.name ?? '—'
}

export function lawyerById(id: string) {
  return lawyers.find((l) => l.id === id)
}

export function casesByLawyer(lawyerId: string) {
  return cases.filter((c) => c.lawyerId === lawyerId)
}

export function clientById(id: string) {
  return clients.find((c) => c.id === id)
}

export function clientFullName(c: Client) {
  return `${c.firstName} ${c.lastName}`
}

export function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function formatDateRange(from: string, to: string) {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  const a = new Date(from + 'T12:00:00').toLocaleDateString('es-AR', opts)
  const b = new Date(to + 'T12:00:00').toLocaleDateString('es-AR', opts)
  return from === to ? a : `${a} — ${b}`
}

export function scheduleSummary(schedule: WeeklySlot[]) {
  const active = schedule.filter((s) => s.enabled)
  if (active.length === 0) return 'Sin horario definido'
  const first = active[0]
  const sameHours = active.every((s) => s.from === first.from && s.to === first.to)
  const days = active.map((s) => WEEKDAY_LABEL[s.day].slice(0, 3)).join(', ')
  return sameHours ? `${days} · ${first.from} – ${first.to}` : `${days} (horarios variables)`
}

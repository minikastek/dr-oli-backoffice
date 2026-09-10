import { useAuth } from '../auth'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export type ApiLawyer = {
  id: string
  name: string
  specialty: string
  email: string
  phone: string
  matricula: string
  weeklySchedule: Array<{ day: string; enabled: boolean; from: string; to: string }>
  unavailableRanges: Array<{ id: string; from: string; to: string; note?: string }>
}

export type ApiAppointment = {
  id: string
  lawyerId: string
  lawyerName: string
  type: 'turno' | 'consulta'
  date: string
  time: string
  clientName: string
  email: string
  phone: string
  message: string
  status: string
}

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })
  const data = (await res.json()) as T & { error?: string }
  if (!res.ok) throw new Error(data.error || 'Error de API')
  return data
}

export function useApi() {
  const { token } = useAuth()
  if (!token) throw new Error('Sin sesión')

  return {
    getLawyers: () => apiFetch<{ lawyers: ApiLawyer[] }>('/api/lawyers', token),
    getAppointments: (lawyerId?: string) => {
      const q = lawyerId ? `?lawyerId=${encodeURIComponent(lawyerId)}` : ''
      return apiFetch<{ appointments: ApiAppointment[] }>(`/api/appointments${q}`, token)
    },
    saveAvailability: (
      slug: string,
      body: {
        weeklySchedule: ApiLawyer['weeklySchedule']
        unavailableRanges: Array<{ from: string; to: string; note?: string }>
      },
    ) =>
      apiFetch<{ ok: boolean }>(`/api/lawyers/${slug}/availability`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  }
}

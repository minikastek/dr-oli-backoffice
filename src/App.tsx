import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import Login from './pages/Login'
import Layout from './components/Layout'
import CalendarPage from './pages/CalendarPage'
import ClientsPage from './pages/ClientsPage'
import LawyersPage from './pages/LawyersPage'
import CasesPage from './pages/CasesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import type { ReactNode } from 'react'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/calendario" replace />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="abogados" element={<LawyersPage />} />
            <Route path="turnos" element={<AppointmentsPage />} />
            <Route path="casos" element={<CasesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import { createContext, useContext, type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from './auth-context'
import type { AuthUser } from '../dtos/auth-user'

type LoggedInUserContextType = {
  user: AuthUser
}

const LoggedInUserContext = createContext<LoggedInUserContextType | null>(null)

export function LoggedInUserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <LoggedInUserContext.Provider value={{ user: auth.user }}>
      {children}
    </LoggedInUserContext.Provider>
  )
}

export function useLoggedInUser(): LoggedInUserContextType {
  const ctx = useContext(LoggedInUserContext)
  if (!ctx) throw new Error('useLoggedInUser debe usarse dentro de LoggedInUserProvider')
  return ctx
}

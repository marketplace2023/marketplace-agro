import { createContext, useContext, type ReactNode } from 'react'
import { useMeQuery, useLogoutMutation } from '../queries/auth-queries'
import type { AuthUser } from '../dtos/auth-user'

type UnauthenticatedContext = {
  isAuthenticated: false
  login: () => void
  logout: () => void
}

type AuthenticatedContext = {
  isAuthenticated: true
  user: AuthUser
  login: () => void
  logout: () => void
}

export type AuthContextType = UnauthenticatedContext | AuthenticatedContext

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, refetch, isLoading } = useMeQuery()
  const logoutMutation = useLogoutMutation()

  const login = () => { void refetch() }
  const logout = () => { logoutMutation.mutate() }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const value: AuthContextType = user
    ? { isAuthenticated: true, user, login, logout }
    : { isAuthenticated: false, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

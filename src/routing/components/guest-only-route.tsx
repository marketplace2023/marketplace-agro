import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../modules/auth/context/auth-context'
import type { ReactNode } from 'react'

interface GuestOnlyRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function GuestOnlyRoute({ children, redirectTo = '/' }: GuestOnlyRouteProps) {
  const auth = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? redirectTo

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

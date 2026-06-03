import { createBrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { Layout } from '../app/components/layout/Layout'
import { HomePage } from '../app/pages/HomePage'
import { GuestOnlyRoute } from './components/guest-only-route'
import { LoginPage } from '../modules/auth/pages/login'
import { RegisterPage } from '../modules/auth/pages/register'

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
    ],
  },
  {
    path: '/login',
    element: (
      <AuthShell>
        <GuestOnlyRoute>
          <LoginPage />
        </GuestOnlyRoute>
      </AuthShell>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthShell>
        <GuestOnlyRoute>
          <RegisterPage />
        </GuestOnlyRoute>
      </AuthShell>
    ),
  },
])

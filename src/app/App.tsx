import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { Toaster } from 'sonner'
import { AuthProvider } from '../modules/auth/context/auth-context'
import { isAxios401, isAxios404 } from '../modules/shared/lib/axios'
import AppRoutes from '../routing/app-routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxios401(error) || isAxios404(error)) return false
        if (error instanceof ZodError) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

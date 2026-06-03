import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { AuthProvider } from '../modules/auth/context/auth-context'
import { router } from '../routing/app-routes'
import { isAxios401, isAxios404 } from '../modules/shared/lib/axios'

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
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

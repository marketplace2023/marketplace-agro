import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { APIProvider } from '@vis.gl/react-google-maps'
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
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY ?? ''}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Toaster richColors position="top-right" />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </APIProvider>
  )
}

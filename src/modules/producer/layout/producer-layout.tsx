import { Outlet, useLocation, Navigate } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ProducerSidebar } from './producer-sidebar'
import { useAuth } from '@/modules/auth/context/auth-context'
import { Search } from 'lucide-react'

export function ProducerLayout() {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <SidebarProvider>
      <ProducerSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1 text-gray-400 hover:text-gray-600" />
          <Separator orientation="vertical" className="h-4 bg-gray-200" />
          <div className="flex flex-1 items-center">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Buscar..."
                className="h-8 w-full rounded-lg border border-gray-100 bg-gray-50 pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-300 focus:border-agrobot-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-agrobot-300 transition-colors"
              />
            </div>
          </div>
          <a href="/" className="shrink-0 text-xs font-medium text-gray-400 hover:text-agrobot-600 transition-colors">
            ← Marketplace
          </a>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

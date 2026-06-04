import { Outlet, useLocation, Navigate } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { SellerSidebar } from './seller-sidebar'
import { useAuth } from '@/modules/auth/context/auth-context'

export function SellerLayout() {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <SidebarProvider>
      <SellerSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-semibold text-gray-700">Panel del Vendedor</span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              className="text-xs font-medium text-gray-500 hover:text-agrobot-700 transition-colors"
            >
              ← Volver al marketplace
            </a>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

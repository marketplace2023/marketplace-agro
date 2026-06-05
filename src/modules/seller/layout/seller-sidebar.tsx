import { NavLink } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Package,
  FileText,
  Store,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/context/auth-context'

const navItems = [
  { title: 'Dashboard', url: '/app/seller/dashboard', icon: LayoutDashboard },
  { title: 'Mis Publicaciones', url: '/app/seller/publicaciones', icon: Package },
  { title: 'Cotizaciones', url: '/app/seller/cotizaciones', icon: FileText },
  { title: 'Mi Tienda', url: '/app/seller/tienda', icon: Store },
]

export function SellerSidebar() {
  const auth = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 border-b">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <img src="/logoagro.svg" alt="AgroMarket" className="h-7 w-auto" />
          <span className="text-[10px] font-medium text-sidebar-foreground/60">Panel del Vendedor</span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'text-agrobot-700 font-semibold' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-3">
        {auth.isAuthenticated && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-100 text-agrobot-700">
                <span className="text-xs font-bold">
                  {auth.user.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-700 truncate">{auth.user.name}</span>
            </div>
            <button
              onClick={() => auth.logout()}
              className="ml-2 shrink-0 text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

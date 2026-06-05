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
  FileText,
  LogOut,
  Heart,
  Radar,
  GitCompare,
  PhoneCall,
  Bell,
  Settings,
  User,
  Search,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/context/auth-context'

const navItems = [
  { title: 'Dashboard', url: '/app/comprador', icon: LayoutDashboard },
  { title: 'Mi Perfil', url: '/app/comprador/perfil', icon: User },
  { title: 'Mis Cotizaciones', url: '/app/comprador/cotizaciones', icon: FileText },
  { title: 'Búsquedas guardadas', url: '/app/comprador/busquedas', icon: Search },
  { title: 'Mis Favoritos', url: '/app/comprador/favoritos', icon: Heart },
  { title: 'Radar', url: '/app/comprador/radar', icon: Radar },
  { title: 'Comparador', url: '/app/comprador/comparador', icon: GitCompare },
  { title: 'Contactos', url: '/app/comprador/contactos', icon: PhoneCall },
  { title: 'Notificaciones', url: '/app/comprador/notificaciones', icon: Bell },
  { title: 'Configuración', url: '/app/comprador/configuracion', icon: Settings },
]

export function BuyerSidebar() {
  const auth = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 border-b">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <img src="/logoagro.svg" alt="AgroMarket" className="h-7 w-auto" />
          <span className="text-[10px] font-medium text-sidebar-foreground/60">Panel del Comprador</span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mi cuenta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/app/comprador'}
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

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
  ShoppingBag,
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
      <SidebarHeader className="px-4 py-4 border-b">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm text-gray-900 leading-tight">
            AgroMarket<br />
            <span className="text-[10px] font-normal text-gray-400">Panel del Comprador</span>
          </span>
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
                        isActive ? 'text-sky-700 font-semibold' : ''
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
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

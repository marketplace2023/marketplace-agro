import { NavLink, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Dashboard',           url: '/app/comprador',                icon: LayoutDashboard },
  { title: 'Mi Perfil',           url: '/app/comprador/perfil',         icon: User },
  { title: 'Mis Cotizaciones',    url: '/app/comprador/cotizaciones',   icon: FileText },
  { title: 'Búsquedas guardadas', url: '/app/comprador/busquedas',      icon: Search },
  { title: 'Mis Favoritos',       url: '/app/comprador/favoritos',      icon: Heart },
  { title: 'Radar',               url: '/app/comprador/radar',          icon: Radar },
  { title: 'Comparador',          url: '/app/comprador/comparador',     icon: GitCompare },
  { title: 'Contactos',           url: '/app/comprador/contactos',      icon: PhoneCall },
  { title: 'Notificaciones',      url: '/app/comprador/notificaciones', icon: Bell },
  { title: 'Configuración',       url: '/app/comprador/configuracion',  icon: Settings },
]

export function BuyerSidebar() {
  const auth = useAuth()
  const { pathname } = useLocation()

  function checkActive(url: string, exact = false) {
    return exact ? pathname === url : pathname === url || pathname.startsWith(url + '/')
  }

  const initials = auth.isAuthenticated
    ? auth.user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <Sidebar>
      {/* ── Logo header ─────────────────────────────────────────── */}
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex flex-col items-center gap-2.5 select-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-lg">
            <img src="/logoagro.svg" alt="AgroMarket" className="h-7 w-7 drop-shadow" />
          </div>
          <div className="text-center leading-none">
            <p className="text-[13px] font-bold tracking-wide text-white/90">TierraMarket</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Panel Comprador
            </p>
          </div>
        </NavLink>
      </SidebarHeader>

      <div className="mx-3 h-px bg-white/[0.07]" />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="gap-0 p-0">
          <SidebarGroupLabel className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-px">
              {navItems.map((item) => {
                const active = checkActive(item.url, item.url === '/app/comprador')
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium',
                        'transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white/30',
                        active
                          ? 'bg-white/12 text-white'
                          : 'text-white/50 hover:bg-white/7 hover:text-white/80'
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-emerald-400" />
                      )}
                      <item.icon
                        className={cn(
                          'h-3.75 w-3.75 shrink-0 transition-colors duration-150',
                          active ? 'text-emerald-400' : 'text-white/35'
                        )}
                      />
                      <span className={cn(active && 'font-semibold')}>{item.title}</span>
                    </NavLink>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <SidebarFooter className="px-3 pb-4 pt-0">
        <div className="mb-3 h-px bg-white/[0.07]" />
        {auth.isAuthenticated && (
          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/25 ring-1 ring-emerald-400/20">
              <span className="text-[10px] font-bold text-emerald-300">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold leading-none text-white/80 mb-0.5">
                {auth.user.name}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
                Comprador
              </p>
            </div>
            <button
              onClick={() => auth.logout()}
              className="shrink-0 rounded-md p-1 text-white/20 transition-colors hover:bg-white/10 hover:text-white/60"
              title="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

import { NavLink, useLocation } from 'react-router'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarFooter,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard, Package, FileText, Store, LogOut, User, Users,
  ShoppingBag, Tag, MapPin, BarChart2, Star, Settings,
  Wheat, Home, FlaskConical, Tractor, Briefcase, Truck,
  Users2, TestTube2, BadgeCheck, ClipboardCheck, Grid3x3,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/context/auth-context'
import { useMyStoreQuery } from '../queries/seller-queries'
import type { StoreRoleType } from '../api/seller-api'
import { cn } from '@/lib/utils'

// ─── Role metadata ─────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<StoreRoleType, {
  panelLabel: string
  shortLabel: string
  ofertaTitle: string
  ofertaIcon: React.ComponentType<{ className?: string }>
}> = {
  seller:             { panelLabel: 'Panel Vendedor',     shortLabel: 'Vendedor',          ofertaTitle: 'Mi Catálogo',           ofertaIcon: Grid3x3       },
  producer:           { panelLabel: 'Panel Productor',    shortLabel: 'Productor',          ofertaTitle: 'Mis Cosechas',          ofertaIcon: Wheat         },
  farm_owner:         { panelLabel: 'Panel Finca',        shortLabel: 'Dueño de Finca',     ofertaTitle: 'Mis Fincas',            ofertaIcon: Home          },
  input_supplier:     { panelLabel: 'Panel Insumos',      shortLabel: 'Prov. Insumos',      ofertaTitle: 'Mis Insumos',           ofertaIcon: FlaskConical  },
  machinery_supplier: { panelLabel: 'Panel Maquinaria',   shortLabel: 'Prov. Maquinaria',   ofertaTitle: 'Mi Maquinaria',         ofertaIcon: Tractor       },
  agronomist:         { panelLabel: 'Panel Asesor',       shortLabel: 'Asesor Técnico',     ofertaTitle: 'Mis Servicios',         ofertaIcon: Briefcase     },
  transporter:        { panelLabel: 'Panel Transportista',shortLabel: 'Transportista',      ofertaTitle: 'Mis Rutas',             ofertaIcon: Truck         },
  cooperative:        { panelLabel: 'Panel Cooperativa',  shortLabel: 'Cooperativa',        ofertaTitle: 'Mi Cooperativa',        ofertaIcon: Users2        },
  laboratory:         { panelLabel: 'Panel Laboratorio',  shortLabel: 'Laboratorio',        ofertaTitle: 'Mi Laboratorio',        ofertaIcon: TestTube2     },
  certifier:          { panelLabel: 'Panel Certificador', shortLabel: 'Certificador',       ofertaTitle: 'Mis Certificaciones',   ofertaIcon: BadgeCheck    },
  quality_inspector:  { panelLabel: 'Panel Inspector',    shortLabel: 'Inspector Calidad',  ofertaTitle: 'Mis Inspecciones',      ofertaIcon: ClipboardCheck},
}

const DEFAULT_CONFIG = {
  panelLabel: 'Panel Vendedor',
  shortLabel: 'Vendedor',
  ofertaTitle: 'Mi Oferta',
  ofertaIcon: Store,
}

// ─── Nav groups ────────────────────────────────────────────────────────────

const baseItems = [
  { title: 'Dashboard',  url: '/app/seller/dashboard', icon: LayoutDashboard },
  { title: 'Mi Perfil',  url: '/app/seller/perfil',    icon: User            },
]

const gestionItems = [
  { title: 'Publicaciones', url: '/app/seller/publicaciones', icon: Package     },
  { title: 'Leads',         url: '/app/seller/leads',         icon: Users       },
  { title: 'Cotizaciones',  url: '/app/seller/cotizaciones',  icon: FileText    },
  { title: 'Órdenes',       url: '/app/seller/ordenes',       icon: ShoppingBag },
]

const tiendaItems = [
  { title: 'Ofertas',    url: '/app/seller/ofertas',    icon: Tag    },
  { title: 'Mi Tienda',  url: '/app/seller/tienda',     icon: Store  },
  { title: 'Tienda GBP', url: '/app/seller/tienda-gbp', icon: MapPin },
]

const analisisItems = [
  { title: 'Analítica',   url: '/app/seller/analitica',    icon: BarChart2 },
  { title: 'Reputación',  url: '/app/seller/reputacion',   icon: Star      },
  { title: 'Configuración',url: '/app/seller/configuracion',icon: Settings },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

function NavItem({ title, url, icon: Icon, checkActive }: {
  title: string; url: string; icon: React.ComponentType<{ className?: string }>
  checkActive: (u: string) => boolean
}) {
  const active = checkActive(url)
  return (
    <SidebarMenuItem>
      <NavLink
        to={url}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium',
          'transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white/30',
          active ? 'bg-white/12 text-white' : 'text-white/50 hover:bg-white/7 hover:text-white/80',
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-emerald-400" />
        )}
        <Icon className={cn('h-3.75 w-3.75 shrink-0 transition-colors duration-150', active ? 'text-emerald-400' : 'text-white/35')} />
        <span className={cn(active && 'font-semibold')}>{title}</span>
      </NavLink>
    </SidebarMenuItem>
  )
}

function NavGroup({ label, items, checkActive }: {
  label?: string
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]
  checkActive: (u: string) => boolean
}) {
  return (
    <SidebarGroup className="gap-0 p-0 mb-1">
      {label && (
        <SidebarGroupLabel className="mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-px">
          {items.map((item) => (
            <NavItem key={item.url} {...item} checkActive={checkActive} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// ─── Sidebar ───────────────────────────────────────────────────────────────

export function SellerSidebar() {
  const auth = useAuth()
  const { pathname } = useLocation()
  const { data: store } = useMyStoreQuery()

  const roleType = store?.roleType as StoreRoleType | undefined
  const config = roleType ? (ROLE_CONFIG[roleType] ?? DEFAULT_CONFIG) : DEFAULT_CONFIG
  const OfertaIcon = config.ofertaIcon

  function checkActive(url: string) {
    return pathname === url || pathname.startsWith(url + '/')
  }

  const initials = auth.isAuthenticated
    ? auth.user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const ofertaActive = checkActive('/app/seller/oferta')

  return (
    <Sidebar>
      {/* ── Logo / Panel label ─────────────────────────────────── */}
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex flex-col items-center gap-2.5 select-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-lg">
            <img src="/logoagro.svg" alt="AgroMarket" className="h-7 w-7 drop-shadow" />
          </div>
          <div className="text-center leading-none">
            <p className="text-[13px] font-bold tracking-wide text-white/90">TierraMarket</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {config.panelLabel}
            </p>
          </div>
        </NavLink>
      </SidebarHeader>

      <div className="mx-3 h-px bg-white/[0.07]" />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <SidebarContent className="px-2 py-3">

        {/* Dashboard + Perfil */}
        <NavGroup items={baseItems} checkActive={checkActive} />

        <div className="mx-1 mb-2 h-px bg-white/[0.07]" />

        {/* Módulo especializado por rol */}
        <SidebarGroup className="gap-0 p-0 mb-1">
          <SidebarGroupLabel className="mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
            Mi Oferta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-px">
              <SidebarMenuItem>
                <NavLink
                  to="/app/seller/oferta"
                  className={cn(
                    'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium',
                    'transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white/30',
                    ofertaActive ? 'bg-white/12 text-white' : 'text-white/50 hover:bg-white/7 hover:text-white/80',
                  )}
                >
                  {ofertaActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-emerald-400" />
                  )}
                  <OfertaIcon className={cn('h-3.75 w-3.75 shrink-0', ofertaActive ? 'text-emerald-400' : 'text-white/35')} />
                  <span className={cn(ofertaActive && 'font-semibold')}>{config.ofertaTitle}</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-1 mb-2 h-px bg-white/[0.07]" />

        {/* Gestión */}
        <NavGroup label="Gestión" items={gestionItems} checkActive={checkActive} />

        {/* Tienda */}
        <NavGroup label="Tienda" items={tiendaItems} checkActive={checkActive} />

        {/* Análisis */}
        <NavGroup label="Análisis" items={analisisItems} checkActive={checkActive} />
      </SidebarContent>

      {/* ── Footer ───────────────────────────────────────────────── */}
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
                {config.shortLabel}
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

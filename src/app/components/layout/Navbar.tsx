import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
  ChevronDown, LayoutDashboard, Package, Store, HelpCircle,
  LogOut, ShoppingBag, Warehouse, Users, Plus, Menu, X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/modules/auth/context/auth-context'

const navLinks = [
  { label: 'Categorías', to: '/categorias' },
  { label: 'Catálogo',   to: '/catalogo'   },
  { label: 'Ofertas',    to: '/ofertas'    },
  { label: 'Radar',      to: '/radar'      },
  { label: 'Blog',       to: '/blog'       },
  { label: 'Ayuda',      to: '/ayuda'      },
]

const ROLE_PANELS = [
  { role: 'buyer',    label: 'Panel Comprador',  description: 'Mis cotizaciones y favoritos', to: '/app/comprador',  Icon: ShoppingBag  },
  { role: 'seller',   label: 'Panel Vendedor',   description: 'Publicaciones y tienda',      to: '/app/seller',     Icon: Store        },
  { role: 'producer', label: 'Panel Productor',  description: 'Inventario y cosechas',       to: '/app/productor',  Icon: Warehouse    },
] as const

const sellerInfoItems = [
  { Icon: LayoutDashboard, label: 'Panel del Vendedor', description: 'Gestiona tus publicaciones', to: '/app/seller/dashboard'       },
  { Icon: Package,         label: 'Mis Publicaciones',  description: 'Ver y administrar anuncios',  to: '/app/seller/publicaciones'   },
  { Icon: Store,           label: 'Mi Tienda',           description: 'Datos y perfil de tu tienda', to: '/app/seller/tienda'         },
  { Icon: HelpCircle,      label: '¿Cómo publicar?',    description: 'Guía para vendedores',        to: '/ayuda'                     },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm font-medium transition-colors ${
    isActive
      ? 'text-agrobot-700 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-agrobot-500'
      : 'text-gray-600 hover:text-agrobot-700'
  }`

function AccountDropdown() {
  const auth = useAuth()
  const navigate = useNavigate()

  if (!auth.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <NavLink
          to="/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-agrobot-700"
        >
          Ingresar
        </NavLink>
        <NavLink
          to="/register"
          className="rounded-xl bg-agrobot-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-agrobot-800"
        >
          Registrarse
        </NavLink>
      </div>
    )
  }

  const userRoles = auth.user.roles ?? []
  const availablePanels = ROLE_PANELS.filter(p => userRoles.includes(p.role))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-agrobot-200 hover:bg-agrobot-50/50 focus:outline-none">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-agrobot-700 text-[10px] font-bold text-white">
            {auth.user.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden sm:block max-w-25 truncate">{auth.user.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1">
        <div className="px-3 py-2.5 border-b mb-1">
          <p className="text-xs font-semibold text-gray-900 truncate">{auth.user.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{auth.user.email}</p>
          {userRoles.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {userRoles.map((r) => (
                <span key={r} className="rounded-full bg-agrobot-50 px-2 py-0.5 text-[10px] font-semibold text-agrobot-700">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {availablePanels.length > 0 && (
          <>
            <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">Mis paneles</p>
            {availablePanels.map((panel) => (
              <DropdownMenuItem key={panel.role} onClick={() => navigate(panel.to)} className="cursor-pointer rounded-lg">
                <panel.Icon className="h-4 w-4 mr-2 text-gray-500" />
                {panel.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {!userRoles.includes('seller') && !userRoles.includes('producer') && (
          <>
            <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">Publicar en la plataforma</p>
            <DropdownMenuItem onClick={() => navigate('/app/seller')} className="cursor-pointer rounded-lg text-agrobot-700">
              <Plus className="h-4 w-4 mr-2" />
              Comenzar como Vendedor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/productor')} className="cursor-pointer rounded-lg text-emerald-700">
              <Warehouse className="h-4 w-4 mr-2" />
              Comenzar como Productor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => auth.logout()} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center">
            <img src="/logoagro.svg" alt="TierraMarket" className="h-9 w-auto" />
          </NavLink>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: seller dropdown + auth + mobile toggle */}
        <div className="flex items-center gap-2">

          {/* Para Vendedores */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-1.5 rounded-xl border border-agrobot-200 bg-agrobot-50 px-3.5 py-2 text-sm font-semibold text-agrobot-800 transition-colors hover:bg-agrobot-100 focus:outline-none">
                Para Vendedores
                <ChevronDown className="h-3.5 w-3.5 text-agrobot-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-1">
              {sellerInfoItems.map((item, i) => (
                <div key={item.to}>
                  {i === sellerInfoItems.length - 1 && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={() => navigate(item.to)} className="flex items-start gap-3 rounded-lg p-3 cursor-pointer">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-agrobot-50">
                      <item.Icon className="h-4 w-4 text-agrobot-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              ))}
              <div className="mx-3 mb-1 mt-2 rounded-lg bg-agrobot-50 p-2.5">
                <p className="text-[11px] font-semibold text-agrobot-800">¿Eres productor agrícola?</p>
                <button onClick={() => navigate('/app/productor')} className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-agrobot-600 hover:text-agrobot-800 transition-colors">
                  <Users className="h-3 w-3" /> Panel Productor →
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth */}
          <div className="hidden md:flex">
            <AccountDropdown />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-agrobot-50 text-agrobot-800 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-agrobot-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-gray-100 pt-3">
            <AccountDropdown />
          </div>
        </div>
      )}
    </header>
  )
}

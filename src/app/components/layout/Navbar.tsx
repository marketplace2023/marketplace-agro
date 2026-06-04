import { NavLink, useNavigate } from 'react-router'
import { ChevronDown, LayoutDashboard, Package, Store, HelpCircle, LogOut, ShoppingBag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/modules/auth/context/auth-context'
import { useMyStoreQuery } from '@/modules/seller/queries/seller-queries'

const navLinks = [
  { label: 'Categorías', to: '/categorias' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Ofertas', to: '/ofertas' },
  { label: 'Radar', to: '/radar' },
  { label: 'Blog', to: '/blog' },
  { label: 'Ayuda', to: '/ayuda' },
]

const sellerMenuItems = [
  {
    icon: LayoutDashboard,
    label: 'Panel del Vendedor',
    description: 'Gestiona tus publicaciones',
    to: '/app/seller/dashboard',
  },
  {
    icon: Package,
    label: 'Mis Publicaciones',
    description: 'Ver y administrar anuncios',
    to: '/app/seller/publicaciones',
  },
  {
    icon: Store,
    label: 'Mi Tienda',
    description: 'Datos y perfil de tu tienda',
    to: '/app/seller/tienda',
  },
  {
    icon: HelpCircle,
    label: '¿Cómo publicar?',
    description: 'Guía para vendedores',
    to: '/ayuda',
  },
]

function AccountDropdown() {
  const auth = useAuth()
  const navigate = useNavigate()

  // Determine panel route: seller if user has a store, buyer otherwise
  const { data: store, isLoading: loadingStore } = useMyStoreQuery()
  const panelRoute = !loadingStore && store ? '/app/seller/dashboard' : '/app/comprador'
  const panelLabel = !loadingStore && store ? 'Panel Vendedor' : 'Panel Comprador'
  const PanelIcon = !loadingStore && store ? Store : ShoppingBag

  if (!auth.isAuthenticated) {
    return (
      <NavLink
        to="/login"
        className="rounded-lg border border-agrobot-100 px-4 py-1.5 text-sm font-medium text-agrobot-900 transition-colors hover:bg-agrobot-50"
      >
        Ingresar
      </NavLink>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-agrobot-700 text-[10px] font-bold text-white">
            {auth.user.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden sm:block max-w-25 truncate">{auth.user.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1">
        <div className="px-3 py-2 border-b mb-1">
          <p className="text-xs font-semibold text-gray-900 truncate">{auth.user.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{auth.user.email}</p>
        </div>
        <DropdownMenuItem onClick={() => navigate(panelRoute)} className="cursor-pointer">
          <PanelIcon className="h-4 w-4 mr-2 text-gray-500" />
          {panelLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => auth.logout()}
          className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center">
            <img src="/logoagro.svg" alt="TierraMarket" className="h-8 w-auto" />
          </NavLink>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className="text-sm text-[#334155] transition-colors hover:text-agrobot-600"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: seller dropdown + auth */}
        <div className="flex items-center gap-2">

          {/* Para Vendedores dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-1 rounded-lg border border-agrobot-200 bg-agrobot-50 px-3 py-1.5 text-sm font-semibold text-agrobot-800 transition-colors hover:bg-agrobot-100 focus:outline-none">
                Para Vendedores
                <ChevronDown className="h-3.5 w-3.5 text-agrobot-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-1">
              {sellerMenuItems.map((item, i) => (
                <>
                  {i === sellerMenuItems.length - 1 && (
                    <DropdownMenuSeparator key={`sep-${i}`} />
                  )}
                  <DropdownMenuItem
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className="flex items-start gap-3 rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-agrobot-50">
                      <item.icon className="h-4 w-4 text-agrobot-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </DropdownMenuItem>
                </>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth area */}
          <AccountDropdown />
        </div>

      </div>
    </header>
  )
}

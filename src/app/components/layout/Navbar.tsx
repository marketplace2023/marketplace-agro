import { NavLink } from 'react-router'

const navLinks = [
  { label: 'Categorías', to: '/categorias' },
  { label: 'Ofertas', to: '/ofertas' },
  { label: 'Radar', to: '/radar' },
  { label: 'Publicar', to: '/login' },
  { label: 'Ayuda', to: '/ayuda' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
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
        <NavLink
          to="/login"
          className="rounded-lg border border-agrobot-100 px-4 py-1.5 text-sm font-medium text-agrobot-900 transition-colors hover:bg-agrobot-50"
        >
          Ingresar
        </NavLink>
      </div>
    </header>
  )
}

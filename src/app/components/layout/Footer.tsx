import { useState } from 'react'
import { Link } from 'react-router'
import { Mail, Phone, MapPin, Leaf } from 'lucide-react'

function SvgInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}
function SvgTwitterX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.918l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function SvgLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
function SvgYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  )
}

const COLUMNS = [
  {
    title: 'Mercado',
    links: [
      { label: 'Catálogo',        to: '/catalogo'   },
      { label: 'Categorías',      to: '/categorias' },
      { label: 'Ofertas',         to: '/ofertas'    },
      { label: 'Radar Agrícola',  to: '/radar'      },
      { label: 'Blog',            to: '/blog'       },
    ],
  },
  {
    title: 'Vendedores',
    links: [
      { label: 'Panel del Vendedor',   to: '/app/seller'    },
      { label: 'Panel del Productor',  to: '/app/productor' },
      { label: 'Cómo publicar',        to: '/ayuda'         },
      { label: 'Planes y tarifas',     to: '/planes'        },
      { label: 'Verificación',         to: '/verificacion'  },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nosotros',       to: '/sobre-nosotros' },
      { label: 'Centro de Ayuda',      to: '/ayuda'          },
      { label: 'Contacto',             to: '/contacto'       },
      { label: 'Términos y Condiciones', to: '/terminos'     },
      { label: 'Política de Privacidad', to: '/privacidad'   },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-agrobot-900">

      {/* Newsletter banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-bold text-white">
                Mantente al tanto del agro
              </p>
              <p className="mt-1 text-sm text-agrobot-200">
                Alertas de cosechas, precios y oportunidades directamente en tu correo.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full sm:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="h-11 w-full rounded-l-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-agrobot-400 outline-none focus:border-agrobot-400 sm:w-60"
              />
              <button
                type="submit"
                className="h-11 rounded-r-xl bg-agrobot-600 px-5 text-sm font-bold text-white transition-colors hover:bg-agrobot-500 whitespace-nowrap"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">

          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logoagro.svg" alt="TierraMarket" className="h-9 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed text-agrobot-200 max-w-xs">
              La plataforma de comercio agrícola más completa de Venezuela. Conectamos productores, vendedores y compradores con tecnología y confianza.
            </p>

            {/* Contact */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 text-sm text-agrobot-300">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+58 412-000-0000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-agrobot-300">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hola@tierramarket.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-agrobot-300">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Venezuela 🇻🇪</span>
              </div>
            </div>

            {/* Social */}
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: SvgInstagram, label: 'Instagram' },
                { Icon: SvgTwitterX,  label: 'X / Twitter' },
                { Icon: SvgLinkedin,  label: 'LinkedIn' },
                { Icon: SvgYoutube,   label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-agrobot-300 transition-all hover:border-agrobot-400 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white">
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-agrobot-300 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {[
                'SSL Cifrado',
                'Datos Protegidos',
                'Vendedores Verificados',
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-agrobot-400">
                  <Leaf className="h-3.5 w-3.5 text-agrobot-500" />
                  {badge}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-agrobot-400">
              <Link to="/terminos"   className="hover:text-white transition-colors">Términos</Link>
              <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link to="/cookies"    className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-agrobot-500">
          © 2026 TierraMarket · Todos los derechos reservados · Hecho con 🌱 en Venezuela
        </div>
      </div>

    </footer>
  )
}

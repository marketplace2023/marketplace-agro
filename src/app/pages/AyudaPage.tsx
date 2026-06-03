import { useState } from 'react'
import { Search, ArrowRight, User, FileText, CreditCard, Radar, ShieldCheck, ShoppingCart, Tractor, Store, MessageCircle, ChevronRight } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const shortcuts = [
  { label: 'Mi Cuenta', Icon: User },
  { label: 'Publicaciones', Icon: FileText },
  { label: 'Pagos y Planes', Icon: CreditCard },
  { label: 'Radar Agrícola', Icon: Radar },
  { label: 'Seguridad', Icon: ShieldCheck },
]

const articulos = [
  '¿Cómo publicar mi primera cosecha?',
  '¿Cómo funciona el Radar Premium para productores?',
  'Métodos de pago aceptados en la plataforma',
  'Guía de seguridad para transacciones de maquinaria',
  '¿Qué es el Sello de Verificación TierraMarket?',
]

const guias = [
  {
    label: 'Compradores',
    Icon: ShoppingCart,
    color: 'text-agrobot-700',
    bg: 'bg-agrobot-50',
    links: ['Búsqueda avanzada', 'Protección al comprador'],
  },
  {
    label: 'Productores',
    Icon: Tractor,
    color: 'text-agrobot-700',
    bg: 'bg-agrobot-50',
    links: ['Gestión de lotes', 'Informes climáticos'],
  },
  {
    label: 'Vendedores',
    Icon: Store,
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    links: ['Publicidad premium', 'Retiro de fondos'],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AyudaPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="bg-white flex flex-col">

      {/* Hero */}
      <section className="bg-gray-50 py-12 text-center border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="font-display text-4xl font-bold text-agrobot-800 mb-5">
            ¿En qué podemos ayudarte?
          </h1>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca guías, tutoriales o problemas técnicos..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Por ejemplo:{' '}
            <button className="text-agrobot-700 underline underline-offset-2">Seguridad de cuenta</button>
            {', '}
            <button className="text-agrobot-700 underline underline-offset-2">Cómo vender</button>
            {' o '}
            <button className="text-agrobot-700 underline underline-offset-2">Radar Premium</button>
          </p>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {shortcuts.map(({ label, Icon }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-agrobot-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agrobot-50">
                <Icon className="h-5 w-5 text-agrobot-600" />
              </div>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Articles + Guides */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">

          {/* Artículos destacados */}
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Artículos destacados</h2>
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {articulos.map((art) => (
                <button
                  key={art}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span>{art}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Guías por rol */}
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Guías por rol</h2>
            <div className="flex flex-col gap-3">
              {guias.map(({ label, Icon, color, bg, links }) => (
                <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <span className={`font-semibold text-sm ${color}`}>{label}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {links.map((link) => (
                      <li key={link}>
                        <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-agrobot-700 transition-colors">
                          <ChevronRight className="h-3 w-3 shrink-0" />
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ¿Aún necesitas ayuda? */}
      <section className="bg-gray-50 border-t border-gray-100 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">¿Aún necesitas ayuda?</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Nuestro equipo de soporte técnico está disponible para asistirte en cada paso<br className="hidden sm:block" /> de tu producción.
          </p>
          <div className="flex justify-center">
            {/* WhatsApp */}
            <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl bg-agrobot-700 p-7 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-ping absolute" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>
              <h3 className="font-bold text-white">Contactar por WhatsApp</h3>
              <p className="text-xs text-white/75 text-center leading-relaxed">
                Soporte técnico directo y rápido para urgencias en el campo.
              </p>
              <button className="mt-1 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-agrobot-800 transition-colors hover:bg-agrobot-50">
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section
        className="relative flex flex-1 items-end overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.05) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 220,
        }}
      >
        <div className="relative z-10 p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
            TierraMarket te acompaña
          </p>
          <p className="text-base font-semibold text-white max-w-sm leading-relaxed">
            Estamos construyendo el futuro del campo en Latinoamérica junto a miles de productores.
          </p>
        </div>
      </section>

    </div>
  )
}

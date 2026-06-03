import { useState } from 'react'
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Wheat,
  TreePine,
  Package,
  Wrench,
  Briefcase,
  FlaskConical,
  Bell,
  Map,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'VERIFICADO' | 'LAB CERTIFICADO' | 'OFERTA'

interface Product {
  id: number
  title: string
  price: string
  originalPrice?: string
  unit: string
  rating: number
  reviews: number
  location: string
  badge?: BadgeVariant
  gradient: string
  Icon: LucideIcon
}

interface Store {
  id: number
  name: string
  reviews: number
  description: string
  zone: string
  initials: string
  avatarColor: string
}

interface Category {
  label: string
  Icon: LucideIcon
}

interface Step {
  number: string
  title: string
  Icon: LucideIcon
  description: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  { label: 'Cosechas', Icon: Wheat },
  { label: 'Fincas', Icon: TreePine },
  { label: 'Insumos', Icon: Package },
  { label: 'Maquinaria', Icon: Wrench },
  { label: 'Servicios', Icon: Briefcase },
  { label: 'Laboratorios', Icon: FlaskConical },
]

const badgeStyles: Record<BadgeVariant, string> = {
  VERIFICADO:        'bg-agrobot-600 text-white',
  'LAB CERTIFICADO': 'bg-agro-tech-700 text-white',
  OFERTA:            'bg-agro-earth-500 text-white',
}

const products: Product[] = [
  {
    id: 1,
    title: 'Cosecha de Maíz Híbrido',
    price: '$450',
    unit: '/ Ton',
    rating: 4.9,
    reviews: 12,
    location: 'Córdoba, Argentina',
    badge: 'VERIFICADO',
    gradient: 'from-agrobot-700 to-agrobot-900',
    Icon: Wheat,
  },
  {
    id: 2,
    title: 'Tractor John Deere 6125J',
    price: '$72,000',
    unit: '',
    rating: 5.0,
    reviews: 4,
    location: 'Mato Grosso, Brasil',
    gradient: 'from-agro-earth-500 to-agro-earth-700',
    Icon: Wrench,
  },
  {
    id: 3,
    title: 'Análisis de Suelo NPK',
    price: '$85',
    unit: '/ Muestra',
    rating: 4.7,
    reviews: 28,
    location: 'Sonora, México',
    badge: 'LAB CERTIFICADO',
    gradient: 'from-agro-tech-500 to-agro-tech-700',
    Icon: FlaskConical,
  },
  {
    id: 4,
    title: 'Fertilizante Orgánico...',
    price: '$320',
    originalPrice: '$380',
    unit: '',
    rating: 4.8,
    reviews: 56,
    location: 'Cundinamarca, CO',
    badge: 'OFERTA',
    gradient: 'from-agrobot-600 to-agrobot-900',
    Icon: Package,
  },
]

const stores: Store[] = [
  {
    id: 1,
    name: 'AgroIndustrias del Sur',
    reviews: 129,
    description: 'Especialistas en granos y oleaginosas con más de 20 años de experiencia.',
    zone: 'PAMPA HÚMEDA',
    initials: 'AS',
    avatarColor: 'bg-agro-tech-700',
  },
  {
    id: 2,
    name: 'Suministros TecnoCampo',
    reviews: 48,
    description: 'Distribuidores autorizados de maquinaria y repuestos de alta gama.',
    zone: 'VALLE CENTRAL',
    initials: 'ST',
    avatarColor: 'bg-agro-earth-500',
  },
  {
    id: 3,
    name: 'Laboratorios BioLatam',
    reviews: 32,
    description: 'Expertos en biotecnología y optimización de cultivos tropicales.',
    zone: 'REGIÓN ANDINA',
    initials: 'LB',
    avatarColor: 'bg-agrobot-600',
  },
]

const popularZones = [
  'Córdoba, AR',
  'Sinaloa, MX',
  'Tolima, CO',
  'Mato Grosso, BR',
  'Maule, CL',
  'Manabí, EC',
]

const steps: Step[] = [
  {
    number: '1',
    title: 'Busca',
    Icon: Search,
    description:
      'Encuentra productos, servicios o maquinaria con filtros avanzados de zona y reputación.',
  },
  {
    number: '2',
    title: 'Cotiza',
    Icon: ClipboardList,
    description:
      'Compara precios, revisa reseñas de otros productores y solicita cotizaciones directas.',
  },
  {
    number: '3',
    title: 'Conecta',
    Icon: ShieldCheck,
    description:
      'Cierra el trato de forma segura y coordina la logística directamente con el vendedor.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:border-agrobot-100 hover:shadow-card-hover">
      <div
        className={`relative flex aspect-video items-center justify-center bg-linear-to-br ${product.gradient}`}
      >
        <product.Icon className="h-14 w-14 text-white/20" />
        {product.badge && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-bold ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-agro-earth-500 text-agro-earth-500" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-foreground">{product.title}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-base font-bold text-agrobot-700">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.originalPrice}
            </span>
          )}
          {product.unit && <span className="text-xs text-muted-foreground">{product.unit}</span>}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {product.location}
        </div>
        <button className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-agrobot-200 hover:bg-agrobot-50 hover:text-agrobot-800">
          Ver Detalle
        </button>
      </div>
    </div>
  )
}

function StoreCard({ store }: { store: Store }) {
  return (
    <div className="rounded-xl border border-border bg-surface-soft p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${store.avatarColor}`}
        >
          {store.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-bold text-foreground">{store.name}</p>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-agrobot-600" />
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-agro-earth-500 text-agro-earth-500" />
            ))}
            <span className="text-xs text-muted-foreground">{store.reviews} reseñas</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{store.description}</p>
      <div className="mt-3">
        <span className="inline-block rounded-full bg-agrobot-50 px-2.5 py-0.5 text-xs font-bold text-agrobot-800">
          ZONA: {store.zone}
        </span>
      </div>
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  return (
    <section className="bg-hero-gradient py-16 text-center">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display mx-auto max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-agrobot-900 md:text-5xl">
          Conectando la fuerza del campo con el futuro digital
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#475569]">
          La plataforma líder para transacciones agrícolas seguras y transparentes en toda
          Latinoamérica.
        </p>

        {/* Buscador */}
        <div
          className="mx-auto mt-8 flex max-w-2xl items-center overflow-hidden rounded-2xl bg-white"
          style={{ border: '1px solid #D1FAE5', boxShadow: '0 18px 45px rgba(15,23,42,0.10)' }}
        >
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué producto, finca, insumo o servicio buscas?"
              className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2 px-4">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="¿Dónde?"
              className="w-28 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="pr-2">
            <button
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors"
              style={{ background: '#10B981' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#10B981')}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoriesSection() {
  return (
    <section className="border-y border-border bg-white py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-center gap-6 md:gap-10">
          {categories.map(({ label, Icon }) => (
            <button
              key={label}
              className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-agrobot-700"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-all group-hover:border-agrobot-100 group-hover:bg-agrobot-50">
                <Icon className="h-6 w-6 group-hover:text-agrobot-600" />
              </div>
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProductsSection() {
  return (
    <section className="bg-surface py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Anuncios Destacados</h2>
          <a href="#" className="text-sm font-semibold text-agrobot-600 hover:underline">
            Ver todos
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedStoresSection() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display mb-5 text-xl font-bold text-foreground">
          Tiendas y Productores Destacados
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PopularZonesSection() {
  return (
    <section className="bg-surface py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display mb-5 text-xl font-bold text-foreground">Zonas Populares</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {popularZones.map((zone) => (
            <button
              key={zone}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-[#334155] transition-all hover:border-agrobot-500 hover:bg-agrobot-50 hover:text-agrobot-800"
            >
              {zone}
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="flex min-h-55">
            <div className="flex flex-1 items-center justify-center bg-surface">
              <div className="text-center opacity-20">
                <Map className="mx-auto h-28 w-28 text-agrobot-700" />
                <p className="mt-2 text-xs font-semibold text-agrobot-700">Latinoamérica</p>
              </div>
            </div>
            <div className="flex w-56 shrink-0 flex-col items-center justify-center gap-4 border-l border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agrobot-50">
                <Map className="h-6 w-6 text-agrobot-600" />
              </div>
              <p className="text-center text-sm font-semibold text-foreground">
                Explorar por Mapa Interactivo
              </p>
              <button className="text-sm font-semibold text-agrobot-600 hover:underline">
                Activar Vista de Mapa
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="bg-agrobot-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display mb-10 text-center text-2xl font-bold text-agrobot-900">
          ¿Cómo funciona TierraMarket?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-agrobot-100 bg-white shadow-sm">
                <step.Icon className="h-7 w-7 text-agrobot-600" />
              </div>
              <p className="font-semibold text-agrobot-900">
                {step.number}. {step.title}
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#475569]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RadarCtaSection() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-agrobot-800 p-8 md:p-12">
          <div className="relative z-10 max-w-lg">
            <span className="mb-4 inline-block rounded-full bg-agrobot-700 px-3 py-1 text-xs font-bold text-agrobot-100">
              NUEVO SERVICIO
            </span>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Radar Agrícola: No te pierdas nada
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-agrobot-100">
              ¿No encuentras lo que buscas? Activa alertas personalizadas por zona y categoría.
              Te avisaremos apenas alguien publique lo que necesitas.
            </p>
            <button className="mt-6 rounded-xl bg-agrobot-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#043927]">
              Activar Radar Ahora
            </button>
          </div>
          <Bell className="absolute right-8 top-1/2 h-48 w-48 -translate-y-1/2 text-white opacity-10" />
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FeaturedStoresSection />
      <PopularZonesSection />
      <HowItWorksSection />
      <RadarCtaSection />
    </div>
  )
}

import { useState, useEffect } from 'react'
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
  ClipboardList,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons in Vite
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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


interface VzZone {
  name: string
  state: string
  crops: string
  lat: number
  lng: number
}

const venezuelaZones: VzZone[] = [
  { name: 'Acarigua–Araure',            state: 'Portuguesa',    crops: 'Maíz, arroz, sorgo, caña, agroindustria',        lat:  9.5545, lng: -69.1956 },
  { name: 'Turén',                       state: 'Portuguesa',    crops: 'Maíz, arroz, soya, cereales',                    lat:  9.3310, lng: -69.1149 },
  { name: 'Guanare',                     state: 'Portuguesa',    crops: 'Maíz, caña, ganadería, arroz',                   lat:  9.0437, lng: -69.7489 },
  { name: 'Calabozo / Río Guárico',      state: 'Guárico',       crops: 'Arroz, maíz, ganadería',                         lat:  8.9242, lng: -67.4293 },
  { name: 'Valle de la Pascua',          state: 'Guárico',       crops: 'Maíz, sorgo, ganadería',                         lat:  9.2217, lng: -65.9795 },
  { name: 'Zaraza',                      state: 'Guárico',       crops: 'Ganadería, maíz, cereales',                      lat:  9.3503, lng: -65.3245 },
  { name: 'San Carlos / Tinaco',         state: 'Cojedes',       crops: 'Arroz, maíz, caña, ganadería',                   lat:  9.6612, lng: -68.5827 },
  { name: 'Barinas',                     state: 'Barinas',       crops: 'Maíz, arroz, ganadería, palma',                  lat:  8.6226, lng: -70.2075 },
  { name: 'Sabaneta',                    state: 'Barinas',       crops: 'Maíz, arroz, ganadería',                         lat:  8.7537, lng: -69.9330 },
  { name: 'El Vigía / Sur del Lago',     state: 'Mérida–Zulia',  crops: 'Plátano, cambur, cacao, ganadería',              lat:  8.6135, lng: -71.6570 },
  { name: 'Caja Seca / Sur del Lago',    state: 'Zulia',         crops: 'Plátano, cacao, palma, ganadería',               lat:  9.1408, lng: -71.0794 },
  { name: 'Machiques / Perijá',          state: 'Zulia',         crops: 'Ganadería bovina, leche, pastos',                lat: 10.0608, lng: -72.5521 },
  { name: 'La Grita',                    state: 'Táchira',       crops: 'Hortalizas, papa, café, flores',                 lat:  8.1363, lng: -71.9837 },
  { name: 'Bailadores',                  state: 'Mérida',        crops: 'Papa, ajo, zanahoria, fresas, hortalizas',       lat:  8.2564, lng: -71.8260 },
  { name: 'Mucuchíes / Páramo merideño', state: 'Mérida',        crops: 'Papa, zanahoria, ajo, hortalizas de altura',     lat:  8.7519, lng: -70.9147 },
  { name: 'Boconó',                      state: 'Trujillo',      crops: 'Café, hortalizas, frutas, caña',                 lat:  9.2440, lng: -70.2694 },
  { name: 'Carora / Torres',             state: 'Lara',          crops: 'Café, hortalizas, uva, ganadería caprina',       lat: 10.1755, lng: -70.0804 },
  { name: 'Quíbor',                      state: 'Lara',          crops: 'Cebolla, tomate, pimentón, hortalizas',          lat:  9.9276, lng: -69.6201 },
  { name: 'El Tocuyo / Morán',           state: 'Lara',          crops: 'Caña, café, hortalizas, frutas',                 lat:  9.7876, lng: -69.7920 },
  { name: 'Yaritagua / Bruzual',         state: 'Yaracuy',       crops: 'Caña de azúcar, maíz, frutas',                   lat: 10.0807, lng: -69.1261 },
  { name: 'Nirgua',                      state: 'Yaracuy',       crops: 'Café, cítricos, cacao, frutas',                  lat: 10.1504, lng: -68.5668 },
  { name: 'Barlovento / Caucagua',       state: 'Miranda',       crops: 'Cacao, coco, plátano, frutas tropicales',        lat: 10.2822, lng: -66.3797 },
  { name: 'Chuao–Choroní / Aragua',      state: 'Aragua',        crops: 'Cacao fino, coco, frutas',                       lat: 10.4847, lng: -67.5250 },
  { name: 'Río Caribe / Paria',          state: 'Sucre',         crops: 'Cacao, coco, frutas tropicales',                 lat: 10.6966, lng: -63.1090 },
  { name: 'Tucupita / Delta Orinoco',    state: 'Delta Amacuro', crops: 'Arroz, cacao, raíces, pesca-agro',               lat:  9.0581, lng: -62.0504 },
]

const heroSlides = [
  {
    badge: 'Campaña Estacional',
    title: 'Gran Venta de Cosecha 2026',
    description: 'Maquinaria, semillas y fertilizantes con descuentos de hasta el 40%.',
    cta: 'Ver ofertas',
    ctaTo: '/ofertas',
    bg: '/farm-bg.png',
    overlay: 'rgba(5,46,22,0.55)',
  },
  {
    badge: 'Mercado Agrícola',
    title: 'Conecta con proveedores certificados',
    description: 'Miles de productores y distribuidores verificados en toda Venezuela.',
    cta: 'Explorar categorías',
    ctaTo: '/categorias',
    bg: '/bg-cafe.png',
    overlay: 'rgba(4,30,18,0.60)',
  },
  {
    badge: 'Nuevo servicio',
    title: 'Radar Agrícola: Alertas en tiempo real',
    description: 'Activá alertas por zona y categoría. Te avisamos cuando publiquen lo que necesitás.',
    cta: 'Activar Radar',
    ctaTo: '/radar',
    bg: '/farm-bg.png',
    overlay: 'rgba(2,20,10,0.68)',
  },
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
    <section>
      {/* Carousel */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        style={{ height: 420 }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className="relative flex h-full w-full flex-col justify-end p-8 md:p-14"
              style={{
                backgroundImage: `linear-gradient(to top, ${slide.overlay} 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%), url('${slide.bg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="mb-3 inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {slide.badge}
              </span>
              <h1 className="font-display max-w-lg text-3xl font-extrabold leading-tight text-white md:text-4xl">
                {slide.title}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                {slide.description}
              </p>
              <a
                href={slide.ctaTo}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-agrobot-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-700"
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Buscador debajo del carousel */}
      <div className="bg-white border-b border-border py-5">
        <div className="mx-auto max-w-3xl px-4">
          <div
            className="flex items-center overflow-hidden rounded-2xl bg-white"
            style={{ border: '1px solid #D1FAE5', boxShadow: '0 8px 30px rgba(15,23,42,0.08)' }}
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

const vzIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:12px;height:12px;background:#15803d;border:2px solid #fff;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.35)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const vzStates = [...new Set(venezuelaZones.map(z => z.state))]

function FlyToZone({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [lat, lng, zoom, map])
  return null
}

function PopularZonesSection() {
  const [activeState, setActiveState] = useState<string | null>(null)

  const filtered = activeState
    ? venezuelaZones.filter(z => z.state === activeState)
    : venezuelaZones

  const flyTarget = activeState
    ? { lat: filtered[0].lat, lng: filtered[0].lng, zoom: 8 }
    : { lat: 8.5, lng: -66.5, zoom: 6 }

  return (
    <section className="bg-surface py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Zonas Agrícolas · Venezuela</h2>
          <span className="text-xs text-muted-foreground">{venezuelaZones.length} zonas registradas</span>
        </div>

        {/* State filter pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveState(null)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              activeState === null
                ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800'
                : 'border-border text-[#334155] hover:border-agrobot-300 hover:bg-agrobot-50 hover:text-agrobot-800'
            }`}
          >
            Todas
          </button>
          {vzStates.map((state) => (
            <button
              key={state}
              onClick={() => setActiveState(state)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                activeState === state
                  ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800'
                  : 'border-border text-[#334155] hover:border-agrobot-300 hover:bg-agrobot-50 hover:text-agrobot-800'
              }`}
            >
              <MapPin className="h-3 w-3" />
              {state}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border shadow-card" style={{ height: 420 }}>
          <MapContainer
            center={[8.5, -66.5]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((z) => (
              <Marker key={z.name} position={[z.lat, z.lng]} icon={vzIcon}>
                <Popup>
                  <div style={{ minWidth: 170 }}>
                    <p style={{ fontWeight: 700, marginBottom: 3, color: '#14532d', fontSize: 13 }}>{z.name}</p>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Estado: <strong>{z.state}</strong></p>
                    <p style={{ fontSize: 11, color: '#64748b' }}>Rubros: {z.crops}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <FlyToZone lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom} />
          </MapContainer>
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

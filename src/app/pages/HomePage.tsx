import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Search, MapPin, CheckCircle2,
  Wheat, TreePine, Package, Wrench, Briefcase, FlaskConical,
  Bell, ClipboardList, ShieldCheck, ArrowRight,
  BadgeCheck, ClipboardCheck, Star, Users, BarChart2,
  TrendingUp, Zap, Quote,
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
import { useCategoriesQuery } from '../../modules/categories/queries/category-queries'
import { useFeaturedListingsQuery } from '../../modules/listings/queries/listing-queries'
import { useFeaturedStoresQuery } from '../../modules/stores/queries/store-queries'
import type { FeaturedListing } from '../../modules/listings/api/listings'
import type { StoreListItem } from '../../modules/stores/api/stores'

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  cosechas: Wheat, fincas: TreePine, insumos: Package,
  maquinaria: Wrench, servicios: Briefcase, laboratorios: FlaskConical,
  certificadores: BadgeCheck, inspectores: ClipboardCheck,
}
const CATEGORY_GRADIENTS: Record<string, string> = {
  cosechas:     'from-agrobot-600  to-agrobot-900',
  fincas:       'from-emerald-600  to-emerald-900',
  insumos:      'from-lime-600     to-lime-900',
  maquinaria:   'from-orange-500   to-orange-800',
  servicios:    'from-sky-500      to-sky-900',
  laboratorios: 'from-cyan-600     to-cyan-900',
  certificadores:'from-violet-600  to-violet-900',
  inspectores:  'from-teal-600     to-teal-900',
}
function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICON_MAP[name.toLowerCase()] ?? Wheat
}
function getCategoryGradient(name: string | null): string {
  if (!name) return 'from-agrobot-700 to-agrobot-900'
  return CATEGORY_GRADIENTS[name.toLowerCase()] ?? 'from-agrobot-700 to-agrobot-900'
}
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// ─── Static data ──────────────────────────────────────────────────────────────

const heroSlides = [
  {
    badge: 'Campaña Estacional',
    title: 'Gran Venta de Cosecha 2026',
    desc: 'Maquinaria, semillas y fertilizantes con descuentos de hasta el 40%.',
    cta: 'Ver ofertas', ctaTo: '/ofertas',
    bg: '/farm-bg.png', overlay: 'rgba(5,46,22,0.58)',
  },
  {
    badge: 'Mercado Agrícola',
    title: 'Conecta con proveedores certificados',
    desc: 'Miles de productores y distribuidores verificados en toda Venezuela.',
    cta: 'Explorar categorías', ctaTo: '/categorias',
    bg: '/bg-cafe.png', overlay: 'rgba(4,30,18,0.62)',
  },
  {
    badge: 'Nuevo Servicio',
    title: 'Radar Agrícola: Alertas en tiempo real',
    desc: 'Activá alertas por zona y categoría. Te avisamos cuando publiquen lo que necesitás.',
    cta: 'Activar Radar', ctaTo: '/radar',
    bg: '/farm-bg.png', overlay: 'rgba(2,20,10,0.70)',
  },
]

const STATS = [
  { Icon: Users,     value: '8,000+',  label: 'Vendedores activos'    },
  { Icon: Package,   value: '120,000', label: 'Publicaciones'         },
  { Icon: BarChart2, value: '14',      label: 'Categorías agrícolas'  },
  { Icon: TrendingUp,value: '98%',     label: 'Satisfacción de compra' },
]

const STEPS = [
  { n: '01', Icon: Search,        title: 'Buscá',   desc: 'Filtrá por zona, categoría y reputación para encontrar exactamente lo que necesitás.'  },
  { n: '02', Icon: ClipboardList, title: 'Cotizá',  desc: 'Comparás precios, revisás reseñas y solicitás cotizaciones directas al vendedor.'         },
  { n: '03', Icon: ShieldCheck,   title: 'Conectá', desc: 'Cerrás el trato de forma segura y coordinás la logística con el vendedor.'               },
]

const TESTIMONIALS = [
  {
    name:    'Carlos Medina',
    role:    'Productor de Maíz · Portuguesa',
    text:    'Desde que empecé a usar TierraMarket, duplicar mis ventas fue cuestión de semanas. El radar me avisa exactamente cuándo hay compradores en mi zona.',
    avatar:  'CM',
    rating:  5,
    color:   'bg-agrobot-700',
  },
  {
    name:    'Ingrid Rodríguez',
    role:    'Distribuidora de Insumos · Lara',
    text:    'La plataforma más seria del agro venezolano. El sistema de verificación me da confianza para trabajar con nuevos clientes sin riesgos.',
    avatar:  'IR',
    rating:  5,
    color:   'bg-orange-600',
  },
  {
    name:    'José Torrealba',
    role:    'Comprador institucional · Guárico',
    text:    'Consigo proveedores de maquinaria confiables sin salir de la oficina. El proceso de cotización es muy ágil y los precios son competitivos.',
    avatar:  'JT',
    rating:  5,
    color:   'bg-sky-700',
  },
]

interface VzZone { name: string; state: string; crops: string; lat: number; lng: number }

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

const vzIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:10px;height:10px;background:#10B981;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [10, 10], iconAnchor: [5, 5],
})
const vzStates = [...new Set(venezuelaZones.map((z) => z.state))]

function FlyToZone({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lng], zoom, { duration: 1.2 }) }, [lat, lng, zoom, map])
  return null
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  function handleSearch() {
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (location) p.set('location', location)
    navigate(`/catalogo${p.toString() ? `?${p}` : ''}`)
  }

  return (
    <section>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        navigation pagination={{ clickable: true }}
        loop
        style={{ height: 520 }}
      >
        {heroSlides.map((s) => (
          <SwiperSlide key={s.title}>
            <div
              className="relative flex h-full w-full flex-col justify-end px-6 pb-20 md:px-16 md:pb-24"
              style={{
                backgroundImage: `linear-gradient(to top, ${s.overlay} 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%), url('${s.bg}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            >
              {/* Trust pill */}
              <div className="absolute top-6 right-6 hidden md:flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-400" />
                <span className="text-xs font-semibold text-white">Vendedores verificados</span>
              </div>

              <span className="mb-3 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {s.badge}
              </span>
              <h1 className="font-display max-w-xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
                {s.title}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{s.desc}</p>
              <Link
                to={s.ctaTo}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-agrobot-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-agrobot-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating search bar */}
      <div className="relative -mt-8 z-10 mx-auto max-w-3xl px-4">
        <div
          className="flex items-center overflow-hidden rounded-2xl bg-white shadow-xl"
          style={{ border: '1.5px solid #D1FAE5' }}
        >
          <div className="flex flex-1 items-center gap-2 px-5">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="¿Qué producto, insumo o maquinaria buscás?"
              className="flex-1 bg-transparent py-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />
          <div className="hidden items-center gap-2 px-5 sm:flex">
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="¿Dónde?"
              className="w-28 bg-transparent py-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="p-2">
            <button
              onClick={handleSearch}
              className="rounded-xl bg-agrobot-700 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="mt-6 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-agrobot-50">
                <Icon className="h-5 w-5 text-agrobot-700" />
              </div>
              <div>
                <p className="font-display text-xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoriesSection() {
  const { data: categories, isLoading } = useCategoriesQuery()

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-1">Explorar</p>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
              Categorías del Mercado
            </h2>
          </div>
          <Link to="/categorias" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-agrobot-700 hover:text-agrobot-900 transition-colors">
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(categories ?? []).map(({ id, name, imageUrl }, i) => {
              const Icon = getCategoryIcon(name)
              const gradient = getCategoryGradient(name)
              return (
                <Link
                  key={id}
                  to={`/catalogo?categoryId=${id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ height: 140 }}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}>
                      <Icon className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <p className="font-display text-sm font-bold text-white leading-snug drop-shadow">{name}</p>
                    <ArrowRight className="h-4 w-4 text-white/70 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedListingCard({ listing }: { listing: FeaturedListing }) {
  const gradient = getCategoryGradient(listing.categoryName)
  const Icon = getCategoryIcon(listing.categoryName ?? '')

  return (
    <Link
      to={`/anuncios/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-agrobot-100"
    >
      <div className={`relative flex aspect-4/3 items-center justify-center bg-linear-to-br ${gradient} overflow-hidden`}>
        <Icon className="h-16 w-16 text-white/20" />
        {listing.categoryName && (
          <span className="absolute left-3 top-3 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {listing.categoryName}
          </span>
        )}
        {listing.price && (
          <span className="absolute bottom-3 right-3 rounded-xl bg-black/40 backdrop-blur-sm px-2.5 py-1 text-sm font-extrabold text-white">
            ${listing.price}
            {listing.priceUnit && <span className="text-[10px] font-normal ml-1 opacity-80">/{listing.priceUnit}</span>}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">{listing.title}</p>
        <div className="mt-3 flex items-center justify-between">
          {listing.department ? (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {listing.department}
            </div>
          ) : <span />}
          <span className="text-xs font-semibold text-agrobot-700 group-hover:underline">Ver →</span>
        </div>
      </div>
    </Link>
  )
}

function FeaturedProductsSection() {
  const { data: listings, isLoading } = useFeaturedListingsQuery()

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-1">Destacados</p>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
              Anuncios del Momento
            </h2>
          </div>
          <Link to="/catalogo?sort=featured" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-agrobot-700 hover:text-agrobot-900 transition-colors">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
                <div className="aspect-4/3 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(listings ?? []).slice(0, 8).map((l) => (
              <FeaturedListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const BANNER_GRADIENTS = [
  'bg-linear-to-br from-agrobot-800 to-agrobot-600',
  'bg-linear-to-br from-orange-700 to-amber-500',
  'bg-linear-to-br from-sky-700 to-cyan-500',
  'bg-linear-to-br from-violet-700 to-purple-500',
]

function StoreCard({ store, i }: { store: StoreListItem; i: number }) {
  return (
    <Link to={`/tiendas/${store.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-agrobot-100">
      {/* Banner */}
      <div className="relative h-20 w-full overflow-hidden">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className={`h-full w-full ${BANNER_GRADIENTS[i % BANNER_GRADIENTS.length]}`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          </div>
        )}
      </div>
      {/* Logo + info */}
      <div className="px-4 pb-4 -mt-6 flex flex-col flex-1">
        <div className="flex items-end justify-between mb-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-md" />
          ) : (
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white text-sm font-bold text-white shadow-md ${BANNER_GRADIENTS[i % BANNER_GRADIENTS.length]}`}>
              {getInitials(store.name)}
            </div>
          )}
          {store.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-agrobot-50 px-2 py-0.5 text-[10px] font-bold text-agrobot-700">
              <CheckCircle2 className="h-3 w-3" /> Verificado
            </span>
          )}
        </div>
        <p className="font-display text-sm font-bold text-gray-900 truncate">{store.name}</p>
        {store.department && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            {[store.municipality, store.department].filter(Boolean).join(', ')}
          </div>
        )}
        {store.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 flex-1">{store.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {store.roleType && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 uppercase">
              {store.roleType.replace('_', ' ')}
            </span>
          )}
          <span className="text-xs font-semibold text-agrobot-700 group-hover:underline ml-auto">Ver →</span>
        </div>
      </div>
    </Link>
  )
}

function FeaturedStoresSection() {
  const { data: stores, isLoading } = useFeaturedStoresQuery()

  if (!isLoading && (!stores || stores.length === 0)) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-1">Vendedores</p>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
              Tiendas Destacadas
            </h2>
          </div>
          <Link to="/catalogo" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-agrobot-700 hover:text-agrobot-900 transition-colors">
            Ver todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-20 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {(stores ?? []).map((store, i) => (
              <StoreCard key={store.id} store={store} i={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-2">Simple y rápido</p>
          <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
            ¿Cómo funciona TierraMarket?
          </h2>
          <p className="mt-3 mx-auto max-w-md text-sm text-gray-500 leading-relaxed">
            En tres pasos conectás con el productor o proveedor que necesitás, sin intermediarios ni burocracia.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute top-8 left-1/6 right-1/6 hidden h-px bg-linear-to-r from-transparent via-agrobot-200 to-transparent md:block" />

          {STEPS.map(({ n, Icon, title, desc }) => (
            <div key={n} className="flex flex-col items-center text-center relative">
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-agrobot-700 shadow-lg">
                <Icon className="h-7 w-7 text-white" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-agrobot-200 text-[10px] font-black text-agrobot-800 shadow-sm">
                  {n}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-2">Testimonios</p>
          <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
            Lo que dice la comunidad
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, text, avatar, rating, color }) => (
            <div key={name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
              <Quote className="h-6 w-6 text-agrobot-200" />
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{text}"</p>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-[11px] text-gray-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PopularZonesSection() {
  const [activeState, setActiveState] = useState<string | null>(null)

  const filtered = activeState ? venezuelaZones.filter((z) => z.state === activeState) : venezuelaZones
  const flyTarget = activeState
    ? { lat: filtered[0].lat, lng: filtered[0].lng, zoom: 8 }
    : { lat: 8.5, lng: -66.5, zoom: 6 }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-agrobot-600 mb-1">Territorio</p>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
              Zonas Agrícolas · Venezuela
            </h2>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {venezuelaZones.length} zonas registradas
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveState(null)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              activeState === null ? 'border-agrobot-500 bg-agrobot-700 text-white' : 'border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
            }`}
          >
            Todas
          </button>
          {vzStates.map((s) => (
            <button
              key={s}
              onClick={() => setActiveState(s)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                activeState === s ? 'border-agrobot-500 bg-agrobot-700 text-white' : 'border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
              }`}
            >
              <MapPin className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-card" style={{ height: 420 }}>
          <MapContainer center={[8.5, -66.5]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((z) => (
              <Marker key={z.name} position={[z.lat, z.lng]} icon={vzIcon}>
                <Popup>
                  <div style={{ minWidth: 170 }}>
                    <p style={{ fontWeight: 700, color: '#14532d', fontSize: 13, marginBottom: 3 }}>{z.name}</p>
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

function RadarCtaSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-agrobot-800 via-agrobot-900 to-[#021f11] px-8 py-14 md:px-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-agrobot-700/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-agrobot-600/20 blur-3xl" />
          </div>
          <Bell className="absolute right-10 top-1/2 h-64 w-64 -translate-y-1/2 text-white opacity-5" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-lg">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-agrobot-600 bg-agrobot-700/40 px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 text-agrobot-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-agrobot-200">Nuevo Servicio</span>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl leading-tight">
                Radar Agrícola:<br />
                <span className="text-agrobot-300">No te pierdas nada</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-agrobot-200 max-w-sm">
                ¿No encontrás lo que buscás? Activá alertas personalizadas por zona y categoría. Te avisamos en el momento en que alguien publique lo que necesitás.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                to="/radar"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-agrobot-900 shadow-lg transition-all hover:bg-agrobot-50 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Bell className="h-4 w-4" />
                Activar Radar Ahora
              </Link>
              <p className="text-center text-[11px] text-agrobot-400">
                Gratis · Sin tarjeta · Cancelá cuando quieras
              </p>
            </div>
          </div>
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
      <StatsSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FeaturedStoresSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PopularZonesSection />
      <RadarCtaSection />
    </div>
  )
}

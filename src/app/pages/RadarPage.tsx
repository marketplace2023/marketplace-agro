import { useState } from 'react'
import { Search, MapPin, Star, Heart, SlidersHorizontal, Store, Users, FlaskConical, BadgeCheck, MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Layers, X, ClipboardCheck, Briefcase } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeType = 'VERIFICADO' | 'PARTNER' | null
type FilterType = 'Todos' | 'Tiendas' | 'Productores' | 'Laboratorios' | 'Certificadores' | 'Inspectores' | 'Exportadores'
type ActionType = 'whatsapp' | 'cotizar'

interface Company {
  id: number
  name: string
  badge: BadgeType
  rating: number
  reviews: number
  description: string
  tags: string[]
  location: string
  distance: string
  action: ActionType
  image: string
  lat: number
  lng: number
}

// ─── Data ────────────────────────────────────────────────────────────────────

const filters: { label: FilterType; Icon: React.ElementType }[] = [
  { label: 'Todos',          Icon: Store },
  { label: 'Tiendas',        Icon: Store },
  { label: 'Productores',    Icon: Users },
  { label: 'Laboratorios',   Icon: FlaskConical },
  { label: 'Certificadores', Icon: BadgeCheck },
  { label: 'Inspectores',    Icon: ClipboardCheck },
  { label: 'Exportadores',   Icon: Briefcase },
]

const companies: Company[] = [
  {
    id: 1,
    name: 'AgroTec Insumos Integrales',
    badge: 'VERIFICADO',
    rating: 4.8,
    reviews: 86,
    description: 'Líderes en distribución de semillas certificadas y tecnología de precisión para el campo. 15 años de trayectoria en el sector.',
    tags: ['Semillas', 'Riego Tech', 'Bio-Insumos'],
    location: 'Acarigua, Portuguesa',
    distance: '12.4 km',
    action: 'whatsapp',
    image: '/farm-bg.png',
    lat: 9.5545,
    lng: -69.1956,
  },
  {
    id: 2,
    name: 'BioLab Certificaciones',
    badge: 'PARTNER',
    rating: 5.0,
    reviews: 42,
    description: 'Análisis de suelos, aguas y certificación de huella de carbono para exportación directa. Rapidez y validez internacional.',
    tags: ['Exportación', 'Carbono', 'Suelos'],
    location: 'Barinas, Barinas',
    distance: '45 km',
    action: 'cotizar',
    image: '/bg-cafe.png',
    lat: 8.6226,
    lng: -70.2075,
  },
  {
    id: 3,
    name: 'Establecimiento Don Julio',
    badge: null,
    rating: 4.2,
    reviews: 15,
    description: 'Productores directos de hortalizas orgánicas. Venta mayorista y minorista con despacho inmediato.',
    tags: ['Orgánico', 'Venta Directa'],
    location: 'Quíbor, Lara',
    distance: '22 km',
    action: 'whatsapp',
    image: '/farm-bg.png',
    lat: 9.9276,
    lng: -69.6201,
  },
  {
    id: 4,
    name: 'Syngenta Venezuela',
    badge: 'VERIFICADO',
    rating: 4.6,
    reviews: 130,
    description: 'Distribución de agroquímicos, semillas híbridas y servicios de asesoría técnica a nivel nacional.',
    tags: ['Agroquímicos', 'Semillas', 'Asesoría'],
    location: 'Valencia, Carabobo',
    distance: '67 km',
    action: 'cotizar',
    image: '/bg-cafe.png',
    lat: 10.1620,
    lng: -67.9953,
  },
  {
    id: 5,
    name: 'Finca El Maizal',
    badge: null,
    rating: 4.4,
    reviews: 28,
    description: 'Producción de maíz blanco y amarillo con tecnología de riego por goteo. Entregas directas al consumidor.',
    tags: ['Maíz', 'Riego Goteo', 'Mayorista'],
    location: 'Turén, Portuguesa',
    distance: '8 km',
    action: 'whatsapp',
    image: '/farm-bg.png',
    lat: 9.3310,
    lng: -69.1149,
  },
]

// ─── Custom numbered marker ───────────────────────────────────────────────────

function numberedIcon(n: number) {
  return new L.DivIcon({
    className: '',
    html: `<div style="width:30px;height:30px;background:#15803d;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const badgeStyles: Record<NonNullable<BadgeType>, string> = {
  VERIFICADO: 'bg-agrobot-100 text-agrobot-800',
  PARTNER:    'bg-orange-100 text-orange-700',
}

const especialidades = ['Semillas', 'Fertilizantes', 'Riego Tech', 'Agroquímicos', 'Bio-Insumos', 'Exportación', 'Carbono', 'Suelos', 'Orgánico', 'Ganadería', 'Maquinaria', 'Asesoría']

interface FiltrosPanelProps {
  open: boolean
  onClose: () => void
}

function FiltrosPanel({ open, onClose }: FiltrosPanelProps) {
  const [rating, setRating] = useState(0)
  const [distancia, setDistancia] = useState(100)
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const handleReset = () => {
    setRating(0)
    setDistancia(100)
    setSoloVerificados(false)
    setSelectedTags([])
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-agrobot-700" />
            <h2 className="font-display text-base font-bold text-gray-900">Filtros avanzados</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Rating mínimo */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Rating mínimo</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setRating(v)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${
                    rating === v
                      ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800'
                      : 'border-gray-200 text-gray-600 hover:border-agrobot-300'
                  }`}
                >
                  {v === 0 ? 'Todos' : (
                    <span className="flex items-center justify-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v}+
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Distancia */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Distancia máxima</h3>
              <span className="text-sm font-bold text-agrobot-700">{distancia} km</span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={distancia}
              onChange={(e) => setDistancia(Number(e.target.value))}
              className="w-full accent-agrobot-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>5 km</span>
              <span>500 km</span>
            </div>
          </div>

          {/* Solo verificados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Confiabilidad</h3>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-agrobot-300 transition-colors">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-agrobot-600" />
                <span className="text-sm font-medium text-gray-700">Solo empresas verificadas</span>
              </div>
              <div
                onClick={() => setSoloVerificados(v => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${soloVerificados ? 'bg-agrobot-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloVerificados ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>

          {/* Tipo de empresa */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Tipo de empresa</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Tiendas', 'Productores', 'Laboratorios', 'Certificadores', 'Inspectores', 'Exportadores'].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 cursor-pointer hover:border-agrobot-300 transition-colors">
                  <input type="checkbox" className="accent-agrobot-600 h-3.5 w-3.5" />
                  <span className="text-xs font-medium text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-agrobot-700 text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-agrobot-700 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  )
}

function CompanyCard({ company, index }: { company: Company; index: number }) {
  const [wished, setWished] = useState(false)

  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Index number */}
      <div className="hidden sm:flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-agrobot-700 text-xs font-bold text-white">
        {index + 1}
      </div>

      {/* Image */}
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg">
        <img src={company.image} alt={company.name} className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{company.name}</h3>
              {company.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStyles[company.badge]}`}>
                  {company.badge}
                </span>
              )}
            </div>
            <button onClick={() => setWished(v => !v)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(company.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-xs font-semibold text-gray-700 ml-1">{company.rating}</span>
            <span className="text-xs text-gray-400">({company.reviews} reseñas)</span>
          </div>

          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">{company.description}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {company.tags.map(tag => (
              <span key={tag} className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{company.location}</span>
            <span className="text-gray-300">·</span>
            <span>{company.distance}</span>
          </div>
          <div className="flex gap-2">
            {company.action === 'whatsapp' ? (
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                <MessageCircle className="h-3.5 w-3.5" />WhatsApp
              </button>
            ) : (
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
                Cotizar
              </button>
            )}
            <button className="flex items-center gap-1.5 rounded-lg bg-agrobot-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800">
              <ExternalLink className="h-3.5 w-3.5" />Visitar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pagination({ current, total }: { current: number; total: number }) {
  const pages = [1, 2, 3, '...', total]
  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => (
        <button
          key={i}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            p === current
              ? 'bg-agrobot-700 text-white'
              : p === '...'
              ? 'text-gray-400 cursor-default'
              : 'border border-gray-200 text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700'
          }`}
        >
          {p}
        </button>
      ))}
      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function RadarPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Portuguesa, Venezuela')
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos')
  const [satellite, setSatellite] = useState(false)
  const [filtrosOpen, setFiltrosOpen] = useState(false)

  const tileUrl = satellite
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const tileAttr = satellite
    ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <FiltrosPanel open={filtrosOpen} onClose={() => setFiltrosOpen(false)} />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué buscas? (Tienda, productor, certificador...)"
                className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-4">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ubicación"
                className="w-44 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="flex h-full items-center gap-2 bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {filters.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeFilter === label
                    ? 'bg-agrobot-700 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
            <button
              onClick={() => setFiltrosOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700 transition-all ml-auto"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Más Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Results + Map */}
      <div className="mx-auto w-full max-w-6xl px-4 py-5 flex gap-5 items-start">

        {/* Left: results */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              Resultados en {location.split(',')[0]} <span className="text-gray-400 font-normal">({companies.length * 24} empresas)</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              Ordenar por:
              <button className="font-semibold text-agrobot-700">Relevancia ▾</button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {companies.map((company, i) => (
              <CompanyCard key={company.id} company={company} index={i} />
            ))}
          </div>

          <Pagination current={1} total={12} />
        </div>

        {/* Right: map */}
        <div className="hidden lg:block w-95 shrink-0 sticky top-20">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: 580 }}>
            <MapContainer
              center={[9.2, -69.4]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={true}
            >
              <TileLayer attribution={tileAttr} url={tileUrl} />
              {companies.map((c, i) => (
                <Marker key={c.id} position={[c.lat, c.lng]} icon={numberedIcon(i + 1)}>
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      <p style={{ fontWeight: 700, color: '#14532d', marginBottom: 2, fontSize: 13 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>{c.location} · {c.distance}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Satellite toggle */}
            <button
              onClick={() => setSatellite(v => !v)}
              className={`absolute top-3 left-3 z-999 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow transition-colors ${
                satellite ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Capa Satelital
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

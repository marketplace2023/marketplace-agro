import { useState } from 'react'
import { Search, MapPin, Star, Heart, SlidersHorizontal, Wheat, TreePine, Package, Wrench, Briefcase, FlaskConical, BadgeCheck, ClipboardCheck, ChevronLeft, ChevronRight, Layers, X, ShoppingCart } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryFilter = 'Todos' | 'Cosechas' | 'Fincas' | 'Insumos' | 'Maquinaria' | 'Servicios' | 'Laboratorios' | 'Certificadores' | 'Inspectores'

interface Product {
  id: number
  name: string
  category: CategoryFilter
  price: string
  unit: string
  originalPrice?: string
  rating: number
  reviews: number
  description: string
  tags: string[]
  location: string
  distance: string
  verified: boolean
  image: string
  lat: number
  lng: number
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categoryFilters: { label: CategoryFilter; Icon: React.ElementType }[] = [
  { label: 'Todos',         Icon: ShoppingCart },
  { label: 'Cosechas',      Icon: Wheat },
  { label: 'Fincas',        Icon: TreePine },
  { label: 'Insumos',       Icon: Package },
  { label: 'Maquinaria',    Icon: Wrench },
  { label: 'Servicios',     Icon: Briefcase },
  { label: 'Laboratorios',  Icon: FlaskConical },
  { label: 'Certificadores',Icon: BadgeCheck },
  { label: 'Inspectores',   Icon: ClipboardCheck },
]

const products: Product[] = [
  {
    id: 1,
    name: 'Maíz Blanco Híbrido DK-7088',
    category: 'Cosechas',
    price: '$320',
    unit: '/ Ton',
    originalPrice: '$380',
    rating: 4.9,
    reviews: 120,
    description: 'Maíz blanco híbrido de alta calidad, cosecha 2026. Disponible en volumen para distribuidores y procesadoras. Certificado fitosanitario incluido.',
    tags: ['Maíz Blanco', 'Certificado', 'Mayorista'],
    location: 'Turén, Portuguesa',
    distance: '14 km',
    verified: true,
    image: '/farm-bg.png',
    lat: 9.3310,
    lng: -69.1149,
  },
  {
    id: 2,
    name: 'Urea Granulada 46% Nitrógeno',
    category: 'Insumos',
    price: '$699',
    unit: '/ Ton',
    originalPrice: '$850',
    rating: 4.5,
    reviews: 45,
    description: 'Fertilizante nitrogenado de alta concentración. Ideal para cereales, caña y pastos. Disponible por tonelada con despacho a nivel nacional.',
    tags: ['Fertilizante', 'Urea', 'Cereales'],
    location: 'Acarigua, Portuguesa',
    distance: '8 km',
    verified: false,
    image: '/bg-cafe.png',
    lat: 9.5545,
    lng: -69.1956,
  },
  {
    id: 3,
    name: 'Tractor John Deere 5075E 4WD',
    category: 'Maquinaria',
    price: '$36,000',
    unit: '',
    originalPrice: '$45,000',
    rating: 4.8,
    reviews: 12,
    description: 'Tractor seminuevo con 1,200 horas de uso. Cabina climatizada, dirección hidrostática, lista para trabajo inmediato.',
    tags: ['John Deere', 'Seminuevo', 'Financiamiento'],
    location: 'Barinas, Barinas',
    distance: '52 km',
    verified: true,
    image: '/farm-bg.png',
    lat: 8.6226,
    lng: -70.2075,
  },
  {
    id: 4,
    name: 'Análisis de Suelos NPK Completo',
    category: 'Laboratorios',
    price: '$85',
    unit: '/ Muestra',
    rating: 4.7,
    reviews: 38,
    description: 'Análisis fisicoquímico completo: nitrógeno, fósforo, potasio, pH, conductividad eléctrica y materia orgánica. Resultados en 72 hs.',
    tags: ['Análisis', 'NPK', 'pH', '72hs'],
    location: 'Quíbor, Lara',
    distance: '31 km',
    verified: true,
    image: '/bg-cafe.png',
    lat: 9.9276,
    lng: -69.6201,
  },
  {
    id: 5,
    name: 'Semillas de Cacao Criollo Certificadas',
    category: 'Cosechas',
    price: '$210',
    unit: '/ Bolsa 50kg',
    rating: 5.0,
    reviews: 22,
    description: 'Semillas certificadas de cacao criollo de Barlovento. Variedad premium de exportación con trazabilidad completa y análisis de germinación.',
    tags: ['Cacao', 'Criollo', 'Exportación'],
    location: 'Caucagua, Miranda',
    distance: '18 km',
    verified: true,
    image: '/farm-bg.png',
    lat: 10.2822,
    lng: -66.3797,
  },
  {
    id: 6,
    name: 'Herbicida Glifosato 48% SL',
    category: 'Insumos',
    price: '$48',
    unit: '/ Litro',
    rating: 4.3,
    reviews: 67,
    description: 'Control de malezas de hoja ancha y gramíneas. Presentación 1L, 5L y 20L. Registro SASA vigente.',
    tags: ['Herbicida', 'Glifosato', 'Registro SASA'],
    location: 'San Carlos, Cojedes',
    distance: '44 km',
    verified: false,
    image: '/bg-cafe.png',
    lat: 9.6612,
    lng: -68.5827,
  },
]

// ─── Custom marker ────────────────────────────────────────────────────────────

function numberedIcon(n: number) {
  return new L.DivIcon({
    className: '',
    html: `<div style="width:30px;height:30px;background:#15803d;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// ─── Filtros panel ────────────────────────────────────────────────────────────

function FiltrosPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = ['Certificado', 'Mayorista', 'Exportación', 'Financiamiento', 'Orgánico', 'Análisis', 'Seminuevo', 'Registro SASA', 'Despacho Nacional']

  const toggleTag = (t: string) =>
    setSelectedTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-agrobot-700" />
            <h2 className="font-display text-base font-bold text-gray-900">Filtros avanzados</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Rating */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Rating mínimo</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map(v => (
                <button key={v} onClick={() => setMinRating(v)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${minRating === v ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800' : 'border-gray-200 text-gray-600 hover:border-agrobot-300'}`}
                >
                  {v === 0 ? 'Todos' : <span className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v}+</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Precio máximo</h3>
              <span className="text-sm font-bold text-agrobot-700">${maxPrice.toLocaleString()}</span>
            </div>
            <input type="range" min={50} max={100000} step={50} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-agrobot-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>$50</span><span>$100,000</span></div>
          </div>

          {/* Solo verificados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Confiabilidad</h3>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-agrobot-300 transition-colors">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-agrobot-600" />
                <span className="text-sm font-medium text-gray-700">Solo productos verificados</span>
              </div>
              <div onClick={() => setSoloVerificados(v => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${soloVerificados ? 'bg-agrobot-600' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloVerificados ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>

          {/* Disponibilidad */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Disponibilidad</h3>
            <div className="grid grid-cols-2 gap-2">
              {['En stock', 'Preventa', 'Bajo pedido', 'Entrega inmediata'].map(d => (
                <label key={d} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 cursor-pointer hover:border-agrobot-300 transition-colors">
                  <input type="checkbox" className="accent-agrobot-600 h-3.5 w-3.5" />
                  <span className="text-xs font-medium text-gray-700">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Características</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedTags.includes(tag) ? 'bg-agrobot-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button onClick={() => { setMinRating(0); setMaxPrice(50000); setSoloVerificados(false); setSelectedTags([]) }}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Limpiar
          </button>
          <button onClick={onClose} className="flex-1 rounded-xl bg-agrobot-700 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [wished, setWished] = useState(false)

  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="hidden sm:flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-agrobot-700 text-xs font-bold text-white">
        {index + 1}
      </div>

      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
              {product.verified && (
                <span className="rounded-full bg-agrobot-100 px-2 py-0.5 text-[10px] font-bold text-agrobot-800">VERIFICADO</span>
              )}
            </div>
            <button onClick={() => setWished(v => !v)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-xs font-semibold text-gray-700 ml-1">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews} reseñas)</span>
          </div>

          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.tags.map(tag => (
              <span key={tag} className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">{product.originalPrice}{product.unit}</p>
            )}
            <p className="text-base font-bold text-gray-900">
              {product.price}
              {product.unit && <span className="text-xs font-normal text-gray-500 ml-1">{product.unit}</span>}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {product.location} · {product.distance}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              Cotizar
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-agrobot-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800">
              <ShoppingCart className="h-3.5 w-3.5" />Ver oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CatalogoPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Venezuela')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos')
  const [satellite, setSatellite] = useState(false)
  const [filtrosOpen, setFiltrosOpen] = useState(false)

  const filtered = activeCategory === 'Todos' ? products : products.filter(p => p.category === activeCategory)

  const tileUrl = satellite
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const tileAttr = satellite
    ? '&copy; Esri &mdash; Source: Esri'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <FiltrosPanel open={filtrosOpen} onClose={() => setFiltrosOpen(false)} />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="¿Qué producto buscas? (semillas, tractores, fertilizantes...)"
                className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-4">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Ubicación"
                className="w-40 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="flex items-center bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Category pills */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {categoryFilters.map(({ label, Icon }) => (
              <button key={label} onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === label
                    ? 'bg-agrobot-700 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />{label}
              </button>
            ))}
            <button onClick={() => setFiltrosOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700 transition-all ml-auto"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />Más Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Results + Map */}
      <div className="mx-auto w-full max-w-6xl px-4 py-5 flex gap-5 items-start">

        {/* Left: product list */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              {activeCategory === 'Todos' ? 'Todos los productos' : activeCategory}
              <span className="text-gray-400 font-normal ml-1">({filtered.length * 18} resultados)</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              Ordenar por:
              <button className="font-semibold text-agrobot-700">Relevancia ▾</button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 py-6">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, '...', 18].map((p, i) => (
              <button key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === 1 ? 'bg-agrobot-700 text-white' : p === '...' ? 'text-gray-400 cursor-default' : 'border border-gray-200 text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700'}`}
              >{p}</button>
            ))}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: map */}
        <div className="hidden lg:block w-95 shrink-0 sticky top-20">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: 580 }}>
            <MapContainer center={[9.2, -69.4]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer attribution={tileAttr} url={tileUrl} />
              {filtered.map((p, i) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={numberedIcon(i + 1)}>
                  <Popup>
                    <div style={{ minWidth: 170 }}>
                      <p style={{ fontWeight: 700, color: '#14532d', marginBottom: 2, fontSize: 13 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{p.category} · {p.location}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{p.price} <span style={{ fontSize: 10, fontWeight: 400, color: '#94a3b8' }}>{p.unit}</span></p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <button onClick={() => setSatellite(v => !v)}
              className={`absolute top-3 left-3 z-999 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow transition-colors ${satellite ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              <Layers className="h-3.5 w-3.5" />Capa Satelital
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

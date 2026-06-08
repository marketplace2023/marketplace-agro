import { useState, useEffect, useCallback } from 'react'
import {
  Search, MapPin, Star, Heart, SlidersHorizontal, Store, Users, FlaskConical,
  BadgeCheck, MessageCircle, ExternalLink, ChevronLeft, ChevronRight,
  Layers, X, ClipboardCheck, Briefcase, Building2,
} from 'lucide-react'
import { Map as GoogleMap, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { Link } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { axiosInstance } from '@/modules/shared/lib/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'Todos' | 'Tiendas' | 'Productores' | 'Laboratorios' | 'Certificadores' | 'Inspectores'

interface StoreResult {
  id: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  roleType: string
  department: string | null
  municipality: string | null
  isVerified: boolean
  specialties: string | null
  lat: string | null
  lng: string | null
  avgRating: string | null
  reviewCount: number
}

interface StoresResponse {
  stores: StoreResult[]
  total: number
  page: number
  limit: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 10

const FILTER_TO_ROLE: Record<FilterType, string | undefined> = {
  'Todos':          undefined,
  'Tiendas':        'seller',
  'Productores':    'producer',
  'Laboratorios':   'laboratory',
  'Certificadores': 'certifier',
  'Inspectores':    'quality_inspector',
}

const filters: { label: FilterType; Icon: React.ElementType }[] = [
  { label: 'Todos',          Icon: Store },
  { label: 'Tiendas',        Icon: Store },
  { label: 'Productores',    Icon: Users },
  { label: 'Laboratorios',   Icon: FlaskConical },
  { label: 'Certificadores', Icon: BadgeCheck },
  { label: 'Inspectores',    Icon: ClipboardCheck },
]

const ROLE_LABELS: Record<string, string> = {
  seller:            'Vendedor',
  producer:          'Productor',
  farm_owner:        'Dueño de Finca',
  input_supplier:    'Proveedor',
  machinery_supplier:'Maquinaria',
  agronomist:        'Agrónomo',
  transporter:       'Transportista',
  cooperative:       'Cooperativa',
  laboratory:        'Laboratorio',
  certifier:         'Certificador',
  quality_inspector: 'Inspector',
}

const especialidades = ['Semillas', 'Fertilizantes', 'Riego Tech', 'Agroquímicos', 'Bio-Insumos', 'Exportación', 'Carbono', 'Suelos', 'Orgánico', 'Ganadería', 'Maquinaria', 'Asesoría']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < Math.floor(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FiltrosPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [distancia, setDistancia] = useState(100)
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-agrobot-700" />
            <h2 className="font-display text-base font-bold text-gray-900">Filtros avanzados</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Rating mínimo</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map((v) => (
                <button key={v} onClick={() => setRating(v)} className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${rating === v ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800' : 'border-gray-200 text-gray-600 hover:border-agrobot-300'}`}>
                  {v === 0 ? 'Todos' : <span className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v}+</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Distancia máxima</h3>
              <span className="text-sm font-bold text-agrobot-700">{distancia} km</span>
            </div>
            <input type="range" min={5} max={500} step={5} value={distancia} onChange={(e) => setDistancia(Number(e.target.value))} className="w-full accent-agrobot-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>5 km</span><span>500 km</span></div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Confiabilidad</h3>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-agrobot-300 transition-colors">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-agrobot-600" />
                <span className="text-sm font-medium text-gray-700">Solo empresas verificadas</span>
              </div>
              <div onClick={() => setSoloVerificados(v => !v)} className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${soloVerificados ? 'bg-agrobot-600' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloVerificados ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedTags.includes(tag) ? 'bg-agrobot-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button onClick={() => { setRating(0); setDistancia(100); setSoloVerificados(false); setSelectedTags([]) }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Limpiar filtros
          </button>
          <button onClick={onClose} className="flex-1 rounded-xl bg-agrobot-700 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800">
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  )
}

function StoreCard({ store, index }: { store: StoreResult; index: number }) {
  const [wished, setWished] = useState(false)
  const rating = store.avgRating ? parseFloat(store.avgRating) : 0
  const tags = store.specialties
    ? store.specialties.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)
    : []
  const roleLabel = ROLE_LABELS[store.roleType] ?? store.roleType

  const profilePath = store.roleType === 'producer'
    ? `/productores/${store.slug}`
    : store.roleType === 'laboratory'
    ? `/laboratorios/${store.slug}`
    : store.roleType === 'certifier'
    ? `/certificadores/${store.slug}`
    : store.roleType === 'quality_inspector'
    ? `/inspectores/${store.slug}`
    : `/tiendas/${store.slug}`

  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="hidden sm:flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-agrobot-700 text-xs font-bold text-white">
        {index + 1}
      </div>

      {/* Logo / avatar */}
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        {store.logoUrl ? (
          <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
        ) : (
          <Building2 className="h-10 w-10 text-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{store.name}</h3>
              {store.isVerified && (
                <span className="rounded-full bg-agrobot-100 px-2 py-0.5 text-[10px] font-bold text-agrobot-800">VERIFICADO</span>
              )}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{roleLabel}</span>
            </div>
            <button onClick={() => setWished(v => !v)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
          </div>

          {store.reviewCount > 0 ? (
            <div className="mt-1 flex items-center gap-1.5">
              <StarRating value={rating} />
              <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({store.reviewCount} reseñas)</span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Sin reseñas aún</p>
          )}

          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {store.description ?? 'Sin descripción disponible.'}
          </p>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{[store.municipality, store.department].filter(Boolean).join(', ') || 'Ubicación no disponible'}</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              <MessageCircle className="h-3.5 w-3.5" />Contactar
            </button>
            <Link to={profilePath} className="flex items-center gap-1.5 rounded-lg bg-agrobot-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800">
              <ExternalLink className="h-3.5 w-3.5" />Visitar Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoreCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <Skeleton className="hidden sm:block h-7 w-7 rounded-full shrink-0" />
      <Skeleton className="h-28 w-28 shrink-0 rounded-lg" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

// ─── Geocoding fallback ───────────────────────────────────────────────────────

const geocodeCache = new Map<string, { lat: string; lng: string } | null>()

async function geocodeMissingStores(stores: StoreResult[]): Promise<StoreResult[]> {
  const missing = stores.filter(s => !s.lat && !s.lng && (s.municipality || s.department))
  if (missing.length === 0) return stores

  const uniqueKeys = new Set(missing.map(s => `${s.municipality ?? ''},${s.department ?? ''},Venezuela`))

  for (const key of uniqueKeys) {
    if (geocodeCache.has(key)) continue
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(key)}&format=json&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
      const data = await res.json() as Array<{ lat: string; lon: string }>
      geocodeCache.set(key, data[0] ? { lat: data[0].lat, lng: data[0].lon } : null)
    } catch {
      geocodeCache.set(key, null)
    }
  }

  return stores.map(s => {
    if (s.lat && s.lng) return s
    const key = `${s.municipality ?? ''},${s.department ?? ''},Venezuela`
    const coords = geocodeCache.get(key)
    if (!coords) return s
    return { ...s, lat: coords.lat, lng: coords.lng }
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function RadarPage() {
  const [query,        setQuery]        = useState('')
  const [location,     setLocation]     = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos')
  const [satellite,    setSatellite]    = useState(false)
  const [filtrosOpen,  setFiltrosOpen]  = useState(false)
  const [page,         setPage]         = useState(1)

  const [stores,   setStores]   = useState<StoreResult[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [openMarkerId, setOpenMarkerId] = useState<number | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const fetchStores = useCallback(async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string> = { page: String(p), limit: String(LIMIT) }
      if (query.trim())    params.search     = query.trim()
      if (location.trim()) params.department = location.trim()
      const roleType = FILTER_TO_ROLE[activeFilter]
      if (roleType)        params.roleType   = roleType

      const res = await axiosInstance.get<StoresResponse>('/stores', { params })
      const storesWithCoords = await geocodeMissingStores(res.data.stores)
      setStores(storesWithCoords)
      setTotal(res.data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar empresas')
    } finally {
      setLoading(false)
    }
  }, [query, location, activeFilter])

  useEffect(() => {
    setPage(1)
    fetchStores(1)
  }, [activeFilter])

  useEffect(() => {
    fetchStores(page)
  }, [page])

  function handleSearch() {
    setPage(1)
    fetchStores(1)
  }

  const mappableStores = stores.filter(s => s.lat && s.lng)

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <FiltrosPanel open={filtrosOpen} onClose={() => setFiltrosOpen(false)} />

      {/* Hero strip */}
      <div className="relative overflow-hidden bg-linear-to-r from-agrobot-900 to-agrobot-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #4ade80 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-7 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-agrobot-300">Directorio Agrícola</p>
            <h1 className="font-display mt-1 text-2xl font-extrabold text-white">Radar Agrícola</h1>
            <p className="mt-1 text-sm text-agrobot-200 max-w-md">Descubre productores, tiendas, laboratorios y certificadores agrícolas en todo Venezuela.</p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Empresas', value: '1,200+' },
              { label: 'Estados', value: '23' },
              { label: 'Verificadas', value: '98%' },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-6">
                {i > 0 && <div className="h-8 w-px bg-white/20" />}
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-[11px] text-agrobot-300">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Estado (ej: Portuguesa)"
                className="w-44 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex h-full items-center gap-2 bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

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
              {location ? `Resultados en ${location}` : 'Todas las empresas'}{' '}
              {!loading && <span className="text-gray-400 font-normal">({total} empresas)</span>}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              Ordenar por:
              <button className="font-semibold text-agrobot-700">Relevancia ▾</button>
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <StoreCardSkeleton key={i} />)
              : stores.length === 0
              ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16">
                  <Briefcase className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-500">Sin empresas registradas</p>
                  <p className="text-xs text-gray-400 mt-1">Prueba cambiando el filtro o la ubicación</p>
                </div>
              )
              : stores.map((store, i) => (
                <StoreCard key={store.id} store={store} index={(page - 1) * LIMIT + i} />
              ))
            }
          </div>

          {/* Pagination */}
          {!loading && total > LIMIT && (
            <div className="flex items-center justify-center gap-1.5 py-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-agrobot-700 text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-agrobot-400 hover:text-agrobot-700 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: map */}
        <div className="hidden lg:block w-95 shrink-0 sticky top-20">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: 580 }}>
            <GoogleMap
              defaultCenter={{ lat: 8.0, lng: -66.5 }}
              defaultZoom={6}
              mapId="DEMO_MAP_ID"
              mapTypeId={satellite ? 'satellite' : 'roadmap'}
              gestureHandling="greedy"
              disableDefaultUI
              zoomControl
              style={{ height: '100%', width: '100%' }}
            >
              {mappableStores.map((s, i) => {
                const n = (page - 1) * LIMIT + i + 1
                return (
                  <AdvancedMarker
                    key={s.id}
                    position={{ lat: parseFloat(s.lat!), lng: parseFloat(s.lng!) }}
                    onClick={() => setOpenMarkerId(s.id)}
                  >
                    <div style={{ position: 'relative', width: 40, height: 40 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2.5px solid #15803d', boxShadow: '0 2px 8px rgba(0,0,0,0.35)', overflow: 'hidden', background: '#fff', cursor: 'pointer' }}>
                        {s.logoUrl
                          ? <img src={s.logoUrl} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{n}</div>
                        }
                      </div>
                      <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, background: '#15803d', borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{n}</div>
                    </div>
                  </AdvancedMarker>
                )
              })}
              {openMarkerId !== null && (() => {
                const s = mappableStores.find(s => s.id === openMarkerId)
                if (!s) return null
                return (
                  <InfoWindow
                    position={{ lat: parseFloat(s.lat!), lng: parseFloat(s.lng!) }}
                    onClose={() => setOpenMarkerId(null)}
                  >
                    <div style={{ minWidth: 160 }}>
                      <p style={{ fontWeight: 700, color: '#14532d', marginBottom: 2, fontSize: 13 }}>{s.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>{[s.municipality, s.department].filter(Boolean).join(', ')}</p>
                    </div>
                  </InfoWindow>
                )
              })()}
            </GoogleMap>

            {mappableStores.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-10">
                <div className="rounded-lg bg-white/90 px-3 py-2 text-xs text-gray-500 shadow">
                  Sin coordenadas disponibles para este filtro
                </div>
              </div>
            )}

            <button
              onClick={() => setSatellite(v => !v)}
              className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow transition-colors ${
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

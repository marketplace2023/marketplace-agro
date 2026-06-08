import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import {
  Search, MapPin, Heart, SlidersHorizontal,
  Wheat, TreePine, Package, Wrench, Briefcase, FlaskConical,
  BadgeCheck, ClipboardCheck, ChevronLeft, ChevronRight,
  Layers, X, Loader2, LayoutGrid, LayoutList, Star,
  ShoppingCart, CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCategoriesQuery } from '../../modules/categories/queries/category-queries'
import { useSearchQuery } from '../../modules/search/queries/search-queries'
import type { SearchParams, SearchListing } from '../../modules/search/api/search'

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  cosechas: Wheat, fincas: TreePine, insumos: Package,
  maquinaria: Wrench, servicios: Briefcase, laboratorios: FlaskConical,
  certificadores: BadgeCheck, inspectores: ClipboardCheck,
}
const CATEGORY_GRADIENTS: Record<string, string> = {
  cosechas:      'from-agrobot-600 to-agrobot-900',
  fincas:        'from-emerald-600 to-emerald-900',
  insumos:       'from-lime-600    to-lime-900',
  maquinaria:    'from-orange-500  to-orange-800',
  servicios:     'from-sky-500     to-sky-900',
  laboratorios:  'from-cyan-600    to-cyan-900',
  certificadores:'from-violet-600  to-violet-900',
  inspectores:   'from-teal-600    to-teal-900',
}
function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICON_MAP[name.toLowerCase()] ?? Wheat
}
function getCategoryGradient(name: string | null): string {
  if (!name) return 'from-agrobot-700 to-agrobot-900'
  return CATEGORY_GRADIENTS[name.toLowerCase()] ?? 'from-agrobot-700 to-agrobot-900'
}

// ─── Filters panel ────────────────────────────────────────────────────────────

interface FiltrosPanelProps {
  open: boolean
  onClose: () => void
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  soloVerificados: boolean
  onSoloVerificadosChange: (v: boolean) => void
}

function FiltrosPanel({ open, onClose, maxPrice, onMaxPriceChange, soloVerificados, onSoloVerificadosChange }: FiltrosPanelProps) {
  const [minRating, setMinRating] = useState(0)

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
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Rating mínimo</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setMinRating(v)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all ${minRating === v ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800' : 'border-gray-200 text-gray-500 hover:border-agrobot-300'}`}
                >
                  {v === 0 ? 'Todos' : <span className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v}+</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Precio máximo</h3>
              <span className="text-sm font-bold text-agrobot-700">${maxPrice.toLocaleString()}</span>
            </div>
            <input type="range" min={50} max={100000} step={50} value={maxPrice} onChange={(e) => onMaxPriceChange(Number(e.target.value))} className="w-full accent-agrobot-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>$50</span><span>$100,000</span></div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Confiabilidad</h3>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-agrobot-300 transition-colors">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-agrobot-600" />
                <span className="text-sm font-medium text-gray-700">Solo productos verificados</span>
              </div>
              <div onClick={() => onSoloVerificadosChange(!soloVerificados)} className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${soloVerificados ? 'bg-agrobot-600' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloVerificados ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>
        </div>
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button onClick={() => { onMaxPriceChange(100000); onSoloVerificadosChange(false) }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Limpiar</button>
          <button onClick={onClose} className="flex-1 rounded-xl bg-agrobot-700 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Aplicar</button>
        </div>
      </div>
    </>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ listing }: { listing: SearchListing }) {
  const [wished, setWished] = useState(false)
  const navigate = useNavigate()
  const gradient = getCategoryGradient(listing.categoryName)
  const Icon = getCategoryIcon(listing.categoryName ?? '')

  return (
    <div
      onClick={() => navigate(`/anuncios/${listing.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-agrobot-100"
    >
      {/* Image / placeholder */}
      <div className={`relative flex aspect-4/3 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}>
        {listing.primaryImage ? (
          <img src={listing.primaryImage} alt={listing.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <Icon className="h-14 w-14 text-white/25" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setWished(v => !v) }}
          className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${wished ? 'bg-red-500/90 text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? 'fill-white' : ''}`} />
        </button>
        {listing.storeIsVerified && (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
            <CheckCircle2 className="h-3 w-3" /> Verificado
          </span>
        )}
        {listing.price && (
          <span className="absolute bottom-2.5 right-2.5 rounded-xl bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-extrabold text-white">
            ${listing.price}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3.5">
        {listing.categoryName && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-agrobot-600 mb-1">
            {listing.categoryName}{listing.subcategoryName ? ` · ${listing.subcategoryName}` : ''}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">{listing.title}</p>
        <div className="mt-2 flex items-center justify-between gap-1">
          <div>
            {!listing.price && <p className="text-xs text-gray-400">Consultar precio</p>}
            {listing.storeName && <p className="text-[11px] text-gray-400 truncate">{listing.storeName}</p>}
          </div>
          {listing.department && (
            <div className="flex items-center gap-0.5 text-[10px] text-gray-400 shrink-0">
              <MapPin className="h-3 w-3" />{listing.department}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── List card ────────────────────────────────────────────────────────────────

function ListCard({ listing, index }: { listing: SearchListing; index: number }) {
  const [wished, setWished] = useState(false)
  const navigate = useNavigate()
  const gradient = getCategoryGradient(listing.categoryName)
  const Icon = getCategoryIcon(listing.categoryName ?? '')

  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-agrobot-100">
      {/* Number */}
      <div className="hidden sm:flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
        {index + 1}
      </div>

      {/* Thumb */}
      <div className={`h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ${gradient}`}>
        {listing.primaryImage ? (
          <img src={listing.primaryImage} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-9 w-9 text-white/30" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              {listing.categoryName && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-agrobot-600 mb-0.5">
                  {listing.categoryName}{listing.subcategoryName ? ` · ${listing.subcategoryName}` : ''}
                </p>
              )}
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{listing.title}</h3>
              {listing.storeIsVerified && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-agrobot-50 px-2 py-0.5 text-[10px] font-bold text-agrobot-700">
                  <CheckCircle2 className="h-3 w-3" /> Verificado
                </span>
              )}
            </div>
            <button onClick={() => setWished(v => !v)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
          </div>
          {listing.department && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3 shrink-0" />
              {[listing.municipality, listing.department].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-base font-bold text-gray-900">
              {listing.price ? (
                <>${listing.price}{listing.priceUnit && <span className="text-xs font-normal text-gray-500 ml-1">{listing.priceUnit}</span>}</>
              ) : <span className="text-sm font-normal text-gray-400">Consultar precio</span>}
            </p>
            {listing.storeName && <p className="text-xs text-gray-400">{listing.storeName}</p>}
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              Cotizar
            </button>
            <button
              onClick={() => navigate(`/anuncios/${listing.slug}`)}
              className="flex items-center gap-1.5 rounded-xl bg-agrobot-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Ver oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CatalogoPage() {
  const [urlParams] = useSearchParams()
  const navigate = useNavigate()

  const [queryText,        setQueryText]        = useState(urlParams.get('q') ?? '')
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    urlParams.get('categoryId') ? Number(urlParams.get('categoryId')) : undefined,
  )
  const [maxPrice,         setMaxPrice]         = useState(100000)
  const [soloVerificados,  setSoloVerificados]  = useState(false)
  const [sort,             setSort]             = useState<SearchParams['sort']>('recent')
  const [page,             setPage]             = useState(1)
  const [satellite,        setSatellite]        = useState(false)
  const [filtrosOpen,      setFiltrosOpen]      = useState(false)
  const [viewMode,         setViewMode]         = useState<'grid' | 'list'>('grid')

  const searchParams: SearchParams = {
    q: queryText || undefined,
    categoryId: activeCategoryId,
    maxPrice: maxPrice < 100000 ? maxPrice : undefined,
    isVerifiedStore: soloVerificados || undefined,
    sort, page, limit: 20,
  }

  const { data: searchResult, isFetching } = useSearchQuery(searchParams)
  const { data: categories } = useCategoriesQuery()

  const listings    = searchResult?.listings ?? []
  const total       = searchResult?.total    ?? 0
  const totalPages  = Math.ceil(total / 20)

  const tileUrl  = satellite ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tileAttr = satellite ? '&copy; Esri' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  function handleSearch() {
    setPage(1)
    const p = new URLSearchParams()
    if (queryText)       p.set('q',          queryText)
    if (activeCategoryId) p.set('categoryId', String(activeCategoryId))
    navigate(`/catalogo${p.toString() ? `?${p}` : ''}`, { replace: true })
  }

  function handleCategorySelect(id: number | undefined) {
    setActiveCategoryId(id)
    setPage(1)
  }

  const activeCategory = categories?.find((c) => c.id === activeCategoryId)

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <FiltrosPanel
        open={filtrosOpen}
        onClose={() => setFiltrosOpen(false)}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        soloVerificados={soloVerificados}
        onSoloVerificadosChange={setSoloVerificados}
      />

      {/* ── Search bar ──────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar productos, fincas, insumos, servicios..."
                className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button onClick={handleSearch} className="flex items-center bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Category pills */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <button
              onClick={() => handleCategorySelect(undefined)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${activeCategoryId === undefined ? 'bg-agrobot-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'}`}
            >
              <Package className="h-3.5 w-3.5" />
              Todos
            </button>
            {(categories ?? []).map(({ id, name }) => {
              const Icon = getCategoryIcon(name)
              return (
                <button
                  key={id}
                  onClick={() => handleCategorySelect(id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${activeCategoryId === id ? 'bg-agrobot-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {name}
                </button>
              )
            })}
            <button
              onClick={() => setFiltrosOpen(true)}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700 transition-all"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-4 py-5 flex gap-5 items-start">

        {/* Left: results */}
        <div className="flex-1 min-w-0">

          {/* Results header */}
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-bold text-gray-900">
              {activeCategory ? activeCategory.name : 'Todos los productos'}
              {!isFetching && (
                <span className="ml-1.5 font-normal text-gray-400">({total.toLocaleString()} resultados)</span>
              )}
              {isFetching && <Loader2 className="inline-block h-3.5 w-3.5 ml-2 animate-spin text-agrobot-600" />}
            </h2>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="hidden sm:inline">Ordenar:</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as SearchParams['sort']); setPage(1) }}
                  className="font-semibold text-agrobot-700 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="recent">Más reciente</option>
                  <option value="featured">Destacados</option>
                  <option value="price_asc">Precio ↑</option>
                  <option value="price_desc">Precio ↓</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {listings.length === 0 && !isFetching && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-500">No se encontraron publicaciones.</p>
              <button
                onClick={() => { setQueryText(''); setActiveCategoryId(undefined) }}
                className="mt-3 text-sm font-semibold text-agrobot-600 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {listings.map((l) => <GridCard key={l.id} listing={l} />)}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="flex flex-col gap-3">
              {listings.map((l, i) => <ListCard key={l.id} listing={l} index={(page - 1) * 20 + i} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-agrobot-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: map */}
        <div className="hidden lg:block w-80 shrink-0 sticky top-36">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: 520 }}>
            <MapContainer center={[9.2, -69.4]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer attribution={tileAttr} url={tileUrl} />
            </MapContainer>
            <button
              onClick={() => setSatellite((v) => !v)}
              className={`absolute top-3 left-3 z-999 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow transition-colors ${satellite ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-agrobot-300'}`}
            >
              <Layers className="h-3.5 w-3.5" />
              Satelital
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-400">Mapa de publicaciones activas</p>
        </div>
      </div>
    </div>
  )
}

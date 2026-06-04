import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  Search,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  Wheat,
  TreePine,
  Package,
  Wrench,
  Briefcase,
  FlaskConical,
  BadgeCheck,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  X,
  ShoppingCart,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCategoriesQuery } from '../../modules/categories/queries/category-queries'
import { useSearchQuery } from '../../modules/search/queries/search-queries'
import type { SearchParams } from '../../modules/search/api/search'
import type { SearchListing } from '../../modules/search/api/search'

// Fix Leaflet marker icons in Vite
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── Icon map ─────────────────────────────────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  cosechas: Wheat,
  fincas: TreePine,
  insumos: Package,
  maquinaria: Wrench,
  servicios: Briefcase,
  laboratorios: FlaskConical,
  certificadores: BadgeCheck,
  inspectores: ClipboardCheck,
}

function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICON_MAP[name.toLowerCase()] ?? Wheat
}

// ─── Filtros panel ────────────────────────────────────────────────────────────

interface FiltrosPanelProps {
  open: boolean
  onClose: () => void
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  soloVerificados: boolean
  onSoloVerificadosChange: (v: boolean) => void
}

function FiltrosPanel({
  open, onClose, maxPrice, onMaxPriceChange, soloVerificados, onSoloVerificadosChange,
}: FiltrosPanelProps) {
  const [minRating, setMinRating] = useState(0)

  function handleApply() {
    onClose()
  }

  function handleClear() {
    setMinRating(0)
    onMaxPriceChange(100000)
    onSoloVerificadosChange(false)
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-agrobot-700" />
            <h2 className="font-display text-base font-bold text-gray-900">Filtros avanzados</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Rating */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Rating mínimo
            </h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setMinRating(v)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${minRating === v ? 'border-agrobot-500 bg-agrobot-50 text-agrobot-800' : 'border-gray-200 text-gray-600 hover:border-agrobot-300'}`}
                >
                  {v === 0 ? (
                    'Todos'
                  ) : (
                    <span className="flex items-center justify-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {v}+
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Precio máximo
              </h3>
              <span className="text-sm font-bold text-agrobot-700">
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100000}
              step={50}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-agrobot-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>$50</span>
              <span>$100,000</span>
            </div>
          </div>

          {/* Solo verificados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Confiabilidad
            </h3>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-gray-200 px-4 py-3 hover:border-agrobot-300 transition-colors">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-agrobot-600" />
                <span className="text-sm font-medium text-gray-700">
                  Solo productos verificados
                </span>
              </div>
              <div
                onClick={() => onSoloVerificadosChange(!soloVerificados)}
                className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${soloVerificados ? 'bg-agrobot-600' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloVerificados ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-xl bg-agrobot-700 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ listing, index }: { listing: SearchListing; index: number }) {
  const [wished, setWished] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="hidden sm:flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-agrobot-700 text-xs font-bold text-white">
        {index + 1}
      </div>

      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {listing.primaryImage ? (
          <img
            src={listing.primaryImage}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300">
            {(() => {
              const Icon = getCategoryIcon(listing.categoryName ?? '')
              return <Icon className="h-10 w-10" />
            })()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{listing.title}</h3>
              {listing.storeIsVerified && (
                <span className="rounded-full bg-agrobot-100 px-2 py-0.5 text-[10px] font-bold text-agrobot-800">
                  VERIFICADO
                </span>
              )}
            </div>
            <button
              onClick={() => setWished((v) => !v)}
              className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
          </div>

          {listing.categoryName && (
            <p className="mt-0.5 text-[11px] text-agrobot-600 font-semibold">
              {listing.categoryName}
              {listing.subcategoryName ? ` · ${listing.subcategoryName}` : ''}
            </p>
          )}

          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {[listing.municipality, listing.department].filter(Boolean).join(', ')}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-base font-bold text-gray-900">
              {listing.price ? (
                <>
                  ${listing.price}
                  {listing.priceUnit && (
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      {listing.priceUnit}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-normal text-gray-400">Consultar precio</span>
              )}
            </p>
            {listing.storeName && (
              <p className="text-xs text-gray-400 mt-0.5">{listing.storeName}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-400 hover:text-agrobot-700">
              Cotizar
            </button>
            <button
              onClick={() => navigate(`/anuncios/${listing.slug}`)}
              className="flex items-center gap-1.5 rounded-lg bg-agrobot-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800"
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

  const [queryText, setQueryText] = useState(urlParams.get('q') ?? '')
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    urlParams.get('categoryId') ? Number(urlParams.get('categoryId')) : undefined,
  )
  const [maxPrice, setMaxPrice] = useState(100000)
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [sort, setSort] = useState<SearchParams['sort']>('recent')
  const [page, setPage] = useState(1)
  const [satellite, setSatellite] = useState(false)
  const [filtrosOpen, setFiltrosOpen] = useState(false)

  const searchParams: SearchParams = {
    q: queryText || undefined,
    categoryId: activeCategoryId,
    maxPrice: maxPrice < 100000 ? maxPrice : undefined,
    isVerifiedStore: soloVerificados || undefined,
    sort,
    page,
    limit: 20,
  }

  const { data: searchResult, isFetching } = useSearchQuery(searchParams)
  const { data: categories } = useCategoriesQuery()

  const listings = searchResult?.listings ?? []
  const total = searchResult?.total ?? 0
  const totalPages = Math.ceil(total / 20)

  const tileUrl = satellite
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const tileAttr = satellite
    ? '&copy; Esri &mdash; Source: Esri'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  function handleSearch() {
    setPage(1)
    const params = new URLSearchParams()
    if (queryText) params.set('q', queryText)
    if (activeCategoryId) params.set('categoryId', String(activeCategoryId))
    navigate(`/catalogo${params.toString() ? `?${params}` : ''}`, { replace: true })
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

      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="¿Qué producto buscas? (semillas, tractores, fertilizantes...)"
                className="flex-1 bg-transparent py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center bg-agrobot-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Category pills */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleCategorySelect(undefined)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeCategoryId === undefined
                  ? 'bg-agrobot-700 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Todos
            </button>
            {(categories ?? []).map(({ id, name }) => {
              const Icon = getCategoryIcon(name)
              return (
                <button
                  key={id}
                  onClick={() => handleCategorySelect(id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeCategoryId === id
                      ? 'bg-agrobot-700 text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {name}
                </button>
              )
            })}
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

        {/* Left: product list */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              {activeCategory ? activeCategory.name : 'Todos los productos'}
              {!isFetching && (
                <span className="text-gray-400 font-normal ml-1">({total} resultados)</span>
              )}
              {isFetching && (
                <Loader2 className="inline-block h-3.5 w-3.5 ml-2 animate-spin text-agrobot-600" />
              )}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              Ordenar por:
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SearchParams['sort'])
                  setPage(1)
                }}
                className="font-semibold text-agrobot-700 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="recent">Más reciente</option>
                <option value="featured">Destacados</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {listings.length === 0 && !isFetching && (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400">
              No se encontraron publicaciones.{' '}
              <button
                onClick={() => { setQueryText(''); setActiveCategoryId(undefined) }}
                className="font-semibold text-agrobot-600 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {listings.map((listing, i) => (
              <ProductCard key={listing.id} listing={listing} index={(page - 1) * 20 + i} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors disabled:opacity-40"
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: map */}
        <div className="hidden lg:block w-95 shrink-0 sticky top-20">
          <div
            className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
            style={{ height: 580 }}
          >
            <MapContainer
              center={[9.2, -69.4]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer attribution={tileAttr} url={tileUrl} />
            </MapContainer>
            <button
              onClick={() => setSatellite((v) => !v)}
              className={`absolute top-3 left-3 z-999 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow transition-colors ${satellite ? 'bg-agrobot-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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

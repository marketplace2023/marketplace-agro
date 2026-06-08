import { useState, useEffect } from 'react'
import {
  Heart, MapPin, CheckCircle2, Zap, ArrowRight,
  Tractor, Package, Wheat, Droplets, Building2, ShieldCheck, Tag, Star,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { axiosInstance } from '@/modules/shared/lib/axios'

// ─── API types ────────────────────────────────────────────────────────────────

interface ApiListing {
  id: number
  title: string
  price: string | null
  priceUnit: string | null
  listingType: string
  department: string | null
  slug: string
  categoryName: string | null
  storeName: string | null
  storeSlug: string | null
  storeLogoUrl: string | null
  storeIsVerified: boolean | null
  primaryImage: string | null
}

interface ApiStore {
  id: number
  name: string
  slug: string
  logoUrl: string | null
  isVerified: boolean
  roleType: string
  description: string | null
  avgRating: number | null
  reviewCount: number
  specialties: string[]
}

interface ApiCategory {
  id: number
  name: string
  slug: string
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function useCountdown(targetDate: Date): CountdownTime {
  const getTimeLeft = (): CountdownTime => {
    const diff = Math.max(0, targetDate.getTime() - Date.now())
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [time, setTime] = useState<CountdownTime>(getTimeLeft)
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  maquinaria: Tractor,
  insumos: Package,
  semillas: Wheat,
  cosecha: Wheat,
  riego: Droplets,
  'tierras-y-fincas': MapPin,
  fincas: MapPin,
}

function getCategoryIcon(slug: string): React.ElementType {
  return CATEGORY_ICON[slug] ?? Package
}

function formatPrice(price: string | null, priceUnit: string | null): string {
  if (!price) return 'A consultar'
  const formatted = `$${Number(price).toLocaleString('es-AR')}`
  return priceUnit ? `${formatted} / ${priceUnit}` : formatted
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-bold text-white leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] font-semibold tracking-widest text-white/60 uppercase mt-0.5">
        {label}
      </span>
    </div>
  )
}

function OfertaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-3.5 flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-7 flex-1" />
        </div>
      </div>
    </div>
  )
}

function OfertaCard({ listing }: { listing: ApiListing }) {
  const [wished, setWished] = useState(false)
  const Icon = getCategoryIcon(listing.categoryName?.toLowerCase().replace(/\s+/g, '-') ?? '')

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-linear-to-br from-agrobot-700 to-agrobot-900">
        {listing.primaryImage ? (
          <img
            src={listing.primaryImage}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className="h-16 w-16 text-white/20" />
        )}
        <span className="absolute left-2.5 top-2.5 rounded px-2 py-0.5 text-[11px] font-bold bg-agrobot-600 text-white">
          OFERTA
        </span>
        <button
          onClick={() => setWished((v) => !v)}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        {listing.categoryName && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-agrobot-600 mb-1">
            {listing.categoryName}
          </p>
        )}
        <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{listing.title}</p>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          {listing.storeIsVerified && listing.storeName ? (
            <>
              <CheckCircle2 className="h-3 w-3 shrink-0 text-agrobot-600" />
              <span className="text-agrobot-700 font-medium truncate">{listing.storeName}</span>
            </>
          ) : listing.department ? (
            <>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{listing.department}</span>
            </>
          ) : listing.storeName ? (
            <span className="truncate text-gray-600">{listing.storeName}</span>
          ) : null}
        </div>

        <div className="mt-2">
          <p className="text-base font-bold text-gray-900">{formatPrice(listing.price, listing.priceUnit)}</p>
        </div>

        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-agrobot-300 hover:text-agrobot-800">
            Ver oferta
          </button>
          <button className="flex-1 rounded-lg bg-agrobot-700 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agrobot-800">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  )
}

function TiendaCard({ store }: { store: ApiStore }) {
  const initials = store.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const description = store.description ?? (store.specialties.length > 0 ? store.specialties.join(', ') : null)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-3 transition-shadow hover:shadow-md">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-agrobot-600 to-agrobot-800 shadow">
        {store.logoUrl ? (
          <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-white">{initials}</span>
        )}
      </div>
      <div>
        <div className="flex items-center justify-center gap-1">
          <p className="font-bold text-gray-900 text-sm">{store.name}</p>
          {store.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-agrobot-600" />}
        </div>
        {store.avgRating !== null && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{Number(store.avgRating).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({store.reviewCount})</span>
          </div>
        )}
        {description && (
          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>
      <button className="w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-agrobot-300 hover:text-agrobot-700">
        Visitar Tienda
      </button>
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroBanner() {
  const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000)
  const { days, hours, minutes } = useCountdown(target)

  return (
    <section className="relative overflow-hidden rounded-2xl mx-auto max-w-6xl mt-6 px-4" style={{ minHeight: 300 }}>
      <div
        className="relative overflow-hidden rounded-2xl w-full"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.10) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 300,
        }}
      >
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-12" style={{ minHeight: 300 }}>
          <span className="inline-block w-fit rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-4">
            Campaña Estacional
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight max-w-lg mb-3">
            Gran Venta de Cosecha 2026
          </h1>
          <p className="text-white/80 text-sm max-w-sm mb-6 leading-relaxed">
            Equipate con lo mejor para esta temporada. Maquinaria, semillas y fertilizantes con descuentos de hasta el 40%.
          </p>
          <div className="inline-flex flex-col gap-1.5 bg-black/30 backdrop-blur-sm rounded-xl px-5 py-3.5 w-fit mb-6">
            <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
              La oferta termina en:
            </span>
            <div className="flex items-end gap-3">
              <CountdownUnit value={days} label="Días" />
              <span className="text-white/60 font-bold text-xl mb-0.5">:</span>
              <CountdownUnit value={hours} label="Horas" />
              <span className="text-white/60 font-bold text-xl mb-0.5">:</span>
              <CountdownUnit value={minutes} label="Min" />
            </div>
          </div>
          <button className="flex w-fit items-center gap-2 rounded-xl bg-agrobot-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-agrobot-700">
            Ver Catálogo de Cosecha
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

interface CategoryFilterProps {
  categories: ApiCategory[]
  selectedId: number | null
  onChange: (id: number | null) => void
  loading: boolean
}

function CategoryFilter({ categories, selectedId, onChange, loading }: CategoryFilterProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">Filtrar por categoría</h2>
        <button className="text-sm font-semibold text-agrobot-700 hover:underline">Ver todas</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onChange(null)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            selectedId === null
              ? 'bg-agrobot-700 text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
          }`}
        >
          <Zap className="h-4 w-4" />
          Todas las Ofertas
        </button>
        {loading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
          : categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug)
              const isActive = selectedId === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-agrobot-700 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-agrobot-300 hover:text-agrobot-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              )
            })}
      </div>
    </section>
  )
}

interface OfertasDelDiaProps {
  listings: ApiListing[]
  loading: boolean
}

function OfertasDelDia({ listings, loading }: OfertasDelDiaProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
        <h2 className="font-display text-lg font-bold text-gray-900">Ofertas Destacadas</h2>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <OfertaCardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Tag className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">No hay ofertas destacadas en este momento</p>
          <p className="text-xs text-gray-400 mt-1">Volvé más tarde para ver nuevas publicaciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {listings.map((listing) => (
            <OfertaCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}

interface TiendasOficialesProps {
  stores: ApiStore[]
  loading: boolean
}

function TiendasOficiales({ stores, loading }: TiendasOficialesProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-10 mb-10">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg font-bold text-gray-900">Tiendas Verificadas</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-agrobot-700 hover:underline">
            Ver todas las tiendas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-5">Compra directo de las mejores marcas del sector con garantía oficial.</p>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building2 className="h-10 w-10 text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">No hay tiendas verificadas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stores.map((store) => (
              <TiendaCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function OfertasPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [catLoading, setCatLoading] = useState(true)

  const [listings, setListings] = useState<ApiListing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)

  const [stores, setStores] = useState<ApiStore[]>([])
  const [storesLoading, setStoresLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get<ApiCategory[]>('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setCatLoading(false))

    axiosInstance.get<{ stores: ApiStore[] }>('/stores', { params: { isVerified: true, limit: 3 } })
      .then((res) => setStores(res.data.stores))
      .catch(() => {})
      .finally(() => setStoresLoading(false))
  }, [])

  useEffect(() => {
    setListingsLoading(true)
    const params: Record<string, unknown> = { isFeatured: true, limit: 8 }
    if (selectedCategoryId !== null) params.categoryId = selectedCategoryId

    axiosInstance.get<{ listings: ApiListing[] }>('/search', { params })
      .then((res) => setListings(res.data.listings))
      .catch(() => setListings([]))
      .finally(() => setListingsLoading(false))
  }, [selectedCategoryId])

  return (
    <div className="bg-white min-h-screen pb-10">
      <HeroBanner />
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategoryId}
        onChange={setSelectedCategoryId}
        loading={catLoading}
      />
      <OfertasDelDia listings={listings} loading={listingsLoading} />
      <TiendasOficiales stores={stores} loading={storesLoading} />
    </div>
  )
}

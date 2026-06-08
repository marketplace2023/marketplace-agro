import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import {
  MapPin, ShieldCheck, Heart, Share2, AlertCircle,
  Loader2, Store, Eye, Phone, MessageCircle, Globe, AtSign,
  Star, CheckCircle2, Clock, Tag, ChevronRight, Package,
} from 'lucide-react'
import { useStoreBySlugQuery, useStoreReviewsQuery, useStoreListingsQuery } from '../../../modules/stores/queries/store-queries'
import type { StoreReview, StoreListing } from '../../../modules/stores/api/stores'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7)  return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days/7)} sem.`
  if (days < 365)return `Hace ${Math.floor(days/30)} mes.`
  return `Hace ${Math.floor(days/365)} año${Math.floor(days/365)>1?'s':''}`
}

function fmtPrice(price: string | null, unit: string | null) {
  if (!price) return 'Consultar'
  return `$${Number(price).toLocaleString('es-VE')}${unit ? ` / ${unit}` : ''}`
}

const LISTING_TYPE_LABEL: Record<string, string> = {
  sale: 'Venta', rent: 'Alquiler', service: 'Servicio', quote: 'Cotización', alliance: 'Alianza',
}
const LISTING_TYPE_COLOR: Record<string, string> = {
  sale: 'bg-blue-600', rent: 'bg-violet-600', service: 'bg-agrobot-700',
  quote: 'bg-amber-500', alliance: 'bg-pink-600',
}

const CONTACT_ICON: Record<string, React.ElementType> = {
  phone: Phone, whatsapp: MessageCircle, email: AtSign,
  website: Globe, instagram: AtSign, facebook: Share2,
}
const CONTACT_COLOR: Record<string, string> = {
  phone: 'bg-gray-100 text-gray-700', whatsapp: 'bg-green-500 text-white',
  email: 'bg-sky-100 text-sky-700', website: 'bg-gray-100 text-gray-700',
  instagram: 'bg-pink-100 text-pink-700', facebook: 'bg-blue-100 text-blue-700',
}
const CONTACT_HREF: Record<string, (v: string) => string> = {
  phone:     v => `tel:${v}`,
  whatsapp:  v => `https://wa.me/${v.replace(/\D/g,'')}`,
  email:     v => `mailto:${v}`,
  website:   v => v,
  instagram: v => `https://instagram.com/${v.replace('@','')}`,
  facebook:  v => v,
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: StoreListing }) {
  return (
    <Link
      to={`/anuncios/${listing.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-agrobot-200 transition-all overflow-hidden"
    >
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {listing.thumbnailUrl ? (
          <img src={listing.thumbnailUrl} alt={listing.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Package className="h-10 w-10 text-gray-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {listing.categoryName && (
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm backdrop-blur-sm">
              {listing.categoryName}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${LISTING_TYPE_COLOR[listing.listingType] ?? 'bg-gray-600'}`}>
            {LISTING_TYPE_LABEL[listing.listingType] ?? listing.listingType}
          </span>
        </div>
        {listing.isFeatured && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            ⭐ Destacado
          </span>
        )}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
          <Eye className="h-3 w-3" />{listing.viewCount}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-agrobot-700 transition-colors leading-snug">
          {listing.title}
        </p>
        {listing.municipality && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {[listing.municipality, listing.department].filter(Boolean).join(', ')}
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <p className="text-base font-bold text-agrobot-700">{fmtPrice(listing.price, listing.priceUnit)}</p>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-agrobot-500 transition-colors" />
        </div>
      </div>
    </Link>
  )
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: StoreReview }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agrobot-100 text-xs font-bold text-agrobot-700">
          C{review.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs font-bold text-gray-800">Comprador verificado</p>
            <p className="text-[10px] text-gray-400">{timeAgo(review.createdAt)}</p>
          </div>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          {review.comment && (
            <p className="mt-2 text-xs leading-relaxed text-gray-600">"{review.comment}"</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Ubicacion Tab ────────────────────────────────────────────────────────────

function UbicacionTab({ gbpLat, gbpLng, storeName, isApproximate, municipality, department }: {
  gbpLat: number | null; gbpLng: number | null; storeName: string
  isApproximate: boolean; municipality: string | null; department: string | null
}) {
  const [lat, setLat] = useState<number | null>(gbpLat)
  const [lng, setLng] = useState<number | null>(gbpLng)

  useEffect(() => {
    if (gbpLat && gbpLng) { setLat(gbpLat); setLng(gbpLng); return }
    const q = [municipality, department, 'Venezuela'].filter(Boolean).join(', ')
    if (!q) return
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, { headers: { 'Accept-Language': 'es' } })
      .then(r => r.json()).then(d => { if (d[0]) { setLat(parseFloat(d[0].lat)); setLng(parseFloat(d[0].lon)) } }).catch(() => {})
  }, [gbpLat, gbpLng, municipality, department])

  if (!lat || !lng) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16">
      <Loader2 className="h-6 w-6 animate-spin text-gray-300 mb-3" />
      <p className="text-sm text-gray-400">Cargando mapa…</p>
    </div>
  )

  const bbox = `${(lng-.08).toFixed(5)},${(lat-.08).toFixed(5)},${(lng+.08).toFixed(5)},${(lat+.08).toFixed(5)}`
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="flex flex-col gap-3">
      {isApproximate && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          Por seguridad se muestra la zona general del negocio, no la dirección exacta.
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: 320 }}>
        <iframe src={mapSrc} title={`Ubicación de ${storeName}`} className="h-full w-full" loading="lazy" />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-400">
        <MapPin className="h-3.5 w-3.5" />
        {[municipality, department, 'Venezuela'].filter(Boolean).join(', ')}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TiendaPerfilPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState('Publicaciones')
  const [saved, setSaved] = useState(false)

  const { data: store, isLoading, isError } = useStoreBySlugQuery(slug)
  const { data: apiReviews } = useStoreReviewsQuery(activeTab === 'Reseñas' ? slug : undefined)
  const { data: storeListings, isLoading: listingsLoading } = useStoreListingsQuery(slug)

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-agrobot-600" />
    </div>
  )

  if (isError || !store) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
      <Store className="h-14 w-14 text-gray-200" />
      <p className="text-sm font-semibold text-gray-400">Tienda no encontrada</p>
      <Link to="/catalogo" className="text-xs text-agrobot-600 hover:underline">Ir al catálogo →</Link>
    </div>
  )

  const gbpLat = store.gbp?.latitude  ? Number(store.gbp.latitude)  : null
  const gbpLng = store.gbp?.longitude ? Number(store.gbp.longitude) : null
  const galleryMedia = store.media.filter(m => m.mediaType === 'image')
  const whatsappContact = store.contacts.find(c => c.contactType === 'whatsapp')
  const whatsappHref = whatsappContact ? `https://wa.me/${whatsappContact.value.replace(/\D/g,'')}` : undefined

  const TABS = [
    { key: 'Publicaciones', count: storeListings?.length ?? null },
    { key: 'Reseñas',       count: store.rating?.total > 0 ? store.rating.total : null },
    { key: 'Ubicación',     count: null },
    { key: 'Ofertas',       count: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── Banner ── */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-agrobot-900">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-agrobot-900 via-agrobot-800 to-emerald-800">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* ── Profile hero card ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative -mt-20 z-10 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">

          {/* Top: logo + name + CTAs */}
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Logo */}
              <div className="shrink-0 -mt-10 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-20 w-20 object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center bg-agrobot-50">
                    <span className="text-2xl font-bold text-agrobot-700">{store.name.slice(0,2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              {/* Name + meta */}
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-gray-900 leading-tight">{store.name}</h1>
                  {store.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-agrobot-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      <ShieldCheck className="h-3 w-3" /> VERIFICADO
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {store.rating?.total > 0 ? (
                    <div className="flex items-center gap-1">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(store.rating.average) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                      <span className="text-xs font-semibold text-gray-600">{store.rating.average.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({store.rating.total})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Sin reseñas aún</span>
                  )}
                  {store.department && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {[store.municipality, store.department].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {store.roleType && (
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                      {store.roleType.replace(/_/g,' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors shadow-sm">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-agrobot-300 hover:text-agrobot-700 transition-colors shadow-sm">
                <Tag className="h-4 w-4" /> Cotizar
              </button>
              <button onClick={() => setSaved(v=>!v)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shadow-sm ${saved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 bg-white text-gray-400 hover:text-red-400'}`}>
                <Heart className={`h-4 w-4 ${saved ? 'fill-red-400' : ''}`} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-agrobot-600 transition-colors shadow-sm">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {(store.description || store.profile?.about) && (
            <div className="px-5 pb-4 border-t border-gray-50 pt-4">
              <p className="text-sm leading-relaxed text-gray-600 max-w-2xl">
                {store.profile?.about || store.description}
              </p>
            </div>
          )}

          {/* Stats strip */}
          <div className="flex items-center gap-0 border-t border-gray-100 divide-x divide-gray-100">
            {[
              { label: 'Publicaciones', value: storeListings?.length ?? '—', icon: Package },
              { label: 'Reseñas',       value: store.rating?.total ?? '0',  icon: Star   },
              { label: 'Estado',        value: store.isVerified ? 'Verificado' : 'Activo', icon: CheckCircle2 },
              ...(store.profile?.yearFounded ? [{ label: 'Desde', value: String(store.profile.yearFounded), icon: Clock }] : []),
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-1 flex-col items-center py-3.5 px-2">
                <Icon className="h-4 w-4 text-agrobot-500 mb-1" />
                <p className="text-sm font-bold text-gray-900">{value}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">

          {/* Contacts */}
          {store.contacts.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Contacto</p>
              <div className="flex flex-col gap-2">
                {store.contacts.map(c => {
                  const Icon = CONTACT_ICON[c.contactType] ?? Phone
                  const colorCls = CONTACT_COLOR[c.contactType] ?? 'bg-gray-100 text-gray-700'
                  const href = CONTACT_HREF[c.contactType]?.(c.value) ?? '#'
                  return (
                    <a key={c.id} href={href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${colorCls}`}>
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{c.label || c.value}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Store info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Información</p>
            <div className="flex flex-col gap-3">
              {store.department && (
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <MapPin className="h-3.5 w-3.5 text-agrobot-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Ubicación</p>
                    <p className="font-semibold">{[store.municipality, store.department].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              )}
              {store.isVerified && (
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <ShieldCheck className="h-3.5 w-3.5 text-agrobot-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Verificación</p>
                    <p className="font-semibold text-agrobot-700">Vendedor verificado</p>
                  </div>
                </div>
              )}
              {store.profile?.yearFounded && (
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <Clock className="h-3.5 w-3.5 text-agrobot-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Fundada</p>
                    <p className="font-semibold">{store.profile.yearFounded}</p>
                  </div>
                </div>
              )}
              {store.profile?.specialties && (
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <Tag className="h-3.5 w-3.5 text-agrobot-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Especialidades</p>
                    <p className="font-semibold leading-relaxed">{store.profile.specialties}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          {galleryMedia.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Galería</p>
              <div className="grid grid-cols-2 gap-1.5">
                {galleryMedia.slice(0, 4).map(m => (
                  <div key={m.id} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <img src={m.url} alt={m.caption ?? store.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-200" />
                  </div>
                ))}
              </div>
              {galleryMedia.length > 4 && (
                <button className="mt-2 w-full rounded-lg border border-gray-100 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                  Ver {galleryMedia.length - 4} fotos más
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setSaved(v=>!v)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                {saved ? 'Tienda guardada' : 'Guardar esta tienda'}
              </button>
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" /> Compartir perfil
              </button>
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors">
                <AlertCircle className="h-4 w-4" /> Reportar vendedor
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0">

          {/* Tabs */}
          <div className="mb-5 flex gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm overflow-x-auto">
            {TABS.map(({ key, count }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-agrobot-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}>
                {key}
                {count !== null && count > 0 && (
                  <span className={`rounded-full px-1.5 text-[10px] font-bold ${activeTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Publicaciones */}
          {activeTab === 'Publicaciones' && (
            listingsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-100" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-4/5" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !storeListings?.length ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Store className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-500">Sin publicaciones activas</p>
                <p className="mt-1 text-xs text-gray-400">Las publicaciones de esta tienda aparecerán aquí.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {storeListings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )
          )}

          {/* Reseñas */}
          {activeTab === 'Reseñas' && (
            !apiReviews?.length ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                  <Star className="h-8 w-8 text-amber-200" />
                </div>
                <p className="text-sm font-bold text-gray-500">Sin reseñas aún</p>
                <p className="mt-1 text-xs text-gray-400">Sé el primero en dejar una reseña.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {apiReviews.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            )
          )}

          {/* Ubicación */}
          {activeTab === 'Ubicación' && (
            <UbicacionTab
              gbpLat={gbpLat} gbpLng={gbpLng} storeName={store.name}
              isApproximate={store.gbp?.isLocationApproximate ?? true}
              municipality={store.municipality ?? null} department={store.department ?? null}
            />
          )}

          {/* Ofertas */}
          {activeTab === 'Ofertas' && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <Tag className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-500">Ofertas próximamente</p>
              <p className="mt-1 text-xs text-gray-400">Esta sección estará disponible en breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

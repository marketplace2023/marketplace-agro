import { useState } from 'react'
import { useParams } from 'react-router'
import { Clock, MapPin, ShieldCheck, Heart, Share2, AlertCircle, Image, Loader2, Store } from 'lucide-react'
import { HeroPerfil, StarRating, CTAButtons, ReviewsSection, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'
import { useStoreBySlugQuery } from '../../../modules/stores/queries/store-queries'
import { useStoreReviewsQuery } from '../../../modules/stores/queries/store-queries'
import type { StoreReview } from '../../../modules/stores/api/stores'

const tabs = ['Publicaciones', 'Ofertas', 'Reseñas', 'Ubicación', 'Documentos']

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`
  if (days < 365) return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''}`
  return `Hace ${Math.floor(days / 365)} año${Math.floor(days / 365) > 1 ? 's' : ''}`
}

const REVIEW_COLORS = ['bg-agrobot-700', 'bg-sky-600', 'bg-agro-earth-500', 'bg-agrobot-600']

function mapApiReviews(reviews: StoreReview[]) {
  return reviews.map((r, i) => ({
    initials: `C${r.id}`,
    name: 'Comprador verificado',
    role: '',
    ago: timeAgo(r.createdAt),
    rating: r.rating,
    text: r.comment ? `"${r.comment}"` : '',
    color: REVIEW_COLORS[i % REVIEW_COLORS.length],
    verified: r.isVerified,
  }))
}

export function TiendaPerfilPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState('Publicaciones')
  const [saved, setSaved] = useState(false)

  const { data: store, isLoading, isError } = useStoreBySlugQuery(slug)
  const { data: apiReviews } = useStoreReviewsQuery(activeTab === 'Reseñas' ? slug : undefined)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-agrobot-600" />
      </div>
    )
  }

  if (isError || !store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white">
        <Store className="h-12 w-12 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">Tienda no encontrada</p>
      </div>
    )
  }

  const whatsappContact = store.contacts.find((c) => c.contactType === 'whatsapp')
  const whatsappHref = whatsappContact
    ? `https://wa.me/${whatsappContact.value.replace(/\D/g, '')}`
    : undefined

  const gbpLat = store.gbp?.latitude ? Number(store.gbp.latitude) : null
  const gbpLng = store.gbp?.longitude ? Number(store.gbp.longitude) : null

  const reviews = mapApiReviews(apiReviews ?? [])

  const galleryMedia = store.media.filter((m) => m.mediaType === 'image').slice(0, 4)

  return (
    <div className="bg-white min-h-screen pb-12">

      {/* Hero banner */}
      <HeroPerfil bg={store.bannerUrl ?? '/farm-bg.png'} height={240} />

      {/* Company card */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-agrobot-50 shadow-sm">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-agrobot-700">
                    {store.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-bold text-gray-900">{store.name}</h1>
                  {store.isVerified && (
                    <span className="rounded-full bg-agrobot-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      SELLO AGROMARKET
                    </span>
                  )}
                </div>
                {store.rating && store.rating.total > 0 ? (
                  <StarRating rating={store.rating.average} reviews={store.rating.total} />
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Sin reseñas aún</p>
                )}
                {store.department && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {[store.municipality, store.department, 'Venezuela']
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>
            <CTAButtons
              cotizarLabel="Cotizar"
              whatsappHref={whatsappHref}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Información del Vendedor
            </h3>
            <div className="flex flex-col gap-3">
              {store.profile?.yearFounded && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <Clock className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Fundada</p>
                    <p className="text-xs font-semibold text-gray-800">{store.profile.yearFounded}</p>
                  </div>
                </div>
              )}
              {store.department && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <MapPin className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Ubicación</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {[store.municipality, store.department].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
              {store.isVerified && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <ShieldCheck className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Verificación</p>
                    <p className="text-xs font-semibold text-gray-800">Vendedor verificado</p>
                  </div>
                </div>
              )}
              {store.profile?.specialties && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                    <ShieldCheck className="h-3.5 w-3.5 text-agrobot-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Especialidades</p>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                      {store.profile.specialties}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <button
              onClick={() => setSaved((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-agrobot-700 transition-colors"
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
              {saved ? 'Tienda guardada' : 'Guardar esta tienda'}
            </button>
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-agrobot-700 transition-colors">
              <Share2 className="h-4 w-4" />
              Compartir perfil
            </button>
            <button className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
              <AlertCircle className="h-4 w-4" />
              Reportar vendedor
            </button>
          </div>

          {galleryMedia.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Galería del Establecimiento
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {galleryMedia.map((m) => (
                  <div key={m.id} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img src={m.url} alt={m.caption ?? store.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              {store.media.length > 4 && (
                <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-agrobot-700 hover:underline">
                  <Image className="h-3.5 w-3.5" />
                  Ver galería completa (+{store.media.length - 4})
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main */}
        <div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-5">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-agrobot-600 text-agrobot-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'Reseñas' && store.rating?.total > 0 && (
                    <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                      {store.rating.total}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'Publicaciones' && (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400">
              Las publicaciones de esta tienda estarán disponibles próximamente.
            </div>
          )}

          {activeTab === 'Reseñas' && (
            <ReviewsSection reviews={reviews.length > 0 ? reviews : undefined} />
          )}

          {activeTab === 'Ubicación' && gbpLat && gbpLng ? (
            <MapaUbicacion
              lat={gbpLat}
              lng={gbpLng}
              label={store.name}
              note={store.gbp?.isLocationApproximate ? 'Por seguridad, se muestra la zona general.' : undefined}
            />
          ) : activeTab === 'Ubicación' ? (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
              Ubicación no disponible para esta tienda.
            </div>
          ) : null}

          {['Ofertas', 'Documentos'].includes(activeTab) && (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400">
              Sección <strong>{activeTab}</strong> — próximamente disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

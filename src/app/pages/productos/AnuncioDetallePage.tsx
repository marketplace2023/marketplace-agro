import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ChevronRight,
  Heart,
  BarChart2,
  Share2,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Star,
  Send,
  MessageCircle,
  Loader2,
  Package,
} from 'lucide-react'
import { useListingBySlugQuery } from '../../../modules/listings/queries/listing-queries'

const LISTING_TYPE_LABELS: Record<string, string> = {
  sale: 'Venta',
  rent: 'Arriendo',
  service: 'Servicio',
  quote: 'Cotización',
  alliance: 'Alianza',
}

export function AnuncioDetallePage() {
  const { id: slug } = useParams<{ id: string }>()
  const { data: listing, isLoading, isError } = useListingBySlugQuery(slug)

  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-agrobot-600" />
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <Package className="h-12 w-12 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">Publicación no encontrada</p>
        <Link to="/catalogo" className="text-sm text-agrobot-600 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const primaryImage = listing.media.find((m) => m.isPrimary)?.url ?? listing.media[0]?.url
  const galleryImages = listing.media.slice(0, 4)

  const fichaTecnica = [
    { label: 'Categoría', value: listing.category?.name ?? '—' },
    { label: 'Tipo', value: LISTING_TYPE_LABELS[listing.listingType] ?? listing.listingType },
    { label: 'Estado', value: listing.status === 'published' ? 'Publicado' : listing.status },
    ...(listing.department ? [{ label: 'Departamento / Estado', value: listing.department }] : []),
    ...(listing.municipality ? [{ label: 'Municipio', value: listing.municipality }] : []),
    { label: 'Vistas', value: String(listing.viewCount) },
  ]

  const whatsappContact = listing.store
    ? `https://wa.me/?text=Hola, me interesa el anuncio: ${listing.title} — ${window.location.href}`
    : undefined

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Catálogo</Link>
          <ChevronRight className="h-3 w-3" />
          {listing.category && (
            <>
              <Link
                to={`/catalogo?categoryId=${listing.category.id}`}
                className="hover:text-agrobot-700"
              >
                {listing.category.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-gray-600 truncate max-w-xs">{listing.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">

          {/* Main */}
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            {galleryImages.length > 0 ? (
              <div
                className={`grid gap-2 rounded-2xl overflow-hidden ${galleryImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
              >
                {galleryImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={listing.title}
                    className="h-64 w-full object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="h-64 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                <Package className="h-20 w-20" />
              </div>
            )}

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {listing.category && (
                    <span className="inline-block rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800 mb-2 uppercase">
                      {listing.category.name}
                    </span>
                  )}
                  <h1 className="font-display text-xl font-bold text-gray-900">{listing.title}</h1>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    {listing.department && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {[listing.municipality, listing.department].filter(Boolean).join(', ')}
                      </div>
                    )}
                    <span className="text-gray-300">·</span>
                    <span>{LISTING_TYPE_LABELS[listing.listingType] ?? listing.listingType}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSaved((v) => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <BarChart2 className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                    <AlertCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {listing.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              )}
            </div>

            {/* Ficha técnica */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Ficha Técnica</h2>
              <div className="divide-y divide-gray-100">
                {fichaTecnica.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preguntas */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">
                Preguntas al Vendedor
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Escribe tu consulta..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20"
                />
                <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Inicia sesión para enviar preguntas al vendedor.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-20 flex flex-col gap-4 h-fit">

            {/* Price card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              {listing.price ? (
                <p className="text-2xl font-bold text-gray-900">
                  ${listing.price}
                  {listing.priceUnit && (
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {listing.priceUnit}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-base font-semibold text-gray-500">Precio a consultar</p>
              )}
              <div className="flex flex-col gap-2 mt-4">
                <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  Cotizar ahora
                </button>
                {whatsappContact && (
                  <a
                    href={whatsappContact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-agrobot-700 py-3 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Seller card */}
            {listing.store && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Vendedor
                </p>
                <div className="flex items-center gap-3 mb-3">
                  {listing.store.logoUrl ? (
                    <img
                      src={listing.store.logoUrl}
                      alt={listing.store.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agrobot-700 text-sm font-bold text-white">
                      {listing.store.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-900">{listing.store.name}</p>
                      {listing.store.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                      )}
                    </div>
                    {listing.store.department && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {[listing.store.municipality, listing.store.department]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to={`/tiendas/${listing.store.slug}`}
                  className="block w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors"
                >
                  Ver perfil del vendedor
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

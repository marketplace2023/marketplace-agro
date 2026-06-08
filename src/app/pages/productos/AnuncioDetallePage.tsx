import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ChevronRight, Heart, Share2, AlertCircle, MapPin,
  CheckCircle2, MessageCircle, Loader2, Package, Eye,
  Star, Send, ChevronLeft, Zap, ShieldCheck, Truck,
} from 'lucide-react'
import { useListingBySlugQuery } from '../../../modules/listings/queries/listing-queries'

const LISTING_TYPE_LABELS: Record<string, string> = {
  sale: 'Venta', rent: 'Arriendo', service: 'Servicio',
  quote: 'Cotización', alliance: 'Alianza',
}
const LISTING_TYPE_COLORS: Record<string, string> = {
  sale:     'bg-agrobot-100 text-agrobot-800',
  rent:     'bg-blue-100 text-blue-800',
  service:  'bg-purple-100 text-purple-800',
  quote:    'bg-amber-100 text-amber-800',
  alliance: 'bg-gray-100 text-gray-700',
}

function fmtPrice(price: string | null, unit: string | null) {
  if (!price) return null
  const n = parseFloat(price)
  return { amount: n.toLocaleString('es-VE'), unit }
}

export function AnuncioDetallePage() {
  const { id: slug } = useParams<{ id: string }>()
  const { data: listing, isLoading, isError } = useListingBySlugQuery(slug)

  const [activeImg,  setActiveImg]  = useState(0)
  const [question,   setQuestion]   = useState('')
  const [saved,      setSaved]      = useState(false)

  /* ── Loading ─────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-agrobot-600" />
          <p className="text-sm text-gray-400">Cargando publicación…</p>
        </div>
      </div>
    )
  }

  /* ── Not found ────────────────────────────── */
  if (isError || !listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
          <Package className="h-10 w-10 text-gray-300" />
        </div>
        <p className="text-base font-semibold text-gray-600">Publicación no encontrada</p>
        <p className="text-sm text-gray-400">El anuncio no existe o fue eliminado.</p>
        <Link
          to="/catalogo"
          className="mt-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-agrobot-800 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  const images  = listing.media.length > 0 ? listing.media : []
  const hasImgs = images.length > 0
  const price   = fmtPrice(listing.price, listing.priceUnit)

  const whatsappMsg = encodeURIComponent(
    `Hola, me interesa: *${listing.title}* — ${window.location.href}`
  )

  const fichaTecnica = [
    { label: 'Categoría',  value: listing.category?.name ?? '—' },
    ...(listing.subcategory ? [{ label: 'Subcategoría', value: listing.subcategory.name }] : []),
    { label: 'Tipo de operación', value: LISTING_TYPE_LABELS[listing.listingType] ?? listing.listingType },
    ...(listing.department   ? [{ label: 'Estado / Departamento', value: listing.department }]   : []),
    ...(listing.municipality ? [{ label: 'Municipio',            value: listing.municipality }] : []),
    ...listing.attributes.map((a) => ({ label: `Atributo #${a.attributeId}`, value: a.value })),
  ]

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-4">

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-5 flex-wrap">
          <Link to="/" className="hover:text-agrobot-700 transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to="/catalogo" className="hover:text-agrobot-700 transition-colors">Catálogo</Link>
          {listing.category && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link to={`/catalogo?categoryId=${listing.category.id}`} className="hover:text-agrobot-700 transition-colors">
                {listing.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-gray-600 truncate max-w-[200px] sm:max-w-xs">{listing.title}</span>
        </nav>

        {/* ── Main grid ──────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left column */}
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              {hasImgs ? (
                <div className="flex gap-0">
                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="flex flex-col gap-1.5 p-3 border-r border-gray-100 max-h-[460px] overflow-y-auto">
                      {images.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImg(i)}
                          className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImg === i ? 'border-agrobot-500' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={img.url} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main image */}
                  <div className="relative flex-1">
                    <img
                      src={images[activeImg]?.url}
                      alt={listing.title}
                      className="h-[460px] w-full object-contain bg-white p-4"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                          disabled={activeImg === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setActiveImg((i) => Math.min(images.length - 1, i + 1))}
                          disabled={activeImg === images.length - 1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImg(i)}
                              className={`h-1.5 rounded-full transition-all ${
                                activeImg === i ? 'w-4 bg-agrobot-500' : 'w-1.5 bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {listing.isFeatured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                        <Star className="h-3 w-3 fill-white" /> Destacado
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center bg-gray-50 text-gray-200">
                  <Package className="h-24 w-24" />
                </div>
              )}
            </div>

            {/* Title + meta (mobile only — desktop shows in sidebar) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:hidden">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {listing.category && (
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800 uppercase">
                      {listing.category.name}
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${LISTING_TYPE_COLORS[listing.listingType] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LISTING_TYPE_LABELS[listing.listingType] ?? listing.listingType}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => setSaved(v => !v)} className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${saved ? 'border-red-300 text-red-400' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}>
                    <Heart className={`h-4 w-4 ${saved ? 'fill-red-400' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h1 className="font-display text-xl font-bold text-gray-900 leading-snug mb-2">{listing.title}</h1>
              {listing.department && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {[listing.municipality, listing.department].filter(Boolean).join(', ')}
                </div>
              )}
              {price && (
                <p className="mt-3 text-3xl font-black text-gray-900">
                  ${price.amount}
                  {price.unit && <span className="text-sm font-normal text-gray-500 ml-1">/ {price.unit}</span>}
                </p>
              )}
            </div>

            {/* Descripción */}
            {listing.description && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-display text-base font-bold text-gray-900 mb-3">Descripción</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Ficha técnica */}
            {fichaTecnica.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-display text-base font-bold text-gray-900 mb-4">Detalles Técnicos</h2>
                <div className="divide-y divide-gray-50">
                  {fichaTecnica.map(({ label, value }, i) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm ${i % 2 === 0 ? 'bg-gray-50/60' : ''}`}
                    >
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Garantías / Confianza */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">Características Principales</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-agrobot-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Publicación verificada</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Revisada por nuestro equipo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <Zap className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Respuesta rápida</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">El vendedor responde pronto</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <Truck className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Consultar envío</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Coordiná con el vendedor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preguntas */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-agrobot-600" />
                  Preguntas al Vendedor
                </span>
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Cuál es la disponibilidad? ¿Hay descuento por volumen?…"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20 bg-gray-50 focus:bg-white transition-colors"
                />
                <button className="flex items-center gap-1.5 rounded-xl bg-agrobot-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors shrink-0">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Inicia sesión para enviar preguntas al vendedor.
              </p>
            </div>

          </div>

          {/* ── Right sidebar (sticky) ─────────────────── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:h-fit">

            {/* Title + Price card */}
            <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {listing.category && (
                    <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800 uppercase">
                      {listing.category.name}
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${LISTING_TYPE_COLORS[listing.listingType] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LISTING_TYPE_LABELS[listing.listingType] ?? listing.listingType}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setSaved(v => !v)} className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${saved ? 'border-red-300 text-red-400' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}>
                    <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-red-400' : ''}`} />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-agrobot-600 transition-colors">
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-400 transition-colors">
                    <AlertCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h1 className="font-display text-lg font-bold text-gray-900 leading-snug mb-2">
                {listing.title}
              </h1>

              {listing.department && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {[listing.municipality, listing.department].filter(Boolean).join(', ')}
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-4">
                <Eye className="h-3.5 w-3.5" />
                {listing.viewCount.toLocaleString('es-VE')} vistas
                <span className="text-gray-200">·</span>
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <Star className="h-3.5 w-3.5 text-gray-200 fill-gray-200" />
              </div>

              {price ? (
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <p className="text-3xl font-black text-gray-900">
                    ${price.amount}
                    {price.unit && <span className="text-sm font-normal text-gray-500 ml-1">/ {price.unit}</span>}
                  </p>
                </div>
              ) : (
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <p className="text-base font-semibold text-gray-500">Precio a consultar</p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button className="w-full rounded-xl bg-agrobot-700 py-3.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  Consultar
                </button>
                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] py-3.5 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Seller card */}
            {listing.store && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Información del vendedor
                </p>
                <div className="flex items-center gap-3 mb-4">
                  {listing.store.logoUrl ? (
                    <img
                      src={listing.store.logoUrl}
                      alt={listing.store.name}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-gray-100"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-agrobot-700 text-sm font-bold text-white shrink-0">
                      {listing.store.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-900 truncate">{listing.store.name}</p>
                      {listing.store.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-agrobot-600" />
                      )}
                    </div>
                    {listing.store.department && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {[listing.store.municipality, listing.store.department].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {listing.store.isVerified && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-agrobot-700">
                        <ShieldCheck className="h-3 w-3" /> Vendedor verificado
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/tiendas/${listing.store.slug}`}
                  className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 hover:bg-agrobot-50/50 transition-colors"
                >
                  Ver más productos del vendedor →
                </Link>
              </div>
            )}

            {/* Report */}
            <button className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors py-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Denunciar publicación
            </button>

          </aside>
        </div>

        {/* ── Mobile CTA bar ──────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3 lg:hidden">
          <button className="flex-1 rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
            Consultar
          </button>
          <a
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-4 py-3 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/5 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>

      </div>
    </div>
  )
}

import { useState } from 'react'
import { Star, Heart, Share2, MessageCircle, MapPin } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ─── Hero Banner ──────────────────────────────────────────────────────────────

interface HeroPerfilProps {
  bg?: string
  children?: React.ReactNode
  height?: number
}

export function HeroPerfil({ bg = '/farm-bg.png', children, height = 280 }: HeroPerfilProps) {
  return (
    <div
      className="relative w-full"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%), url('${bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height,
      }}
    >
      {children}
    </div>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

export function StarRating({ rating, reviews, light = false }: { rating: number; reviews: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : light ? 'text-white/30' : 'text-gray-200'}`} />
        ))}
      </div>
      <span className={`text-sm font-bold ${light ? 'text-white' : 'text-gray-800'}`}>{rating}</span>
      <span className={`text-xs ${light ? 'text-white/70' : 'text-gray-400'}`}>({reviews} reseñas)</span>
    </div>
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

interface Review {
  initials: string
  name: string
  role: string
  ago: string
  rating: number
  text: string
  color: string
  verified?: boolean
}

export const defaultReviews: Review[] = [
  { initials: 'JD', name: 'Juan D\'Amico', role: 'Productor · Córdoba', ago: 'Hace 2 semanas', rating: 5, text: '"Excelente calidad de grano y cumplimiento en los plazos de carga. El Ing. Alberto muy predispuesto. Repetiremos la compra sin dudas."', color: 'bg-agrobot-700', verified: true },
  { initials: 'RM', name: 'Ricardo M.', role: 'Exportador · Guárico', ago: 'Hace 1 mes', rating: 4, text: '"Muy buen servicio, entrega puntual y producto dentro de los parámetros acordados. Recomendado para volúmenes medianos."', color: 'bg-sky-600' },
]

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${review.color}`}>
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{review.name}</p>
            <p className="text-xs text-gray-400">{review.role} · {review.ago}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed italic">{review.text}</p>
      {review.verified && (
        <p className="mt-2 text-xs font-semibold text-agrobot-700">✓ Compra verificada</p>
      )}
    </div>
  )
}

export function ReviewsSection({ reviews = defaultReviews, title = 'Reseñas Recientes' }: { reviews?: Review[]; title?: string }) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">{title}</h2>
        <button className="text-sm font-semibold text-agrobot-700 hover:underline">Ver todas</button>
      </div>
      <div className="flex flex-col gap-3">
        {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
      </div>
    </div>
  )
}

// ─── Map section ──────────────────────────────────────────────────────────────

const singleMarker = new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#15803d;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export function MapaUbicacion({ lat, lng, label, note }: { lat: number; lng: number; label: string; note?: string }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-gray-900 mb-3">Ubicación Aproximada</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: 220 }}>
        <MapContainer center={[lat, lng]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} zoomControl={false}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={singleMarker}>
            <Popup><strong style={{ color: '#14532d' }}>{label}</strong></Popup>
          </Marker>
        </MapContainer>
      </div>
      {note && <p className="mt-2 flex items-center gap-1 text-xs text-gray-400"><MapPin className="h-3 w-3" />{note}</p>}
    </div>
  )
}

// ─── Guardar / Compartir row ──────────────────────────────────────────────────

export function AccionesRow() {
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex gap-2">
      <button onClick={() => setSaved(v => !v)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${saved ? 'border-agrobot-400 bg-agrobot-50 text-agrobot-700' : 'border-gray-200 text-gray-600 hover:border-agrobot-300'}`}>
        <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-agrobot-600 text-agrobot-600' : ''}`} />
        {saved ? 'Guardado' : 'Guardar'}
      </button>
      <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 transition-colors">
        <Share2 className="h-3.5 w-3.5" />Compartir
      </button>
    </div>
  )
}

// ─── WhatsApp + Cotizar buttons ───────────────────────────────────────────────

export function CTAButtons({
  cotizarLabel = 'Cotizar',
  whatsappHref,
}: {
  cotizarLabel?: string
  whatsappHref?: string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800"
        >
          <MessageCircle className="h-4 w-4" />WhatsApp
        </a>
      ) : (
        <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-agrobot-800">
          <MessageCircle className="h-4 w-4" />WhatsApp
        </button>
      )}
      <button className="flex items-center gap-2 rounded-xl border border-agrobot-700 px-5 py-2.5 text-sm font-bold text-agrobot-700 transition-colors hover:bg-agrobot-50">
        {cotizarLabel}
      </button>
    </div>
  )
}

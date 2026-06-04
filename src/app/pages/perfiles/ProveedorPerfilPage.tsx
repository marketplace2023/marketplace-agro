import { useState } from 'react'
import { Clock, ShieldCheck, MapPin, Heart, Share2, MessageCircle, FileText, Star, ThumbsUp, Send } from 'lucide-react'
import { StarRating, ReviewCard, defaultReviews, MapaUbicacion } from '../../../modules/empresa/components/perfil-shared'

const ofertasTemporada = [
  { id: 1, badge: '-15% HOY', badgeColor: 'bg-red-500', category: 'MAQUINARIA ENERGÉTICA', name: 'Generador Diesel...', price: 'USD 8.200', original: 'USD 9.650', image: '/bg-cafe.png' },
  { id: 2, badge: null, category: 'INSUMOS CRÍTICOS', name: 'Fertilizante NPK Pack...', price: 'USD 1.450', original: 'USD 1.800', image: '/farm-bg.png' },
]

const catalogo = [
  { id: 1, seller: 'AgroTech Solutions', name: 'AgroDrone V2 - Mapeo Multiespectral', price: 'USD 3.200', sub: 'Envío gratis a todo el país', image: '/farm-bg.png' },
  { id: 2, seller: 'Semillas del Plata', name: 'Girasol Híbrido - Bolsa 80k Semillas', price: 'USD 185', sub: 'Stock disponible: 500 un.', image: '/bg-cafe.png' },
  { id: 3, seller: 'PowerTools Ag', name: 'Cabezal Maicero 12 Surcos Reforzado', price: 'USD 45.000', sub: 'Garantía oficial 2 años', image: '/farm-bg.png' },
]

const preguntas = [
  { q: '¿Tienen financiamiento directo a 12 meses con cheque certificado?', a: 'Hola! Sí, contamos con planes propios hasta 18 meses con tasas competitivas y convenios con bancos. Si te interesa, podemos enviarte la planilla de requisitos por privado.', time: 'Respondido hace 4 horas' },
  { q: '¿El precio del drone incluye la capacitación de uso de software?', a: 'Buen día. Así es, con la compra del AgroDrone V2 incluimos una jornada de capacitación presencial o virtual para todo tu equipo de campo y el set up inicial del software de mapeo.', time: 'Respondido hace 1 día' },
]

export function ProveedorPerfilPage() {
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-white min-h-screen pb-12">

      {/* Hero overlay style */}
      <div
        className="relative flex items-end"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%), url('/farm-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 280,
        }}
      >
        <div className="w-full p-6">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
                <img src="/logoagro.svg" alt="logo" className="h-12 w-auto" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-display text-2xl font-bold text-white">AgroMaquinarias del Sur S.A.</h1>
                  <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white">LÍDER PLATINUM</span>
                </div>
                <StarRating rating={4.8} reviews={152} light />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSaved(v => !v)} className="flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-white border border-white/30 hover:bg-white/30 transition-colors">
                <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-white' : ''}`} />Guardar
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-white border border-white/30 hover:bg-white/30 transition-colors">
                <Share2 className="h-3.5 w-3.5" />Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Información del Vendedor</p>
            {[
              { Icon: Clock, value: '12 años en TierraMarket' },
              { Icon: ShieldCheck, value: '< 2 horas tiempo de respuesta' },
              { Icon: FileText, value: 'Documentos Verificados' },
            ].map(({ Icon, value }, i) => (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agrobot-50">
                  <Icon className="h-3.5 w-3.5 text-agrobot-700" />
                </div>
                <p className="text-xs font-medium text-gray-700">{value}</p>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              <button className="w-full rounded-xl bg-agrobot-700 py-2.5 text-xs font-bold text-white hover:bg-agrobot-800 transition-colors">
                Cotizar Ahora
              </button>
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-agrobot-700 py-2.5 text-xs font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />WhatsApp Directo
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <MapaUbicacion lat={9.5545} lng={-69.1956} label="AgroMaquinarias del Sur" />
            <div className="p-3 bg-white">
              <p className="text-xs font-semibold text-gray-700">Sede Principal: Acarigua, Portuguesa</p>
              <button className="text-xs text-agrobot-700 font-semibold hover:underline mt-0.5">Ver 4 sucursales más</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Ofertas temporada */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-gray-900">🔥 Ofertas de Temporada</h2>
              <button className="text-sm font-semibold text-agrobot-700 hover:underline">Ver todas</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ofertasTemporada.map(o => (
                <div key={o.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="h-28 overflow-hidden">
                    <img src={o.image} alt={o.name} className="h-full w-full object-cover" />
                    {o.badge && <span className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold text-white ${o.badgeColor}`}>{o.badge}</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">{o.category}</p>
                    <p className="text-xs font-bold text-gray-900">{o.name}</p>
                    <p className="text-base font-bold text-gray-900 mt-1">{o.price}</p>
                    <p className="text-xs text-gray-400 line-through">{o.original}</p>
                    <button className="mt-2 w-full rounded-lg border border-gray-200 py-1 text-xs font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">Solicitar Oferta</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catálogo */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-gray-900">Catálogo Completo</h2>
              <div className="flex gap-2">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 transition-colors">Categorías ▾</button>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-300 transition-colors">Menor Precio</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {catalogo.map(p => (
                <div key={p.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-32 overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gray-400">{p.seller}</p>
                    <p className="text-xs font-bold text-gray-900 line-clamp-2">{p.name}</p>
                    <p className="text-sm font-bold text-agrobot-700 mt-1">{p.price}</p>
                    <p className="text-[10px] text-gray-400">{p.sub}</p>
                    <button className="mt-2 w-full rounded-lg border border-gray-200 py-1 text-[10px] font-bold text-gray-700 uppercase tracking-wide hover:border-agrobot-400 transition-colors">Ver Producto</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Lo que dicen los productores</h2>
            <div className="flex flex-col gap-3">
              {defaultReviews.map((r, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${r.color}`}>{r.initials}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
                      <span className="text-xs text-gray-400">{r.ago}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 italic leading-relaxed">{r.text}</p>
                  <div className="mt-2 flex items-center gap-3">
                    {r.verified && <span className="text-xs font-semibold text-agrobot-700">✓ Compra verificada</span>}
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      <ThumbsUp className="h-3 w-3" />Útil
                    </button>
                  </div>
                </div>
              ))}
              <button className="text-sm font-semibold text-agrobot-700 hover:underline text-center py-2">Ver las 152 reseñas</button>
            </div>
          </div>

          {/* Q&A */}
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Preguntas al Vendedor</h2>
            <div className="flex gap-2 mb-4">
              <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Escribe tu consulta..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20"
              />
              <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                <Send className="h-4 w-4" />Preguntar
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {preguntas.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                    <p className="text-sm font-medium text-gray-800">{p.q}</p>
                  </div>
                  <div className="ml-6 rounded-lg bg-agrobot-50 border-l-2 border-agrobot-400 px-3 py-2">
                    <p className="text-xs text-gray-700 leading-relaxed">{p.a}</p>
                    <p className="mt-1 text-[10px] text-gray-400">{p.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

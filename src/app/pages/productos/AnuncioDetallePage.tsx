import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, BarChart2, Share2, AlertCircle, MapPin, Clock, CheckCircle2, Star, Send, MessageCircle } from 'lucide-react'

const fichaTecnica = [
  { label: 'Categoría', value: 'Insumos Agrícolas' },
  { label: 'SKU', value: 'TM-INS-00421' },
  { label: 'Origen', value: 'Venezuela' },
  { label: 'Disponibilidad', value: 'En stock' },
  { label: 'Unidad mínima', value: '1 unidad' },
]

const preguntas = [
  { q: '¿Hacen envíos al interior del país?', a: 'Sí, trabajamos con transportistas certificados a todo el territorio nacional. El costo varía según la zona y el volumen.', time: 'Hace 3 días' },
  { q: '¿Aceptan pago en divisas?', a: 'Aceptamos USD en efectivo, transferencia bancaria y pago móvil en bolívares al tasa del día.', time: 'Hace 1 semana' },
]

const similares = [
  { name: 'Fertilizante NPK 15-15-15', price: '$420 / Ton', image: '/farm-bg.png' },
  { name: 'Urea Granulada 46%', price: '$699 / Ton', image: '/bg-cafe.png' },
  { name: 'Sulfato de Amonio 21%', price: '$380 / Ton', image: '/farm-bg.png' },
]

export function AnuncioDetallePage() {
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Catálogo</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Detalle de publicación</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">

          {/* Main */}
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              <img src="/farm-bg.png" alt="" className="h-64 w-full object-cover" />
              <img src="/bg-cafe.png" alt="" className="h-64 w-full object-cover" />
            </div>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-agrobot-100 px-2.5 py-0.5 text-[10px] font-bold text-agrobot-800 mb-2">INSUMOS AGRÍCOLAS</span>
                  <h1 className="font-display text-xl font-bold text-gray-900">Fertilizante Granulado Compuesto Premium</h1>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-semibold text-gray-700">4.7</span> (38 reseñas)</div>
                    <span>·</span>
                    <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Acarigua, Portuguesa</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
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

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Fertilizante de alta concentración formulado para maximizar el rendimiento en cultivos de cereales, oleaginosas y hortalizas. Composición balanceada NPK con microelementos esenciales. Ideal para aplicación en presiembra y cobertura.
              </p>
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
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">Preguntas al Vendedor</h2>
              <div className="flex gap-2 mb-4">
                <input value={question} onChange={e => setQuestion(e.target.value)}
                  placeholder="Escribe tu consulta..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20"
                />
                <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {preguntas.map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                      <p className="text-sm font-medium text-gray-800">{p.q}</p>
                    </div>
                    <div className="ml-6 rounded-lg border-l-2 border-agrobot-400 bg-white px-3 py-2">
                      <p className="text-xs text-gray-700 leading-relaxed">{p.a}</p>
                      <p className="mt-1 text-[10px] text-gray-400">{p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Anuncios Similares</h2>
              <div className="grid grid-cols-3 gap-3">
                {similares.map(s => (
                  <div key={s.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <img src={s.image} alt={s.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2">{s.name}</p>
                      <p className="mt-1 text-sm font-bold text-agrobot-700">{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-20 flex flex-col gap-4 h-fit">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">$520 <span className="text-sm font-normal text-gray-500">/ Ton</span></p>
              <p className="text-xs text-gray-400 line-through mb-4">$650 / Ton</p>
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Cotizar ahora</button>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-agrobot-700 py-3 text-sm font-bold text-agrobot-700 hover:bg-agrobot-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />WhatsApp
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Vendedor</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agrobot-700 text-sm font-bold text-white">AT</div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-900">AgroTec Insumos</p>
                    <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />4.8 · 86 ventas
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <Clock className="h-3.5 w-3.5" />Responde en menos de 2 horas
              </div>
              <Link to="/tiendas/agrotec" className="block w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                Ver perfil del vendedor
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

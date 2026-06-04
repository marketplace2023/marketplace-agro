import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Heart, BarChart2, CheckCircle2, Star, Send, MessageCircle, FileText, AlertTriangle, ExternalLink } from 'lucide-react'

const fichaTecnica = [
  { label: 'Composición', value: 'N 46%' },
  { label: 'Formulación', value: 'Granulada' },
  { label: 'pH en solución', value: '7.5 – 8.5' },
  { label: 'Solubilidad', value: '1,080 g/L a 20°C' },
  { label: 'Registro SASA', value: 'SASA-2019-4521' },
  { label: 'Presentación', value: 'Sacos 50kg / Big bag 1,000kg / Granel' },
  { label: 'Origen', value: 'Haifa Group · Israel' },
]

const cultivos = ['Maíz', 'Arroz', 'Caña de Azúcar', 'Sorgo', 'Pastos', 'Soja', 'Hortalizas']

const preguntas = [
  { q: '¿Cuál es el volumen mínimo para despacho a campo?', a: 'El mínimo para despacho con camión propio es 5 toneladas. Para volúmenes menores coordinamos retiro en depósito o envío por tercero.', time: 'Hace 2 días' },
]

const similares = [
  { name: 'Sulfato de Amonio 21%', price: '$380 / Ton', image: '/farm-bg.png' },
  { name: 'DAP 18-46-0', price: '$890 / Ton', image: '/bg-cafe.png' },
  { name: 'KCl 60% Cloruro de Potasio', price: '$720 / Ton', image: '/farm-bg.png' },
]

export function InsumoAgricolaDetallePage() {
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(false)
  const [qty, setQty] = useState(1)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4">

        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-agrobot-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalogo" className="hover:text-agrobot-700">Insumos</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Urea Granulada 46%</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
          <div className="flex flex-col gap-5">

            {/* Gallery */}
            <div className="grid grid-cols-[1fr_80px] gap-2">
              <img src="/bg-cafe.png" alt="" className="h-72 w-full rounded-xl object-cover" />
              <div className="flex flex-col gap-2">
                <img src="/farm-bg.png" alt="" className="h-[calc(50%-4px)] w-full rounded-xl object-cover" />
                <img src="/bg-cafe.png" alt="" className="h-[calc(50%-4px)] w-full rounded-xl object-cover" />
              </div>
            </div>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-full bg-lime-100 px-2.5 py-0.5 text-[10px] font-bold text-lime-800 mb-2">FERTILIZANTE NITROGENADO</span>
                  <h1 className="font-display text-xl font-bold text-gray-900">Urea Granulada 46% Nitrógeno</h1>
                  <p className="text-xs text-gray-500 mt-1">Haifa Group · Registro SASA-2019-4521</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-700">4.5</span>
                    <span>(45 compras)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(v => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                    <Heart className={`h-4 w-4 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-agrobot-400 hover:text-agrobot-600 transition-colors">
                    <BarChart2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ficha técnica */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Ficha Técnica</h2>
              <div className="divide-y divide-gray-100">
                {fichaTecnica.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hoja de seguridad */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Hoja de Seguridad (MSDS)</p>
                  <p className="text-xs text-amber-600">Manejo, almacenamiento y disposición final</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors">
                <FileText className="h-3.5 w-3.5" />Descargar PDF
              </button>
            </div>

            {/* Cultivos */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Cultivos Recomendados</h2>
              <div className="flex flex-wrap gap-2">
                {cultivos.map(c => (
                  <span key={c} className="rounded-full border border-agrobot-200 bg-agrobot-50 px-3 py-1 text-xs font-medium text-agrobot-800">
                    🌱 {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Inventario */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Inventario</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Stock disponible</span>
                <span className="rounded-full bg-agrobot-100 px-2.5 py-0.5 text-xs font-bold text-agrobot-800">240 Ton disponibles</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100">
                <div className="h-2.5 rounded-full bg-agrobot-600" style={{ width: '48%' }} />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">48% del stock total disponible</p>
            </div>

            {/* Proveedor */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Proveedor</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">AT</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-900">AgroTec Insumos Integrales</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-agrobot-600" />
                    </div>
                    <p className="text-xs text-gray-400">Distribuidor autorizado · Portuguesa</p>
                  </div>
                </div>
                <Link to="/tiendas/agrotec" className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-agrobot-400 hover:text-agrobot-700 transition-colors">
                  <ExternalLink className="h-3 w-3" />Ver tienda
                </Link>
              </div>
            </div>

            {/* Preguntas */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-gray-900 mb-4">Preguntas</h2>
              <div className="flex gap-2 mb-4">
                <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Escribe tu consulta sobre este insumo..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-agrobot-400 focus:ring-1 focus:ring-agrobot-400/20"
                />
                <button className="flex items-center gap-2 rounded-xl bg-agrobot-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {preguntas.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                    <p className="text-sm font-medium text-gray-800">{p.q}</p>
                  </div>
                  <div className="ml-6 rounded-lg border-l-2 border-agrobot-400 bg-white px-3 py-2">
                    <p className="text-xs text-gray-700">{p.a}</p>
                    <p className="mt-1 text-[10px] text-gray-400">{p.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Similares */}
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 mb-3">Insumos Similares</h2>
              <div className="grid grid-cols-3 gap-3">
                {similares.map(s => (
                  <div key={s.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <img src={s.image} alt={s.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900">{s.name}</p>
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
              <p className="text-xs text-gray-400 line-through">$850 / Ton</p>
              <p className="text-2xl font-bold text-gray-900">$699 <span className="text-sm font-normal text-gray-500">/ Ton</span></p>
              <div className="mt-3 mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Cantidad (Ton)</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(v => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-agrobot-400 transition-colors">-</button>
                  <span className="flex-1 text-center text-sm font-bold">{qty}</span>
                  <button onClick={() => setQty(v => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-agrobot-400 transition-colors">+</button>
                </div>
                <p className="mt-1 text-xs text-agrobot-700 font-semibold">Total: ${(699 * qty).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-xl bg-agrobot-700 py-3 text-sm font-bold text-white hover:bg-agrobot-800 transition-colors">Cotizar</button>
                <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-agrobot-400 transition-colors">Preguntar</button>
                <Link to="/tiendas/agrotec" className="w-full block text-center rounded-xl border border-sky-300 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition-colors">
                  Ir al proveedor
                </Link>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Heart className="h-3.5 w-3.5" />Guardar</button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><BarChart2 className="h-3.5 w-3.5" />Comparar</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
